import { cn } from "@/lib/utils";

/**
 * Chip/Tag (design.md §8.3): ice bg, blue text, rounded-md, mono 11px.
 * Status variants: Active = blue pulse dot, Completed = solid,
 * Concept = dashed border.
 */
export default function Chip({
  children,
  variant = "default",
  dark = false,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "active" | "completed" | "concept" | "gold";
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.18em]",
        variant === "default" &&
          (dark
            ? "bg-nsu-line-dark/60 text-nsu-sky"
            : "bg-nsu-ice text-nsu-blue"),
        variant === "active" &&
          (dark
            ? "bg-nsu-line-dark/60 text-nsu-sky"
            : "bg-nsu-ice text-nsu-blue"),
        variant === "completed" &&
          (dark
            ? "bg-nsu-sky/15 text-white"
            : "bg-nsu-blue text-white"),
        variant === "concept" &&
          (dark
            ? "border border-dashed border-nsu-sky/60 text-nsu-sky"
            : "border border-dashed border-nsu-blue/50 text-nsu-blue"),
        variant === "gold" && "bg-nsu-gold/15 text-nsu-gold",
        className,
      )}
    >
      {variant === "active" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

/** Map a project status string to a Chip variant. */
export function statusVariant(
  status: string,
): "active" | "completed" | "concept" {
  if (status === "Completed") return "completed";
  if (status === "Concept") return "concept";
  return "active";
}
