import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import type { Person } from "@/lib/content";
import Chip from "@/components/Chip";
import { PersonImage } from "@/components/ContentImage";
import { cn } from "@/lib/utils";
import CrosshairCorners from "./CrosshairCorners";
import {
  CATEGORY_META,
  currentPositionOf,
  directorBadge,
  interestsOf,
} from "./meta";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface CardProps {
  person: Person;
  index: number;
  onOpen: (slug: string) => void;
}

/** Shared enter/exit/layout props for directory items (people.md §2). */
function itemMotion(index: number) {
  return {
    layout: true,
    initial: { opacity: 0, y: 24, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    transition: {
      duration: 0.4,
      ease: PRECISION_EASE,
      // reveal stagger 0.05s, capped 12 items per stagger batch (people.md §3)
      delay: (index % 12) * 0.05,
    },
  } as const;
}

/**
 * PersonCard (people.md §3): square portrait (placeholder w/ initials),
 * crosshair corners, name / role / email / ≤2 interest chips + "+n",
 * category tag. Hover: lift, sheen sweep, "View profile →" overlay,
 * border → nsu-blue. Founding-faculty variant: gold hairline top + badge.
 */
export default function PersonCard({ person, index, onOpen }: CardProps) {
  const interests = interestsOf(person);
  const shown = interests.slice(0, 2);
  const extra = interests.length - shown.length;
  const founding = person.category === "founding_faculty";
  const badge = founding ? directorBadge(person.role) : null;

  return (
    <motion.button
      {...itemMotion(index)}
      type="button"
      onClick={() => onOpen(person.slug)}
      aria-label={`View profile of ${person.name}`}
      className="group relative overflow-hidden rounded-2xl border border-nsu-line bg-white text-left transition-[border-color,box-shadow] duration-300 hover:border-nsu-blue hover:shadow-nsu-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
    >
      {/* hover lift lives on the inner wrapper so it never fights Framer transforms */}
      <span className="block transition-transform duration-300 ease-precision group-hover:-translate-y-1.5">
        {founding && (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 z-20 h-[2px] bg-gold-flare"
          />
        )}

        {/* portrait */}
        <span className="relative block">
          <div className="relative aspect-square overflow-hidden [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-[1.04]">
            <PersonImage
              src={person.imageSrc}
              name={person.name}
              className="h-full w-full"
              initialsClassName="text-5xl"
            />
            {/* sheen sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
            />
            {/* "View profile →" slides up on hover */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-gradient-to-t from-nsu-ink/85 to-nsu-navy/40 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-transform duration-300 ease-precision group-hover:translate-y-0"
            >
              View profile
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <CrosshairCorners />
          {badge && (
            <span className="absolute left-3 top-3 z-20">
              <Chip variant="gold">{badge}</Chip>
            </span>
          )}
        </span>

        {/* body */}
        <span className="block p-5">
          <span className="block font-mono text-lg font-semibold leading-snug tracking-[-0.01em] text-nsu-navy">
            {person.name}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-nsu-slate">
            {person.role}
          </span>
          {person.email && (
            <span className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-nsu-slate/90 [overflow-wrap:anywhere]">
              <Mail className="h-3 w-3 shrink-0 text-nsu-blue" />
              {person.email}
            </span>
          )}
          <span className="mt-3 flex flex-wrap items-center gap-1.5">
            {shown.map((interest) => (
              <Chip key={interest}>{interest}</Chip>
            ))}
            {extra > 0 && <Chip className="bg-nsu-mist text-nsu-slate">+{extra} more</Chip>}
            <Chip variant="concept" className="ml-auto">
              {CATEGORY_META[person.category].label}
            </Chip>
          </span>
        </span>
      </span>
    </motion.button>
  );
}

/**
 * Alumni variant (people.md §3): compact horizontal row - 56px circular
 * portrait + name + current position / role + Alumni tag.
 */
export function AlumniRow({ person, index, onOpen }: CardProps) {
  const position = currentPositionOf(person) ?? person.role;
  return (
    <motion.button
      {...itemMotion(index)}
      type="button"
      onClick={() => onOpen(person.slug)}
      aria-label={`View profile of ${person.name}`}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-nsu-line bg-white px-4 py-3 text-left transition-[border-color,box-shadow] duration-300 hover:border-nsu-blue hover:shadow-nsu-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
    >
      <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <PersonImage
          src={person.imageSrc}
          name={person.name}
          className="h-full w-full"
          initialsClassName="text-base"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-mono text-[0.9375rem] font-semibold text-nsu-navy">
          {person.name}
        </span>
        <span className="block truncate text-sm text-nsu-slate">{position}</span>
      </span>
      <Chip className="hidden shrink-0 sm:inline-flex">Alumni</Chip>
      <ArrowRight
        className={cn(
          "h-4 w-4 shrink-0 text-nsu-slate transition-all duration-300",
          "group-hover:translate-x-1 group-hover:text-nsu-blue",
        )}
      />
    </motion.button>
  );
}
