import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function OrbitRing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-24 w-24", className)}
      fill="none"
      aria-hidden
    >
      <g transform="rotate(18 60 60)">
        <ellipse
          cx="60"
          cy="60"
          rx="48"
          ry="27"
          stroke="var(--nsu-sky)"
          strokeWidth="1.5"
        />
      </g>
      <circle cx="60" cy="60" r="18" stroke="var(--nsu-blue)" strokeWidth="1.5" />
      <circle cx="104" cy="46" r="4" fill="var(--nsu-gold)" />
    </svg>
  );
}

/**
 * Generic empty state (design.md §8.3): orbit-ring + "nothing here yet"
 * message + optional contact link. Publications & Gallery rely on this.
 */
export default function EmptyState({
  title = "Nothing here yet.",
  message = "New entries will appear here as the lab grows.",
  dark = false,
  className,
}: {
  title?: string;
  message?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed px-8 py-16 text-center",
        dark ? "border-nsu-line-dark" : "border-nsu-line bg-white/60",
        className,
      )}
    >
      <OrbitRing className="mb-6 opacity-80" />
      <h3
        className={cn(
          "mb-2 type-h3",
          dark ? "text-white" : "text-nsu-navy",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mb-6 max-w-md type-body-mono",
          dark ? "text-slate-300" : "text-nsu-slate",
        )}
      >
        {message}
      </p>
      <Link
        to="/contact"
        className="group inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 px-5 py-2.5 type-button text-nsu-blue transition-colors hover:bg-nsu-ice"
      >
        Get in touch
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
