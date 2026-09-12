import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Globe,
  Linkedin,
  Mail,
  Phone,
  X,
} from "lucide-react";
import type { Person } from "@/lib/content";
import Chip from "@/components/Chip";
import Markdown from "@/components/Markdown";
import { PersonImage } from "@/components/ContentImage";
import CrosshairCorners from "./CrosshairCorners";
import { startLenis, stopLenis } from "@/lib/lenis";
import { CATEGORY_META, interestsOf } from "./meta";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface PersonModalProps {
  person: Person;
  /** 0-based position within the currently filtered list (for Prev/Next) */
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const bodyStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const bodyItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: PRECISION_EASE } },
};

/**
 * Person detail modal (people.md §4): center dialog (max-w-3xl), ink scrim +
 * blur, slide-up 24px / 0.35s, ESC + scrim close, focus-trapped, Prev/Next
 * cycling within the current filtered list (keyboard ←/→). Entrance is a
 * GPU-cheap opacity/transform fade (no layoutId shared-element transition -
 * layout animations over the full grid stutter). While open, Lenis is
 * stopped and body overflow is hidden, so the background is fully
 * scroll-locked; the scrollable body uses data-lenis-prevent +
 * overscroll-contain so wheel/touch scrolls the modal only, with no
 * chaining back to the page.
 */
export default function PersonModal({
  person,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: PersonModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const interests = interestsOf(person);

  // focus trap + keyboard controls + focus restore
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // initial focus → close button
    (node.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0])?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, onPrev, onNext]);

  // full background scroll-lock while open: pause Lenis + hide body overflow
  useEffect(() => {
    stopLenis();
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
      startLenis();
    };
  }, []);

  const links = [
    person.email && {
      href: `mailto:${person.email}`,
      icon: Mail,
      label: `Email ${person.name}`,
    },
    person.website && { href: person.website, icon: Globe, label: "Personal website" },
    person.scholar && {
      href: person.scholar,
      icon: GraduationCap,
      label: "Google Scholar profile",
    },
    person.linkedin && { href: person.linkedin, icon: Linkedin, label: "LinkedIn profile" },
  ].filter(Boolean) as { href: string; icon: typeof Mail; label: string }[];

  const facts = [
    person.office && { icon: Building2, label: "Office", value: person.office },
    person.phone && { icon: Phone, label: "Phone", value: person.phone },
    person.email && { icon: Mail, label: "Email", value: person.email },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string }[];

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
      role="presentation"
    >
      {/* scrim */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-nsu-ink/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* dialog */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${person.name} - profile`}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
        transition={{ duration: 0.3, ease: PRECISION_EASE }}
        className="relative flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <CrosshairCorners />

        {/* header band (navy gradient) */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-nsu-ink via-nsu-navy to-nsu-blue p-6 sm:p-8">
          <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden />
          <div className="relative flex flex-col gap-6 pr-10 sm:flex-row sm:items-center sm:pr-12">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-40">
              <PersonImage
                src={person.imageSrc}
                name={person.name}
                className="h-full w-full"
                initialsClassName="text-4xl sm:text-5xl"
                dark
              />
              <CrosshairCorners light />
            </div>
            <motion.div
              variants={bodyStagger}
              initial="hidden"
              animate="show"
              className="min-w-0"
            >
              <motion.div variants={bodyItem} className="mb-2">
                <Chip dark>{CATEGORY_META[person.category].label}</Chip>
              </motion.div>
              <motion.h2
                variants={bodyItem}
                className="font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl"
              >
                {person.name}
              </motion.h2>
              <motion.p variants={bodyItem} className="mt-1.5 text-sm text-slate-300 sm:text-base">
                {person.role}
              </motion.p>
              {links.length > 0 && (
                <motion.div variants={bodyItem} className="mt-4 flex items-center gap-2">
                  {links.map(({ href, icon: Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-nsu-line-dark text-nsu-sky transition-colors hover:border-nsu-sky hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* close */}
          <motion.button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label="Close profile"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-4 z-10 rounded-full border border-nsu-line-dark p-2 text-slate-300 transition-colors hover:border-nsu-sky hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* body: markdown + facts sidebar */}
        <motion.div
          variants={bodyStagger}
          initial="hidden"
          animate="show"
          data-lenis-prevent
          className="grid min-h-0 flex-1 gap-8 overflow-y-auto overscroll-contain p-6 sm:p-8 md:grid-cols-[1fr_220px]"
        >
          <motion.div variants={bodyItem} className="min-w-0">
            {person.body ? (
              <Markdown html={person.html} />
            ) : (
              <p className="text-sm italic text-nsu-slate">
                This profile has no extended bio yet.
              </p>
            )}
          </motion.div>

          {(facts.length > 0 || interests.length > 0) && (
            <motion.aside
              variants={bodyItem}
              className="min-w-0 space-y-6 border-t border-nsu-line pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0"
            >
              {facts.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                    {"// FACTS"}
                  </h3>
                  <ul className="space-y-3">
                    {facts.map(({ icon: Icon, label, value }) => (
                      <li key={label} className="flex items-start gap-2.5 text-sm">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-nsu-blue" />
                        <span className="min-w-0">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-nsu-slate">
                            {label}
                          </span>
                          <span className="block text-nsu-text [overflow-wrap:anywhere]">
                            {value}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {interests.length > 0 && (
                <div>
                  <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                    {"// RESEARCH INTERESTS"}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {interests.map((interest) => (
                      <Chip key={interest}>{interest}</Chip>
                    ))}
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </motion.div>

        {/* footer: prev / next within the filtered list */}
        {total > 1 && (
          <div className="flex shrink-0 items-center justify-between border-t border-nsu-line px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={onPrev}
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Prev
            </button>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
              {index >= 0 ? index + 1 : "-"} / {total}
            </span>
            <button
              type="button"
              onClick={onNext}
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
            >
              Next
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Presence wrapper so the modal exit animation always plays. */
export function PersonModalPresence(props: PersonModalProps & { open: boolean }) {
  const { open, ...rest } = props;
  return <AnimatePresence>{open && <PersonModal {...rest} />}</AnimatePresence>;
}
