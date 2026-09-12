/**
 * Image resolution for the file-based CMS (design.md §7.3.4 / §7.4).
 *
 * Every content `image` field points at a path under /public/assets/... .
 * Files in /public are served verbatim, so a referenced path either exists
 * (the contributor dropped a real photo at that exact path) or 404s.
 * We therefore:
 *   1. Return the contributor's path when present (real file swaps in
 *      automatically - no code change needed), and
 *   2. Render through <ContentImage/>, which falls back to the typed
 *      placeholder via onError if the file is not there yet.
 * When no image field is set at all, the typed placeholder is used directly.
 */

export type PlaceholderType =
  | "person"
  | "project"
  | "news"
  | "gallery"
  | "achievement"
  | "map";

export const PLACEHOLDERS: Record<PlaceholderType, string> = {
  person: "/assets/placeholders/person.svg",
  project: "/assets/placeholders/project.svg",
  news: "/assets/placeholders/news.svg",
  gallery: "/assets/placeholders/gallery.svg",
  achievement: "/assets/placeholders/achievement.svg",
  map: "/assets/placeholders/map.svg",
};

/** Resolve an entry image: contributor path if given, else typed placeholder. */
export function resolveImage(
  image: string | undefined,
  type: PlaceholderType,
): string {
  if (image && image.trim().length > 0) return image;
  return PLACEHOLDERS[type];
}

/** True when the entry has no image of its own (pure placeholder). */
export function isPlaceholderImage(image: string | undefined): boolean {
  return !image || image.trim().length === 0;
}

/** Initials derived from a person name, for the person-placeholder overlay. */
export function personInitials(name: string): string {
  const cleaned = name
    .replace(/^(Dr\.?|Prof\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
