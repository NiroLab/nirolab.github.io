import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useProjects } from "@/lib/content";
import EmptyState from "@/components/EmptyState";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import WordMask from "@/components/projects/WordMask";
import FeaturedCarousel from "@/components/projects/FeaturedCarousel";
import FilterBar from "@/components/projects/FilterBar";
import { ProjectCardMotion } from "@/components/projects/ProjectCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const STATUS_ORDER = ["All", "Active", "Completed", "Concept"] as const;

/* ------------------------------------------------ section 1 - page hero */
function PageHero({
  total,
  active,
  areas,
}: {
  total: number;
  active: number;
  areas: number;
}) {
  const reduced = useReducedMotion();
  const chips = [
    { value: total, label: "PROJECTS" },
    { value: active, label: "ACTIVE" },
    { value: areas, label: "RESEARCH AREAS COVERED" },
  ];
  return (
    <section className="relative overflow-hidden bg-hero-gradient" aria-label="Projects hero">
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-nsu-sky/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-5 flex items-center gap-3"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE, delay: 0.2 }}
            className="h-px w-8 origin-left bg-nsu-sky"
          />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-skylight">
            {"// RESEARCH PROJECTS"}
          </span>
        </motion.div>
        <WordMask
          text="Machines in the making."
          className="max-w-4xl font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white"
        />
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: PRECISION_EASE }}
          className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-300"
        >
          From educational robots to CubeSats - active research across land,
          air, water, and orbit.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: PRECISION_EASE }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-baseline gap-2 rounded-full border border-nsu-line-dark bg-nsu-ink/40 px-4 py-2 backdrop-blur"
            >
              <span className="font-mono text-lg font-bold text-nsu-sky tabular-nums">
                {chip.value}
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                {chip.label}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- the page */
export default function Projects() {
  const { all, featured } = useProjects();
  const [status, setStatus] = useState<string>("All");
  const [area, setArea] = useState<string>("all");
  const [query, setQuery] = useState("");

  const activeCount = all.filter((p) => p.status === "Active").length;
  const areas = useMemo(
    () => [...new Set(all.flatMap((p) => p.areas))].sort(),
    [all],
  );

  const statuses = useMemo(
    () =>
      STATUS_ORDER.map((s) => ({
        value: s,
        label: s,
        count:
          s === "All" ? all.length : all.filter((p) => p.status === s).length,
      })),
    [all],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (area !== "all" && !p.areas.includes(area)) return false;
      if (
        q &&
        !`${p.title} ${p.description}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [all, status, area, query]);

  return (
    <>
      <PageHero
        total={all.length}
        active={activeCount}
        areas={areas.length}
      />

      {/* section 2 - featured carousel (dark continuation) */}
      {featured.length > 0 && (
        <section
          className="relative overflow-hidden bg-nsu-ink pb-24 pt-4 md:pb-28"
          aria-label="Featured projects"
        >
          <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
          <Reveal className="relative mx-auto max-w-7xl px-5 md:px-8" y={48}>
            <FeaturedCarousel projects={featured} />
          </Reveal>
        </section>
      )}

      {/* section 3 - filter + grid (light) */}
      <section className="relative py-24 md:py-32" aria-label="All projects">
        <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          {/* sticky filter bar */}
          <div className="sticky top-[60px] z-30 -mx-5 border-b border-nsu-line bg-nsu-mist/90 px-5 py-4 backdrop-blur-md md:-mx-8 md:px-8">
            <FilterBar
              statuses={statuses}
              status={status}
              onStatus={setStatus}
              areas={areas}
              area={area}
              onArea={setArea}
              query={query}
              onQuery={setQuery}
              resultCount={filtered.length}
            />
          </div>

          <div className="mt-12">
            {filtered.length > 0 ? (
              <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project, i) => (
                    <ProjectCardMotion
                      key={project.slug}
                      project={project}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : all.length === 0 ? (
              <EmptyState
                title="No projects yet"
                message="New projects will appear here as the lab's research grows."
              />
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-nsu-line bg-white/60 px-8 py-16 text-center">
                <p className="font-mono text-xl font-semibold text-nsu-navy">
                  No projects match these filters
                </p>
                <p className="mt-2 max-w-md text-sm text-nsu-slate">
                  Try a different status, research area, or search term.
                </p>
                <button
                  onClick={() => {
                    setStatus("All");
                    setArea("all");
                    setQuery("");
                  }}
                  className="mt-6 rounded-full border border-nsu-blue/40 px-5 py-2 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* section 4 - proposal CTA (light end) */}
      <section className="pb-24 md:pb-32" aria-label="Project proposals">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <RevealGroup className="relative overflow-hidden rounded-3xl border border-nsu-line bg-nsu-ice px-8 py-14 md:px-14">
            <div className="blueprint-grid absolute inset-0" aria-hidden />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <RevealItem className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-nsu-blue" />
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                    {"// PROPOSE A PROJECT"}
                  </span>
                </div>
                <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-nsu-navy">
                  Have a project idea?
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-[1.7] text-nsu-slate">
                  We welcome proposals from students, faculty collaborators,
                  and industry partners - from semester-long course builds to
                  multi-year research platforms.
                </p>
              </RevealItem>
              <RevealItem>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-white shadow-lg transition-transform duration-200 hover:brightness-110 active:scale-[0.97]"
                >
                  Get in touch
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </RevealItem>
            </div>
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
