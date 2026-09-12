import { motion } from "framer-motion";
import Chip from "@/components/Chip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Compact dark page hero shared by Publications / News / Gallery
 * (design.md §5 + per-page Section 1 specs):
 * eyebrow with draw-in line, H1 word-mask rise, sub, live mono chips.
 */
export default function PageHero({
  eyebrow,
  title,
  sub,
  chips = [],
  className,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  /** live chips - pass an empty array to hide gracefully */
  chips?: string[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = title.split(" ");

  return (
    <section
      className={cn("relative overflow-hidden bg-hero-gradient", className)}
      aria-label={title}
    >
      <div className="blueprint-grid-dark absolute inset-0 opacity-40" aria-hidden />
      {/* orbit-ring decoration */}
      <svg
        viewBox="0 0 300 300"
        className="absolute -right-20 -top-20 h-72 w-72 opacity-25"
        fill="none"
        aria-hidden
      >
        <g transform="rotate(18 150 150)">
          <ellipse cx="150" cy="150" rx="132" ry="74" stroke="var(--nsu-sky)" strokeWidth="1.5" />
        </g>
        <circle cx="276" cy="118" r="5" fill="var(--nsu-gold)" />
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 md:px-8 md:py-28">
        {/* eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className="h-px w-8 origin-left bg-nsu-sky"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-skylight"
          >
            {"// "}
            {eyebrow}
          </motion.span>
        </div>

        {/* word-mask H1 */}
        <h1 className="max-w-4xl font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
          {words.map((word, i) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: reduced ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    delay: 0.35 + i * 0.06,
                    ease: PRECISION_EASE,
                  }}
                >
                  {word}
                </motion.span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: PRECISION_EASE }}
          className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-200"
        >
          {sub}
        </motion.p>

        {chips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05, ease: PRECISION_EASE }}
            className="mt-8 flex flex-wrap items-center gap-2"
          >
            {chips.map((chip) => (
              <Chip key={chip} dark>
                {chip}
              </Chip>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
