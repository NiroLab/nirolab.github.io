import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Stat (design.md §8.3): tabular numeral counting up on enter-view (1.6s,
 * snap 1) + mono caption.
 */
export default function Stat({
  value,
  label,
  suffix,
  dark = true,
  goldUnderline = false,
  className,
}: {
  value: number;
  label: string;
  suffix?: string;
  dark?: boolean;
  /** the gold-flare underline used on the fourth stat cell */
  goldUnderline?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!inView || !numRef.current) return;
    const el = numRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(value);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className={cn(
          "font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tabular-nums",
          dark ? "text-white" : "text-nsu-navy",
        )}
      >
        <span ref={numRef}>0</span>
        {suffix && <span className="text-nsu-sky">{suffix}</span>}
      </div>
      <div
        className={cn(
          "mt-3 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em]",
          dark ? "text-nsu-sky" : "text-nsu-blue",
        )}
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {label}
      </div>
      {goldUnderline && (
        <span className="mt-4 block h-1 w-16 rounded-full bg-gold-flare" />
      )}
    </div>
  );
}
