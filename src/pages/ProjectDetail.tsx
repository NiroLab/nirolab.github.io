import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Github,
  Play,
  Trophy,
} from "lucide-react";
import {
  useAchievements,
  useProject,
  useProjects,
  type Person,
  type Project,
} from "@/lib/content";
import Chip, { statusVariant } from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import Markdown from "@/components/Markdown";
import ContentImage, { PersonImage } from "@/components/ContentImage";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import WordMask from "@/components/projects/WordMask";
import { Crosshairs } from "@/components/projects/ProjectCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------ helpers */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TocItem {
  id: string;
  text: string;
}

/**
 * Build the TOC from `## ` headings in the markdown body and inject
 * matching ids + numbered mono prefixes into the rendered HTML
 * (projects.md §B.2). Heading order in body == h2 order in html.
 */
function useTocAndHtml(project: Project): { toc: TocItem[]; html: string } {
  return useMemo(() => {
    const toc: TocItem[] = [];
    const re = /^##\s+(.+?)\s*$/gm;
    let match: RegExpExecArray | null;
    const used = new Set<string>();
    while ((match = re.exec(project.body)) !== null) {
      const text = match[1].replace(/[*_`]/g, "").trim();
      let id = slugify(text) || `section-${toc.length + 1}`;
      let n = 2;
      while (used.has(id)) id = `${slugify(text)}-${n++}`;
      used.add(id);
      toc.push({ id, text });
    }
    let i = 0;
    const html = project.html.replace(
      /<h2>([\s\S]*?)<\/h2>/g,
      (full, inner: string) => {
        const item = toc[i];
        i += 1;
        if (!item) return full;
        const num = String(i).padStart(2, "0");
        return `<h2 id="${item.id}" style="scroll-margin-top:96px"><span class="mr-3 font-mono text-sm font-medium tracking-[0.18em] text-nsu-sky">${num}&thinsp;/</span>${inner}</h2>`;
      },
    );
    return { toc, html };
  }, [project]);
}

/* -------------------------------------------- section 1 - detail hero */

function HeroFactsCard({ project }: { project: Project }) {
  const linkItems = [
    { key: "github", href: project.links?.github, icon: Github, label: "GitHub" },
    { key: "paper", href: project.links?.paper, icon: FileText, label: "Paper" },
    { key: "demo", href: project.links?.demo, icon: Play, label: "Demo" },
  ].filter((l) => l.href);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: PRECISION_EASE }}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md lg:w-[340px]"
      aria-label="Project facts"
    >
      {/* meta rail - each row rendered only when its data exists */}
      <dl className={cn("space-y-3", linkItems.length > 0 && "border-b border-white/10 pb-5")}>
        <div className="flex items-center justify-between gap-4">
          <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Status
          </dt>
          <dd>
            <Chip variant={statusVariant(project.status)} dark>
              {project.status.toUpperCase()}
            </Chip>
          </dd>
        </div>
        {project.duration && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Duration
            </dt>
            <dd className="text-right text-sm text-slate-200">
              {project.duration}
            </dd>
          </div>
        )}
        {project.funding && (
          <div className="flex items-center justify-between gap-4">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Funding
            </dt>
            <dd className="text-right text-sm text-slate-200">
              {project.funding}
            </dd>
          </div>
        )}
      </dl>

      {/* links (GitHub / Paper / Demo), only when present */}
      {linkItems.length > 0 && (
        <div className="pt-5">
          <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Links
          </h2>
          <div className="flex flex-wrap gap-2">
            {linkItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-nsu-sky hover:text-white"
              >
                <item.icon className="h-3.5 w-3.5" aria-hidden />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}

function DetailHero({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative flex min-h-[70vh] items-end overflow-hidden bg-nsu-ink"
      aria-label="Project hero"
    >
      {/* full-bleed image - slow zoom-out 1.08 → 1 over 1.4s */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduced ? 1 : 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: PRECISION_EASE }}
      >
        <ContentImage
          src={project.imageSrc}
          type="project"
          alt=""
          dark
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* ink scrim + blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-nsu-ink via-nsu-ink/80 to-nsu-ink/30"
      />
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-28 md:px-8 md:pb-20">
        {/* back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-sky transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </Link>
        </motion.div>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            {/* breadcrumb */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-nsu-skylight"
            >
              PROJECTS <span className="text-slate-500">/</span>{" "}
              {project.slug.toUpperCase()}
            </motion.p>
            <WordMask
              text={project.title}
              className="type-display text-white"
            />
            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: PRECISION_EASE }}
              className="mt-5 max-w-2xl type-body text-slate-300"
            >
              {project.description}
            </motion.p>
            {/* research-area chips (status/duration/funding/links live in the
                glass facts card on the right) */}
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: PRECISION_EASE }}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              {project.areas.map((area) => (
                <Chip key={area} variant="concept" dark>
                  {area}
                </Chip>
              ))}
            </motion.div>
          </div>

          <HeroFactsCard project={project} />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- section 2 - body with sticky TOC */

function BodyWithToc({ project }: { project: Project }) {
  const { toc, html } = useTocAndHtml(project);
  const [activeId, setActiveId] = useState<string | undefined>(toc[0]?.id);

  // scroll-spy
  useEffect(() => {
    setActiveId(toc[0]?.id);
    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc, project.slug]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-14 md:py-28" aria-label="Project details">
      <div className="blueprint-grid absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12">
        {/* sticky TOC */}
        {toc.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: PRECISION_EASE }}
            className="lg:col-span-3"
            aria-label="Table of contents"
          >
            <div className="lg:sticky lg:top-28">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-nsu-slate">
                {"// ON THIS PAGE"}
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 lg:block lg:space-y-0.5">
                {toc.map((item, i) => {
                  const active = item.id === activeId;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          jumpTo(item.id);
                        }}
                        aria-current={active ? "location" : undefined}
                        className={cn(
                          "relative block py-1.5 text-sm transition-colors lg:pl-5",
                          active
                            ? "font-semibold text-nsu-navy"
                            : "text-nsu-slate hover:text-nsu-blue",
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="toc-active-indicator"
                            transition={{ duration: 0.3, ease: PRECISION_EASE }}
                            className="absolute left-0 top-1/2 hidden h-5 w-0.5 -translate-y-1/2 rounded-full bg-nsu-sky lg:block"
                          />
                        )}
                        <span className="mr-2 font-mono text-[11px] text-nsu-sky/80">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.nav>
        )}

        {/* reading column */}
        <Reveal
          className={cn(
            "min-w-0",
            toc.length > 0 ? "lg:col-span-9" : "lg:col-span-12",
          )}
          y={32}
        >
          {html.trim() ? (
            <Markdown
              html={html}
              className="max-w-[72ch] font-sans [&_h2]:scroll-mt-24"
            />
          ) : (
            <EmptyState
              title="No write-up yet"
              message="A detailed write-up for this project will be published here soon."
            />
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------- section 3 - team strip */

function TeamStrip({ project }: { project: Project }) {
  if (project.team.length === 0) return null;
  const matchedByName = new Map(project.teamMembers.map((p) => [p.name, p]));
  return (
    <section
      className="relative border-t border-nsu-line py-14 md:py-24"
      aria-label="Project team"
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-px w-8 bg-nsu-blue" />
          <span className="type-eyebrow text-nsu-blue">
            {"// PROJECT TEAM"}
          </span>
        </div>
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" stagger={0.08}>
          {project.team.map((name) => {
            const person: Person | undefined = matchedByName.get(name);
            const inner = (
              <>
                {person ? (
                  <PersonImage
                    src={person.imageSrc}
                    name={person.name}
                    className="h-16 w-16 flex-none shrink-0 aspect-square rounded-full border border-nsu-line object-cover"
                    initialsClassName="text-lg"
                  />
                ) : (
                  <span className="flex h-16 w-16 flex-none shrink-0 aspect-square items-center justify-center rounded-full border border-dashed border-nsu-line bg-nsu-ice font-mono text-sm text-nsu-slate">
                    {name
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block break-words font-mono text-sm font-semibold leading-snug text-nsu-navy">
                    {name}
                  </span>
                  <span className="block break-words text-xs leading-snug text-nsu-slate">
                    {person ? person.role : "Contributor"}
                  </span>
                </span>
              </>
            );
            return (
              <RevealItem key={name} y={24}>
                {person ? (
                  <Link
                    to={`/people?m=${person.slug}`}
                    title={`Open ${person.name} on the People page`}
                    className="flex h-full w-full items-start gap-4 rounded-2xl border border-nsu-line bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-nsu-sky/50 hover:shadow-nsu-card"
                  >
                    {inner}
                  </Link>
                ) : (
                  <span className="flex h-full w-full items-center gap-4 rounded-2xl border border-dashed border-nsu-line bg-white/60 p-4">
                    {inner}
                  </span>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------ section 4 - related achievements */

function RelatedAchievements({ project }: { project: Project }) {
  const achievements = useAchievements();
  const related = achievements.filter(
    (a) => a.project === project.slug || a.projectEntry?.slug === project.slug,
  );
  if (related.length === 0) return null;
  return (
    <section
      className="relative border-t border-nsu-line py-14 md:py-24"
      aria-label="Related achievements"
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-px w-8 bg-nsu-gold" />
          <span className="type-eyebrow text-nsu-gold">
            {"// HONORS FOR THIS PROJECT"}
          </span>
        </div>
        <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.12}>
          {related.map((a) => (
            <RevealItem key={a.slug} y={0}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.7, ease: PRECISION_EASE },
                  },
                }}
                className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-nsu-gold/40 bg-white p-6 transition-shadow duration-300 hover:shadow-nsu-card"
              >
                <Crosshairs />
                {/* one-time shine sweep */}
                <motion.span
                  initial={{ x: "-120%" }}
                  whileInView={{ x: "220%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.4, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-nsu-gold/15 to-transparent"
                  aria-hidden
                />
                <ContentImage
                  src={a.imageSrc}
                  type="achievement"
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-xl border border-nsu-gold/30 object-cover"
                />
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-nsu-gold" aria-hidden />
                    <span className="bg-gold-flare bg-clip-text font-mono text-lg font-bold text-transparent">
                      {a.rank}
                    </span>
                  </span>
                  <h3 className="mt-1 font-mono text-base font-semibold text-nsu-navy">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs text-nsu-slate">
                    {a.event}
                    {a.event ? " · " : ""}
                    {a.date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {a.summary && (
                    <p className="mt-2 line-clamp-2 text-sm text-nsu-slate">
                      {a.summary}
                    </p>
                  )}
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------ section 5 - prev / next (navy) */

function PrevNextNav({ project }: { project: Project }) {
  const { all } = useProjects();
  if (all.length < 2) return null;
  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  return (
    <section
      className="relative overflow-hidden bg-nsu-ink py-14 md:py-24"
      aria-label="More projects"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-2 md:px-8">
        {/* previous */}
        <Reveal y={0}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: PRECISION_EASE }}
          >
            <Link
              to={`/projects/${prev.slug}`}
              className="group relative flex h-full items-center gap-5 overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-navy/40 p-6 transition-colors duration-300 hover:border-nsu-sky/60"
            >
              <ArrowLeft className="h-6 w-6 shrink-0 text-nsu-sky transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Previous project
                </span>
                <span className="mt-1 block truncate font-mono text-lg font-semibold text-white">
                  {prev.title}
                </span>
              </span>
              <span className="ml-auto hidden h-16 w-24 shrink-0 -translate-x-3 overflow-hidden rounded-lg opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
                <ContentImage
                  src={prev.imageSrc}
                  type="project"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
            </Link>
          </motion.div>
        </Reveal>
        {/* next */}
        <Reveal y={0}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: PRECISION_EASE }}
          >
            <Link
              to={`/projects/${next.slug}`}
              className="group relative flex h-full items-center gap-5 overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-navy/40 p-6 text-right transition-colors duration-300 hover:border-nsu-sky/60"
            >
              <span className="hidden h-16 w-24 shrink-0 translate-x-3 overflow-hidden rounded-lg opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
                <ContentImage
                  src={next.imageSrc}
                  type="project"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Next project
                </span>
                <span className="mt-1 block truncate font-mono text-lg font-semibold text-white">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-6 w-6 shrink-0 text-nsu-sky transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------- designed fallback */

function MissingProject({ slug }: { slug: string }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient py-32 md:py-40">
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-nsu-skylight">
          {"// PROJECTS / "}
          {slug.toUpperCase()}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl">
          Project not found
        </h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-slate-300">
          We couldn't find a project matching this link - it may have been
          renamed or moved. Browse the full list of current projects instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-6 py-3 text-[0.9375rem] font-semibold text-white transition-transform active:scale-[0.97]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- page */

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = useProject(slug);

  if (!project) return <MissingProject slug={slug} />;

  return (
    <article key={project.slug}>
      <DetailHero project={project} />
      <BodyWithToc project={project} />
      <TeamStrip project={project} />
      <RelatedAchievements project={project} />
      <PrevNextNav project={project} />
    </article>
  );
}
