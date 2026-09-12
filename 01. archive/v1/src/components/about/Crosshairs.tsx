import { cn } from "@/lib/utils";

/**
 * Crosshair `+` ticks at all four corners of a positioned parent
 * (engineering-drawing motif, design.md §4). Parent must be `relative`.
 * Rendered with spans (not pseudo-elements) so pages can use them without
 * touching global CSS.
 */
export default function Crosshairs({
  color = "text-nsu-line",
  className,
}: {
  color?: string;
  className?: string;
}) {
  const tick = cn(
    "pointer-events-none absolute z-10 select-none font-mono text-xs leading-none",
    color,
  );
  return (
    <span aria-hidden className={className}>
      <span className={cn(tick, "-left-1.5 -top-2")}>+</span>
      <span className={cn(tick, "-right-1.5 -top-2")}>+</span>
      <span className={cn(tick, "-bottom-2 -left-1.5")}>+</span>
      <span className={cn(tick, "-bottom-2 -right-1.5")}>+</span>
    </span>
  );
}
