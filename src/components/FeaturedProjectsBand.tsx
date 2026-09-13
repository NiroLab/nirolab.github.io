import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { personInitials } from "@/lib/content";
import Chip, { statusVariant } from "./Chip";
import ContentImage from "./ContentImage";
import SectionHeader from "./SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Featured projects band: dark section, standard vertical page flow
 * (the old GSAP ScrollTrigger pinned horizontal scroller was removed).
 * Featured projects lay out as a responsive grid of large cards with
 * white matte image frames (real photos usually have white backgrounds),
 * a fractional mono counter per card, and an "All projects" end card.
 */
export default function FeaturedProjectsBand({
  projects,
}: {
  projects: Project[];
}) {
  const reduced = useReducedMotion();
  if (projects.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden bg-nsu-ink"
      aria-label="Featured projects"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-32">
        <div className="flex items-start justify-between">
          <SectionHeader
            eyebrow="FLAGSHIP WORK"
            title="Featured projects"
            linkTo="/projects"
            linkLabel="All projects"
            dark
            className="mb-0 flex-1"
          />
          <span className="ml-10 hidden shrink-0 pt-14 font-mono text-sm tracking-[0.22em] text-nsu-sky lg:block">
            {String(projects.length).padStart(2, "0")} FEATURED
          </span>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: reduced ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: (i % 2) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to={`/projects/${project.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-navy/40 transition-colors duration-300 hover:border-nsu-sky/50"
              >
                {/* white matte image frame (real photos usually have white backgrounds) */}
                <div className="relative m-3 aspect-[16/9] overflow-hidden rounded-xl bg-white p-2">
                  <ContentImage
                    src={project.imageSrc}
                    type="project"
                    alt={project.title}
                    className="h-full w-full rounded-lg border-0 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* sheen sweep */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-nsu-gold px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-nsu-ink">
                    Featured
                  </span>
                </div>

                {/* text block */}
                <div className="flex flex-1 flex-col p-7 pt-4 md:p-9 md:pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <Chip variant={statusVariant(project.status)} dark>
                      {project.status.toUpperCase()}
                    </Chip>
                    <span className="font-mono text-sm tracking-[0.22em] text-nsu-sky">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-slate-400">
                        {" "}
                        / {String(projects.length).padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-4 font-mono text-2xl font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between border-t border-white/10 pt-5">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 4).map((name) => (
                          <span
                            key={name}
                            title={name}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-nsu-line-dark bg-nsu-navy font-mono text-[11px] text-nsu-skylight"
                          >
                            {personInitials(name)}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-sky transition-colors group-hover:text-white">
                        View project
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* end card: view all projects */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              delay: (projects.length % 2) * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              to="/projects"
              className="group flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-nsu-line-dark text-center transition-colors hover:border-nsu-sky/50"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-nsu-sky/50 transition-colors group-hover:bg-nsu-sky/10">
                <ArrowRight className="h-6 w-6 text-nsu-sky transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300">
                All projects
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
