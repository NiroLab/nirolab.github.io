import { useState } from "react";
import {
  PLACEHOLDERS,
  personInitials,
  type PlaceholderType,
} from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * CMS image with automatic typed-placeholder fallback (design.md §7.4).
 * If the contributor's file at `src` is missing, the typed placeholder
 * from /assets/placeholders/ is rendered instead - the layout never breaks.
 */
export default function ContentImage({
  src,
  type,
  alt = "",
  className,
  dark = false,
  ...rest
}: {
  src: string | undefined;
  type: PlaceholderType;
  alt?: string;
  className?: string;
  /** Set on dark surfaces: hairline uses nsu-line-dark instead of nsu-line. */
  dark?: boolean;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">) {
  const placeholder = PLACEHOLDERS[type];
  const [failed, setFailed] = useState(false);
  const effective = !src || failed ? placeholder : src;
  return (
    <img
      src={effective}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "rounded-[inherit] border",
        dark ? "border-nsu-line-dark" : "border-nsu-line",
        className,
      )}
      {...rest}
    />
  );
}

/**
 * Person portrait: when the person's image is missing, renders the person
 * placeholder with an initials overlay (design.md §7.4).
 */
export function PersonImage({
  src,
  name,
  className,
  initialsClassName,
  dark = false,
}: {
  src: string | undefined;
  name: string;
  className?: string;
  initialsClassName?: string;
  /** Set on dark surfaces: hairline uses nsu-line-dark instead of nsu-line. */
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showInitials = !src || failed;
  return (
    <div
      className={cn(
        "relative overflow-hidden border",
        dark ? "border-nsu-line-dark" : "border-nsu-line",
        className,
      )}
    >
      <img
        src={showInitials ? PLACEHOLDERS.person : src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {showInitials && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold tracking-tight text-white/70",
            initialsClassName,
          )}
        >
          {personInitials(name)}
        </span>
      )}
    </div>
  );
}
