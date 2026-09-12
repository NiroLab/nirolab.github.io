import { useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { personInitials } from "@/lib/content";
import Chip, { statusVariant } from "./Chip";
import ContentImage from "./ContentImage";
import SectionHeader from "./SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Featured projects horizontal band (home.md §4). GSAP owns this component:
 * desktop pins for ~200vh driving the track horizontally; mobile/tablet
 * falls back to native horizontal scroll-snap. Progress hairline +
 * fractional counter in mono.
 */
export default function FeaturedProjectsBand({
  projects,
}: {
  projects: Project[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [swiped, setSwiped] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current!;
        const getDistance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              if (counterRef.current) {
                const idx = Math.min(
                  projects.length,
                  Math.max(1, Math.round(self.progress * (projects.length - 1)) + 1),
                );
                counterRef.current.textContent = `${String(idx).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
              }
            },
          },
        });
        // cards stagger in before scrub engages
        gsap.from("[data-band-card]", {
          x: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced, projects.length] },
  );

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-nsu-ink"
      aria-label="Featured projects"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <div className="relative flex min-h-[100dvh] flex-col justify-center py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <div className="flex items-start justify-between">
            <SectionHeader
              eyebrow="FLAGSHIP WORK"
              title="Featured projects"
              linkTo="/projects"
              linkLabel="All projects"
              dark
              className="mb-0 flex-1"
            />
            {/* fractional counter (desktop) */}
            <span
              ref={counterRef}
              className="hidden pt-14 font-mono text-sm tracking-[0.22em] text-nsu-sky lg:block"
            >
              01 / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          {/* progress hairline */}
          <div className="mt-6 hidden h-px w-full bg-nsu-line-dark lg:block">
            <div
              ref={progressRef}
              className="h-full w-full origin-left scale-x-0 bg-nsu-sky"
            />
          </div>
        </div>

        {/* track */}
        <div
          ref={trackRef}
          onScroll={() => setSwiped(true)}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8 lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              data-band-card
              className="group relative w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-navy/40 lg:w-[62vw]"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:h-full">
                  <ContentImage
                    src={project.imageSrc}
                    type="project"
                    alt={project.title}
                    dark
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* sheen sweep */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-card-sheen transition-transform duration-700 group-hover:translate-x-0" />
                  {project.featured && (
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md bg-nsu-ink/80 px-2.5 py-1 font-mono text-[11px] font-medium text-nsu-gold backdrop-blur">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                        <path d="M6 0l1.8 3.9L12 4.5 9 7.4l.8 4.1L6 9.5 2.2 11.5 3 7.4 0 4.5l4.2-.6z" />
                      </svg>
                      FEATURED
                    </span>
                  )}
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <Chip variant={statusVariant(project.status)} dark className="self-start">
                    {project.status}
                  </Chip>
                  <h3 className="mt-4 font-mono text-2xl font-semibold tracking-[-0.01em] text-white">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                    {project.description}
                  </p>
                  {project.teamMembers.length > 0 && (
                    <div className="mt-5 flex items-center">
                      {project.teamMembers.slice(0, 5).map((p, i) => (
                        <span
                          key={p.slug}
                          title={p.name}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-nsu-line-dark bg-nsu-navy font-mono text-[10px] font-semibold text-nsu-sky"
                          style={{ marginLeft: i === 0 ? 0 : -8 }}
                        >
                          {personInitials(p.name)}
                        </span>
                      ))}
                      <span className="ml-3 text-xs text-slate-400">
                        {project.teamMembers.length} member
                        {project.teamMembers.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.areas.slice(0, 2).map((area) => (
                      <Chip key={area} dark>
                        {area}
                      </Chip>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-sky">
                    View project
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {/* end card → all projects */}
          <Link
            to="/projects"
            data-band-card
            className="flex w-[60vw] shrink-0 snap-center items-center justify-center rounded-2xl border border-dashed border-nsu-line-dark text-nsu-sky transition-colors hover:border-nsu-sky hover:text-white sm:w-[40vw] lg:w-[24vw]"
          >
            <span className="flex items-center gap-2 font-semibold">
              All projects <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>

        {/* mobile swipe hint */}
        {!swiped && (
          <div className="mt-4 flex justify-center lg:hidden">
            <span className="flex items-center gap-1.5 rounded-full border border-nsu-line-dark px-3 py-1.5 font-mono text-[11px] tracking-wide text-slate-300">
              SWIPE <ChevronRight className="h-3.5 w-3.5 animate-pulse" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
