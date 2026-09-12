import type { Person } from "@/lib/content";
import type { PersonCategory } from "@/types/content";

/** Ordered category metadata for the People directory (people.md §2-§3). */
export const CATEGORY_ORDER: PersonCategory[] = [
  "founding_faculty",
  "affiliated_faculty",
  "ra",
  "student",
  "alumni",
];

export const CATEGORY_META: Record<
  PersonCategory,
  { /** pill / subsection label */
    label: string;
    /** hero count-chip label (mono uppercase) */
    hero: string;
  }
> = {
  founding_faculty: { label: "Founding Faculty", hero: "FOUNDING FACULTY" },
  affiliated_faculty: { label: "Affiliated Faculty", hero: "AFFILIATED FACULTY" },
  ra: { label: "Research Assistants", hero: "RESEARCH ASSISTANTS" },
  student: { label: "Student Researchers", hero: "STUDENTS" },
  alumni: { label: "Alumni", hero: "ALUMNI" },
};

/** research_interests is a comma-separated string in the CMS frontmatter. */
export function interestsOf(person: Person): string[] {
  return (person.research_interests ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Founding-faculty badge derived from the role text (Director / Co-Director). */
export function directorBadge(role: string): string | null {
  if (/co[- ]director/i.test(role)) return "Co-Director";
  if (/director/i.test(role)) return "Director";
  return null;
}

/**
 * Optional alumni current position. The zod contract does not (yet) expose a
 * `current_position` field, but content files may carry one - read it
 * defensively and fall back to the role text.
 */
export function currentPositionOf(person: Person): string | null {
  const raw = (person as unknown as Record<string, unknown>).current_position;
  return typeof raw === "string" && raw.trim().length > 0 ? raw : null;
}
