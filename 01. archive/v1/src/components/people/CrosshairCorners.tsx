import { cn } from "@/lib/utils";

/**
 * Engineering-drawing crosshair `+` ticks at all four corners of a
 * (positioned) parent (design.md §1 motif 4 / §4 borders).
 */
export default function CrosshairCorners({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const stroke = light ? "bg-white/40" : "bg-nsu-line";
  const tick = (pos: string) => (
    <span key={pos} aria-hidden className={cn("pointer-events-none absolute", pos)}>
      <span className={cn("absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2", stroke)} />
      <span className={cn("absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2", stroke)} />
    </span>
  );
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-10", className)}>
      {tick("left-1.5 top-1.5")}
      {tick("right-1.5 top-1.5")}
      {tick("bottom-1.5 left-1.5")}
      {tick("bottom-1.5 right-1.5")}
    </span>
  );
}
