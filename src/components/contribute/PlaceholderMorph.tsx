/**
 * Placeholder → real photo morph demo (contribute.md §10): hover (or tap)
 * wipes the designed placeholder away to reveal the photo underneath,
 * using a clip-path wipe. Demonstrates the "replace the file at the same
 * path and the site swaps it in" rule.
 */
import { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlaceholderMorph() {
  const [swapped, setSwapped] = useState(false);

  return (
    <div
      className="group relative cursor-pointer select-none overflow-hidden rounded-xl border border-nsu-line-dark"
      onClick={() => setSwapped((s) => !s)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSwapped((s) => !s);
        }
      }}
      aria-pressed={swapped}
      aria-label="Toggle between placeholder and real photo"
    >
      <div className="relative aspect-[16/10]">
        {/* real photo (underneath) */}
        <img
          src="/assets/placeholders/about-lab-space.svg"
          alt="Real lab photo"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        {/* placeholder on top — wipes away on hover/tap */}
        <img
          src="/assets/placeholders/project.svg"
          alt="Designed placeholder"
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            swapped
              ? "[clip-path:inset(0_100%_0_0)]"
              : "[clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_100%_0_0)]",
          )}
        />
        {/* wipe edge */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 w-px bg-nsu-sky/80 transition-[left,opacity] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            swapped ? "left-full opacity-0" : "left-0 group-hover:left-full group-hover:opacity-0",
          )}
        />
        {/* captions */}
        <span className="absolute bottom-2 left-2 rounded bg-nsu-ink/80 px-2 py-1 font-mono text-[10px] tracking-wide text-nsu-sky">
          BEFORE · /assets/placeholders/project.svg
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-nsu-ink/80 px-2 py-1 font-mono text-[10px] tracking-wide text-white">
          AFTER · your-photo.jpg
        </span>
        <span className="absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-nsu-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
          <MousePointerClick className="h-3 w-3" />
          Hover or tap to swap
        </span>
      </div>
    </div>
  );
}
