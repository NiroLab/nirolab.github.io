import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/content";
import Chip, { statusVariant } from "@/components/Chip";
import ContentImage from "@/components/ContentImage";
import { AvatarDot, Crosshairs } from "./ProjectCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const AUTO_MS = 8000;
const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

function FeaturedStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden>
      <path d="M6 0l1.8 3.9L12 4.5 9 7.4l.8 4.1L6 9.5 2.2 11.5 3 7.4 0 4.5l4.2-.6z" />
    </svg>
  );
}

/**
 * Featured carousel (projects.md §A.2): single-feature 16:7 slide built from
 * `featured: true` projects. Cross-fade + 24px parallax drift (0.6s),
 * content panel stagger 0.06s, slide counter + prev/next round buttons +
 * auto-advance progress ring (8s, pauses on hover/focus, disabled for
 * reduced motion).
 */
export default function FeaturedCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 → 1 over AUTO_MS
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const count = projects.length;
  const clamped = count === 0 ? 0 : Math.min(index, count - 1);
  const project = projects[clamped];

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setProgress(0);
    },
    [count],
  );
  const goNext = useCallback(() => goTo(clamped + 1), [goTo, clamped]);
  const goPrev = useCallback(() => goTo(clamped - 1), [goTo, clamped]);

  // auto-advance clock (100ms ticks, pause-aware)
  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const tick = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / AUTO_MS;
        if (next >= 1) {
          window.clearInterval(tick);
          // advance on the next frame so the ring visually completes
          requestAnimationFrame(() => goNext());
          return 1;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(tick);
  }, [reduced, paused, count, goNext, clamped]);

  // keyboard support
  const regionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  if (!project) return null;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-ink outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky sm:aspect-[16/8] lg:aspect-[16/7]"
    >
      <Crosshairs dark />
      {/* image layer — cross-fade + parallax drift */}
      <AnimatePresence initial={false}>
        <motion.div
          key={project.slug}
          className="absolute inset-0"
          initial={{ opacity: 0, x: reduced ? 0 : 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: PRECISION_EASE }}
        >
          <ContentImage
            src={project.imageSrc}
            type="project"
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      {/* scrims */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-nsu-ink via-nsu-ink/70 to-nsu-ink/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-nsu-ink via-nsu-ink/40 to-transparent"
      />

      {/* content panel — bottom-left */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={project.slug}
          className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:max-w-2xl"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PRECISION_EASE } },
            }}
            className="flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 rounded-md bg-nsu-gold/15 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-nsu-gold">
              <FeaturedStar className="h-3 w-3" />
              FEATURED
            </span>
            <Chip variant={statusVariant(project.status)} dark>
              {project.status.toUpperCase()}
            </Chip>
            {project.duration && (
              <span className="hidden font-mono text-[11px] tracking-wide text-slate-300 sm:inline">
                {project.duration}
              </span>
            )}
          </motion.div>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PRECISION_EASE } },
            }}
            className="mt-4 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-4xl"
          >
            {project.title}
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PRECISION_EASE } },
            }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
          >
            {project.description}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PRECISION_EASE } },
            }}
            className="mt-6 flex flex-wrap items-center gap-5"
          >
            <Link
              to={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-6 py-3 text-[0.9375rem] font-semibold tracking-[0.01em] text-white shadow-lg transition-transform duration-200 hover:brightness-110 active:scale-[0.97]"
            >
              View project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {project.teamMembers.length > 0 && (
              <span className="flex items-center">
                {project.teamMembers.slice(0, 5).map((p, i) => (
                  <AvatarDot
                    key={p.slug}
                    name={p.name}
                    className={cn(
                      "border-nsu-ink",
                      i === 0 ? undefined : "-ml-2.5",
                    )}
                  />
                ))}
                <span className="ml-3 hidden font-mono text-[11px] text-slate-400 md:inline">
                  {project.teamMembers[0].name}
                  {project.teamMembers.length > 1 &&
                    ` +${project.teamMembers.length - 1}`}
                </span>
              </span>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* controls — right-bottom */}
      {count > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3 sm:bottom-10 sm:right-10">
          <span className="font-mono text-xs tracking-[0.22em] text-nsu-sky tabular-nums">
            {String(clamped + 1).padStart(2, "0")}/{String(count).padStart(2, "0")}
          </span>
          <button
            onClick={goPrev}
            aria-label="Previous featured project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-nsu-line-dark text-slate-300 transition-colors hover:border-nsu-sky hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next featured project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-nsu-line-dark text-slate-300 transition-colors hover:border-nsu-sky hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {/* auto-advance progress ring */}
          <span
            className="relative hidden h-10 w-10 items-center justify-center sm:flex"
            title={paused ? "Auto-advance paused" : "Auto-advances every 8s"}
          >
            <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r={RING_R}
                fill="none"
                stroke="#1E3A66"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r={RING_R}
                fill="none"
                stroke="#3D8FE0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress)}
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
