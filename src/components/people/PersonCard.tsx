import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Mail, GraduationCap, Globe, Linkedin } from "lucide-react";
import type { Person } from "@/lib/content";
import Chip from "@/components/Chip";
import { PersonImage } from "@/components/ContentImage";
import { cn } from "@/lib/utils";
import { currentPositionOf, interestsOf } from "./meta";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface CardProps {
  person: Person;
  index: number;
  onOpen: (slug: string) => void;
}

type PersonCardProps = Omit<CardProps, "onOpen">;

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
 * PersonCard: horizontal directory card mirroring the About Leadership
 * design - circular portrait left, name / role / office / interest chips /
 * contact icon links right. Whole card opens the profile modal via ?m=.
 */
export default function PersonCard({ person, index }: PersonCardProps) {
  const interests = interestsOf(person).slice(0, 4);
  const links = [
    person.email
      ? { icon: Mail, href: `mailto:${person.email}`, label: "Email" }
      : null,
    person.scholar
      ? { icon: GraduationCap, href: person.scholar, label: "Google Scholar" }
      : null,
    person.website
      ? { icon: Globe, href: person.website, label: "Website" }
      : null,
    person.linkedin
      ? { icon: Linkedin, href: person.linkedin, label: "LinkedIn" }
      : null,
  ].filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <motion.article
      {...itemMotion(index)}
      className="group relative flex h-full flex-col gap-7 rounded-2xl border border-nsu-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-nsu-sky/60 hover:shadow-nsu-card sm:flex-row sm:p-8"
    >
      {/* whole card opens the profile modal (?m= deep link);
          icon links below sit above this overlay (z-10) and stay clickable */}
      <Link
        to={`/people?m=${person.slug}`}
        aria-label={`Open ${person.name}'s profile`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nsu-blue"
      />
      <PersonImage
        src={person.imageSrc}
        name={person.name}
        className="h-32 w-32 shrink-0 self-center rounded-full sm:h-36 sm:w-36"
        initialsClassName="text-3xl"
      />
      <div className="min-w-0">
        <h3 className="font-mono text-[1.375rem] font-semibold tracking-[-0.01em] text-nsu-navy">
          {person.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-nsu-blue">{person.role}</p>
        {person.office && (
          <p className="mt-1 font-mono text-xs text-nsu-slate">
            Office {person.office}
          </p>
        )}
        {interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Chip key={interest}>{interest}</Chip>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="relative z-10 mt-5 flex items-center gap-2">
            {links.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={`${person.name} - ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-nsu-line text-nsu-blue transition-colors hover:border-nsu-blue hover:bg-nsu-ice"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
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
      className="group relative flex h-full w-full items-center gap-4 overflow-hidden rounded-xl border border-nsu-line bg-white px-4 py-3 text-left transition-[border-color,box-shadow] duration-300 hover:border-nsu-blue hover:shadow-nsu-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
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
        <span className="block line-clamp-1 break-words font-mono text-[0.9375rem] font-semibold leading-snug text-nsu-navy">
          {person.name}
        </span>
        <span className="block line-clamp-2 break-words text-sm leading-snug text-nsu-slate">{position}</span>
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
