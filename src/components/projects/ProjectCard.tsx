import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import { personInitials, type Project } from "@/lib/content";
import Chip, { statusVariant } from "@/components/Chip";
import ContentImage from "@/components/ContentImage";
import { cn } from "@/lib/utils";

/** Engineering-drawing crosshair ticks at all four corners (design.md §4). */
export function Crosshairs({ dark = false }: { dark?: boolean }) {
  const color = dark ? "text-nsu-line-dark" : "text-nsu-line";
  return (
    <>
      {[
        "left-2 top-1.5",
        "right-2 top-1.5",
        "bottom-1.5 left-2",
        "bottom-1.5 right-2",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10 select-none font-mono text-xs leading-none",
            pos,
            color,
          )}
        >
          +
        </span>
      ))}
    </>
  );
}

/** Small stacked avatar (initials over person placeholder). */
export function AvatarDot({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const px = size === "sm" ? "h-7 w-7 text-[11px]" : "h-8 w-8 text-[11px]";
  return (
    <span
      title={name}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-nsu-navy font-mono font-semibold text-nsu-sky",
        px,
        className,
      )}
    >
      {personInitials(name)}
    </span>
  );
}

/**
 * ProjectCard (projects.md §A.3): 16:10 image with status-chip overlay,
 * title, 2-line description, duration mono, areas chips (max 2 + "+n"),
 * footer avatar stack + arrow. Hover: lift + sheen + image scale 1.04 +
 * arrow slide. Rendered inside a Framer `layout` grid by the parent.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const areas = project.areas;
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-nsu-line bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-nsu-card"
    >
      <Crosshairs />
      {/* image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <ContentImage
          src={project.imageSrc}
          type="project"
          alt={project.title}
          className="h-full w-full border-0 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* sheen sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-card-sheen transition-transform duration-700 group-hover:translate-x-0"
        />
        <Chip
          variant={statusVariant(project.status)}
          className="absolute left-4 top-4 shadow-sm"
        >
          {project.status.toUpperCase()}
        </Chip>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="type-h3 text-nsu-navy transition-colors group-hover:text-nsu-blue">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 type-body-mono text-nsu-slate">
          {project.description}
        </p>
        {project.duration && (
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] text-nsu-slate">
            <CalendarClock className="h-3.5 w-3.5 text-nsu-blue" aria-hidden />
            {project.duration}
          </p>
        )}
        {areas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {areas.slice(0, 2).map((area) => (
              <Chip key={area}>{area}</Chip>
            ))}
            {areas.length > 2 && <Chip>+{areas.length - 2}</Chip>}
          </div>
        )}

        {/* footer row */}
        <div className="mt-auto flex items-center gap-3 pt-5">
          {project.teamMembers.length > 0 ? (
            <span className="flex items-center">
              {project.teamMembers.slice(0, 4).map((p, i) => (
                <AvatarDot
                  key={p.slug}
                  name={p.name}
                  size="sm"
                  className={i === 0 ? undefined : "-ml-2"}
                />
              ))}
              {project.teamMembers.length > 4 && (
                <span className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-nsu-ice font-mono text-[11px] font-semibold text-nsu-blue">
                  +{project.teamMembers.length - 4}
                </span>
              )}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-nsu-slate">
              {project.team.length > 0
                ? `${project.team.length} contributor${project.team.length === 1 ? "" : "s"}`
                : "Team TBA"}
            </span>
          )}
          <ArrowRight className="ml-auto h-4 w-4 text-nsu-blue transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Motion wrapper used by the filterable grid - `layout` reflow (0.4s) with
 * exit fade on filter changes (projects.md §A.3 animation).
 */
export function ProjectCardMotion({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: Math.min(index, 8) * 0.06 },
      }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className="h-full"
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}
