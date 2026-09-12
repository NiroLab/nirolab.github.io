/**
 * NIRO Lab file-based CMS - data pipeline (design.md §7.3).
 *
 * Discovery:  import.meta.glob over /content at build/dev time.
 *             Dropping a markdown file into the right folder is the ONLY
 *             step needed to publish new content - zero code edits.
 * Parsing:    gray-matter frontmatter + shared markdown pipeline.
 * Validation: zod schemas from src/types/content.ts. Invalid files are
 *             skipped with descriptive warnings (console + dev badge).
 *
 * STABLE API consumed by page agents - do not rename:
 *   useSite() · usePeople() · usePerson(slug) · useProjects() ·
 *   useProject(slug) · usePublications() · useNews() · useNewsPost(slug) ·
 *   useGallery() · useAchievements()
 */
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import type { z } from "zod";
import {
  achievementSchema,
  gallerySchema,
  newsSchema,
  personSchema,
  projectSchema,
  publicationSchema,
  siteConfigSchema,
  type PersonFrontmatter,
  type ProjectFrontmatter,
  type PublicationFrontmatter,
  type NewsFrontmatter,
  type GalleryFrontmatter,
  type AchievementFrontmatter,
  type SiteConfig,
  type PersonCategory,
} from "@/types/content";
import { renderMarkdown, readingTime } from "./markdown";
import { resolveImage } from "./images";

// ---------------------------------------------------------------- types

export interface ContentWarning {
  file: string;
  issues: string[];
}

interface Base {
  /** kebab-case slug derived from the file path */
  slug: string;
  /** original /content path, e.g. /content/news/2025-07-10-….md */
  filePath: string;
}

export interface Person extends PersonFrontmatter, Base {
  body: string;
  /** rendered HTML of body */
  html: string;
  /** resolved image (contributor path or typed placeholder) */
  imageSrc: string;
}

export interface Project extends ProjectFrontmatter, Base {
  body: string;
  html: string;
  imageSrc: string;
  /** team names matched to people by exact name (auto-link) */
  teamMembers: Person[];
}

export interface Publication extends PublicationFrontmatter, Base {
  body: string;
  html: string;
  /** raw BibTeX from an optional sibling {slug}.bib */
  bibtex: string | null;
}

export interface NewsPost extends NewsFrontmatter, Base {
  body: string;
  html: string;
  imageSrc: string;
  /** minutes */
  readingTime: number;
}

export interface GalleryItem extends GalleryFrontmatter, Base {
  body: string;
  html: string;
  imageSrc: string;
}

export interface Achievement extends AchievementFrontmatter, Base {
  body: string;
  html: string;
  imageSrc: string;
  /** matching project, when `project` slug resolves */
  projectEntry: Project | null;
}

export interface PeopleGroups {
  founding_faculty: Person[];
  affiliated_faculty: Person[];
  ra: Person[];
  student: Person[];
  alumni: Person[];
}

// ------------------------------------------------------------- discovery

const mdModules = import.meta.glob("/content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const bibModules = import.meta.glob("/content/publications/**/*.bib", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const siteYmlModules = import.meta.glob("/content/site.yml", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// --------------------------------------------------------------- helpers

const warnings: ContentWarning[] = [];

function warn(file: string, issues: string[]) {
  warnings.push({ file, issues });
  // eslint-disable-next-line no-console
  console.warn(
    `[NIRO CMS] Skipping invalid content file: ${file}\n  - ${issues.join("\n  - ")}`,
  );
}

function formatIssues(error: z.ZodError): string[] {
  return error.issues.map(
    (i) => `${i.path.join(".") || "(frontmatter)"}: ${i.message}`,
  );
}

function parseEntry<S extends z.ZodType>(
  filePath: string,
  raw: string,
  schema: S,
): { data: z.infer<S>; body: string } | null {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(raw);
  } catch (e) {
    warn(filePath, [
      `frontmatter parse error: ${e instanceof Error ? e.message : String(e)}`,
    ]);
    return null;
  }
  const result = schema.safeParse(parsed.data);
  if (!result.success) {
    warn(filePath, formatIssues(result.error));
    return null;
  }
  return { data: result.data as z.infer<S>, body: parsed.content.trim() };
}

function slugFromPath(filePath: string): string {
  const file = filePath.split("/").pop() ?? filePath;
  return file.replace(/\.(md|yml|yaml)$/i, "");
}

// ------------------------------------------------------------------ load

function loadPeople(): Person[] {
  const people: Person[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/people/")) continue;
    const entry = parseEntry(path, raw, personSchema);
    if (!entry) continue;
    people.push({
      ...entry.data,
      slug: slugFromPath(path),
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      imageSrc: resolveImage(entry.data.image, "person"),
    });
  }
  const byOrder = (a: Person, b: Person) =>
    (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);
  return people.sort(byOrder);
}

function loadProjects(people: Person[]): Project[] {
  const byName = new Map(people.map((p) => [p.name, p]));
  const projects: Project[] = [];
  const seen = new Set<string>();
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/projects/")) continue;
    const slug = slugFromPath(path);
    // content/projects/{slug}/{slug}.md is the main entry; extra sibling
    // pages (results.md, media.md …) are auxiliary and skipped here.
    const parentDir = path.split("/").slice(-2, -1)[0];
    if (parentDir !== slug) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    const entry = parseEntry(path, raw, projectSchema);
    if (!entry) continue;
    projects.push({
      ...entry.data,
      slug,
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      imageSrc: resolveImage(entry.data.image, "project"),
      teamMembers: entry.data.team
        .map((name) => byName.get(name))
        .filter((p): p is Person => Boolean(p)),
    });
  }
  return projects.sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title),
  );
}

function loadPublications(): Publication[] {
  const bibs = new Map(
    Object.entries(bibModules).map(([path, raw]) => [slugFromPath(path), raw]),
  );
  const pubs: Publication[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/publications/")) continue;
    const entry = parseEntry(path, raw, publicationSchema);
    if (!entry) continue;
    const slug = slugFromPath(path);
    pubs.push({
      ...entry.data,
      slug,
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      bibtex: bibs.get(slug) ?? null,
    });
  }
  return pubs.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

function loadNews(): NewsPost[] {
  const posts: NewsPost[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/news/")) continue;
    const entry = parseEntry(path, raw, newsSchema);
    if (!entry) continue;
    posts.push({
      ...entry.data,
      slug: slugFromPath(path),
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      imageSrc: resolveImage(entry.data.image, "news"),
      readingTime: readingTime(entry.body),
    });
  }
  // pinned first, then newest first
  return posts.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.getTime() - a.date.getTime();
  });
}

function loadGallery(): GalleryItem[] {
  const items: GalleryItem[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/gallery/")) continue;
    const entry = parseEntry(path, raw, gallerySchema);
    if (!entry) continue;
    items.push({
      ...entry.data,
      slug: slugFromPath(path),
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      imageSrc: resolveImage(entry.data.image, "gallery"),
    });
  }
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function loadAchievements(projects: Project[]): Achievement[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const items: Achievement[] = [];
  for (const [path, raw] of Object.entries(mdModules)) {
    if (!path.startsWith("/content/achievements/")) continue;
    const entry = parseEntry(path, raw, achievementSchema);
    if (!entry) continue;
    items.push({
      ...entry.data,
      slug: slugFromPath(path),
      filePath: path,
      body: entry.body,
      html: renderMarkdown(entry.body),
      imageSrc: resolveImage(entry.data.image, "achievement"),
      projectEntry: entry.data.project
        ? (bySlug.get(entry.data.project) ?? null)
        : null,
    });
  }
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function loadSite(): SiteConfig {
  const raw = Object.values(siteYmlModules)[0];
  const file = Object.keys(siteYmlModules)[0] ?? "/content/site.yml";
  if (!raw) {
    warn(file, ["content/site.yml not found - using built-in defaults"]);
    return siteConfigSchema.parse({
      name: "NIRO Lab",
      fullName: "NSU Intelligent Robotics Lab",
      tagline:
        "Advancing robotics research through innovation and collaboration",
      email: "nirolaboratory@gmail.com",
      address:
        "NIRO Lab, North South University, Bashundhara, Dhaka-1229, Bangladesh",
      nav: [{ label: "Home", path: "/" }],
    });
  }
  let data: unknown;
  try {
    data = loadYaml(raw);
  } catch (e) {
    warn(file, [
      `YAML parse error: ${e instanceof Error ? e.message : String(e)}`,
    ]);
    data = {};
  }
  const result = siteConfigSchema.safeParse(data);
  if (!result.success) {
    warn(file, formatIssues(result.error));
    // fall back to defaults merged with whatever parsed
    return siteConfigSchema.parse({
      name: "NIRO Lab",
      fullName: "NSU Intelligent Robotics Lab",
      tagline:
        "Advancing robotics research through innovation and collaboration",
      email: "nirolaboratory@gmail.com",
      address:
        "NIRO Lab, North South University, Bashundhara, Dhaka-1229, Bangladesh",
      nav: [{ label: "Home", path: "/" }],
    });
  }
  return result.data;
}

// -------------------------------------------------- module-level singleton

const people = loadPeople();
const projects = loadProjects(people);
const publications = loadPublications();
const news = loadNews();
const gallery = loadGallery();
const achievements = loadAchievements(projects);
const site = loadSite();

const peopleGroups: PeopleGroups = {
  founding_faculty: [],
  affiliated_faculty: [],
  ra: [],
  student: [],
  alumni: [],
};
for (const p of people) peopleGroups[p.category as PersonCategory].push(p);

const peopleBySlug = new Map(people.map((p) => [p.slug, p]));
const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));
const newsBySlug = new Map(news.map((n) => [n.slug, n]));
const publicationYears = [...new Set(publications.map((p) => p.year))].sort(
  (a, b) => b - a,
);

// ------------------------------------------------------------ public API

/** Global site configuration from content/site.yml */
export function useSite(): SiteConfig {
  return site;
}

/** All people, sorted by order then name. */
export function usePeople(): Person[] {
  return people;
}

/** People grouped by category (founding_faculty, affiliated_faculty, ra, student, alumni). */
export function usePeopleGrouped(): PeopleGroups {
  return peopleGroups;
}

export function usePerson(slug: string): Person | undefined {
  return peopleBySlug.get(slug);
}

export interface ProjectsResult {
  all: Project[];
  featured: Project[];
}

export function useProjects(): ProjectsResult {
  return { all: projects, featured: projects.filter((p) => p.featured) };
}

export function useProject(slug: string): Project | undefined {
  return projectsBySlug.get(slug);
}

export interface PublicationsResult {
  all: Publication[];
  /** distinct years, newest first - filter facets */
  years: number[];
  /** distinct research areas */
  areas: string[];
}

export function usePublications(): PublicationsResult {
  return {
    all: publications,
    years: publicationYears,
    areas: [...new Set(publications.flatMap((p) => p.areas))].sort(),
  };
}

/** News: pinned first, then date desc. */
export function useNews(): NewsPost[] {
  return news;
}

export function useNewsPost(slug: string): NewsPost | undefined {
  return newsBySlug.get(slug);
}

export function useGallery(): GalleryItem[] {
  return gallery;
}

/** Achievements sorted newest first - powers the Home honors strip. */
export function useAchievements(): Achievement[] {
  return achievements;
}

/** Invalid content files (dev-only ContentHealthBadge + console.warn). */
export function getContentWarnings(): ContentWarning[] {
  return warnings;
}

export type { SiteConfig };
export { PLACEHOLDERS, resolveImage, personInitials } from "./images";
export type { PlaceholderType } from "./images";
export { renderMarkdown, readingTime } from "./markdown";
