import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Default scroll-reveal wrapper (design.md §5):
 * y:40 → 0, opacity 0 → 1, 0.8s precision ease, stagger children 0.1s,
 * trigger at 20% viewport, once. Reduced motion → simple opacity fade.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "span" | "li";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: PRECISION_EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

/** Stagger container - children wrapped in <RevealItem/> animate 0.1s apart. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: PRECISION_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
