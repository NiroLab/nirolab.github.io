import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Section header (design.md §8.3): mono eyebrow with `// ` prefix + draw-in
 * line, H2, optional right-side "View all →" link.
 */
export default function SectionHeader({
  eyebrow,
  title,
  linkTo,
  linkLabel = "View all",
  dark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  linkTo?: string;
  linkLabel?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-wrap items-end justify-between gap-6",
        className,
      )}
    >
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="mb-4 flex items-center gap-3"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className={cn(
              "h-px w-8 origin-left",
              dark ? "bg-nsu-sky" : "bg-nsu-blue",
            )}
          />
          <span
            className={cn(
              "font-mono text-xs font-medium uppercase tracking-[0.22em]",
              dark ? "text-nsu-sky" : "text-nsu-blue",
            )}
          >
            {"// "}
            {eyebrow}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: PRECISION_EASE, delay: 0.1 }}
          className={cn(
            "font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em]",
            dark ? "text-white" : "text-nsu-navy",
          )}
        >
          {title}
        </motion.h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className={cn(
            "group inline-flex items-center gap-2 text-[0.9375rem] font-semibold tracking-[0.01em]",
            dark
              ? "text-nsu-sky hover:text-white"
              : "text-nsu-blue hover:text-nsu-navy",
          )}
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
