import { Link } from "react-router";
import { ArrowRight, Clock, Medal } from "lucide-react";
import type { NewsPost } from "@/lib/content";
import Chip from "@/components/Chip";
import ContentImage from "@/components/ContentImage";
import { cn } from "@/lib/utils";

/** UTC-safe date formatting (frontmatter dates are UTC midnight). */
export function formatNewsDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function monthGroupKey(date: Date): string {
  return date
    .toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    .toUpperCase();
}

export function isAwardPost(post: NewsPost): boolean {
  return post.tags.some((t) => /award|champion|prize/i.test(t));
}

/**
 * NewsCard - row variant (news.md §A.3): 120×80 thumb, mono date, 2-line
 * Sora title, 1-line slate summary, tag chip, sliding arrow. Award posts
 * get a small gold medal glyph.
 */
export default function NewsCard({
  post,
  className,
}: {
  post: NewsPost;
  className?: string;
}) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-nsu-ice/70 sm:gap-5",
        className,
      )}
    >
      <div className="relative h-20 w-[120px] shrink-0 overflow-hidden rounded-lg border border-nsu-line">
        <ContentImage
          src={post.imageSrc}
          type="news"
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
          <time dateTime={post.date.toISOString()}>{formatNewsDate(post.date)}</time>
          {isAwardPost(post) && (
            <Medal className="h-3.5 w-3.5 text-nsu-gold" aria-label="Award story" />
          )}
          <span className="hidden items-center gap-1 sm:inline-flex">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 type-h3 text-nsu-navy transition-colors group-hover:text-nsu-blue">
          {post.title}
        </h3>
        {post.summary && (
          <p className="mt-1 truncate text-sm text-nsu-slate">{post.summary}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
            {post.tags.slice(0, 3).map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        )}
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-nsu-blue opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  );
}
