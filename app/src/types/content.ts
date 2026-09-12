import { z } from "zod";

/**
 * The content contract for the NIRO Lab file-based CMS (design.md §7.2).
 * Every markdown file under /content is validated against one of these
 * schemas at build/dev time. Invalid files are skipped with a descriptive
 * warning — they never crash the site.
 */

// ---------------------------------------------------------------- Person
export const personCategories = [
  "founding_faculty",
  "affiliated_faculty",
  "ra",
  "student",
  "alumni",
] as const;

export const personSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  category: z.enum(personCategories),
  order: z.number().int().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  office: z.string().optional(),
  image: z.string().optional(),
  website: z.string().optional(),
  scholar: z.string().optional(),
  linkedin: z.string().optional(),
  research_interests: z.string().optional(),
});

// ---------------------------------------------------------------- Project
export const projectStatuses = ["Active", "Completed", "Concept"] as const;

export const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(200),
  status: z.enum(projectStatuses).default("Active"),
  featured: z.boolean().default(false),
  order: z.number().int().optional(),
  image: z.string().optional(),
  duration: z.string().optional(),
  funding: z.string().optional(),
  areas: z.array(z.string()).default([]),
  team: z.array(z.string()).default([]),
  links: z
    .object({
      github: z.string().optional(),
      demo: z.string().optional(),
      paper: z.string().optional(),
    })
    .partial()
    .optional(),
});

// ------------------------------------------------------------ Publication
export const publicationTypes = [
  "journal",
  "conference",
  "workshop",
  "preprint",
] as const;

export const publicationSchema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  type: z.enum(publicationTypes).default("conference"),
  areas: z.array(z.string()).default([]),
  doi: z.string().optional(),
  pdf: z.string().optional(),
  code: z.string().optional(),
  abstract: z.string().optional(),
});

// ------------------------------------------------------------------- News
export const newsSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  pinned: z.boolean().default(false),
});

// ---------------------------------------------------------------- Gallery
export const galleryCategories = ["lab", "events", "research", "team"] as const;

export const gallerySchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  category: z.enum(galleryCategories).default("lab"),
  image: z.string().min(1),
  alt: z.string().optional(),
  credit: z.string().optional(),
});

// ------------------------------------------------------------ Achievement
export const achievementSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  rank: z.string().min(1),
  event: z.string().optional(),
  project: z.string().optional(),
  image: z.string().optional(),
  summary: z.string().optional(),
});

// ------------------------------------------------------------- SiteConfig
export const siteConfigSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().min(1),
  tagline: z.string().min(1),
  established: z.string().optional(),
  email: z.string().min(1),
  address: z.string().min(1),
  officeHours: z.string().optional(),
  university: z.string().default("North South University"),
  city: z.string().default("Dhaka, Bangladesh"),
  socials: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
      scholar: z.string().optional(),
    })
    .partial()
    .default({}),
  nav: z.array(z.object({ label: z.string(), path: z.string() })).min(1),
  stats: z
    .array(z.object({ value: z.number(), label: z.string() }))
    .default([]),
  toggles: z
    .object({ showAchievementsSection: z.boolean().default(true) })
    .partial()
    .default({}),
});

// ------------------------------------------------------------- Raw inferred
export type PersonFrontmatter = z.infer<typeof personSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type PublicationFrontmatter = z.infer<typeof publicationSchema>;
export type NewsFrontmatter = z.infer<typeof newsSchema>;
export type GalleryFrontmatter = z.infer<typeof gallerySchema>;
export type AchievementFrontmatter = z.infer<typeof achievementSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type PersonCategory = (typeof personCategories)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type PublicationType = (typeof publicationTypes)[number];
export type GalleryCategory = (typeof galleryCategories)[number];
