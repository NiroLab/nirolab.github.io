import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Kinetic heading (design.md §5): each word rises out of an overflow-hidden
 * mask (yPercent 110 → 0, 0.06s stagger). Reduced motion → static text.
 * Page-local to Projects / ProjectDetail.
 */
export default function WordMask({
  text,
  as = "h1",
  className,
  delay = 0.3,
  stagger = 0.06,
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className={cn("inline-block will-change-transform")}
            initial={{ y: reduced ? "0%" : "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: PRECISION_EASE,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
