import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Facebook,
  Link2,
  Linkedin,
  Medal,
  Twitter,
} from "lucide-react";
import { useNews, useNewsPost } from "@/lib/content";
import NewsCard, { formatNewsDate, isAwardPost } from "@/components/news/NewsCard";
import Chip from "@/components/Chip";
import Markdown from "@/components/Markdown";
import ContentImage from "@/components/ContentImage";
import Reveal from "@/components/Reveal";
import { copyText } from "@/components/publications/PubItem";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ==================================================================== */
export default function NewsPost() {
  const { slug = "" } = useParams();
  const post = useNewsPost(slug);
  const news = useNews();
  const reduced = useReducedMotion();

  /* reading-progress hairline scoped to the article body */
  const bodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ["start 0.35", "end 0.9"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  /* chronological (date desc) order for newer/older navigation */
  const chronological = useMemo(
    () => [...news].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [news],
  );
  const index = chronological.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? chronological[index - 1] : null;
  const older = index >= 0 && index < chronological.length - 1 ? chronological[index + 1] : null;

  /* related: up to 2 posts sharing a tag */
  const related = useMemo(() => {
    if (!post) return [];
    return news
      .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
      .slice(0, 2);
  }, [news, post]);

  /* ------------------------------------------------ graceful 404 */
  if (!post) {
    return (
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="blueprint-grid-dark absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-center justify-center px-5 py-32 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: PRECISION_EASE }}
          >
            <div className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.22em] text-[#7FB3EC]">
              {"// 404 · STORY NOT FOUND"}
            </div>
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl">
              This story isn't in the archive.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-slate-300">
              The link may be outdated, or the story may have been moved.
              Browse the latest news from the lab instead.
            </p>
            <Link
              to="/news"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-7 py-3.5 text-[0.9375rem] font-semibold text-white ring-1 ring-nsu-sky/40 transition-transform active:scale-[0.97]"
            >
              <ArrowLeft className="h-4 w-4" />
              All news
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  const words = post.title.split(" ");
  const year = post.date.getUTCFullYear();

  return (
    <>
      {/* reading-progress hairline (article-scoped, under the navbar) */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-[61px] z-40 h-0.5 w-full origin-left bg-nsu-sky"
        aria-hidden
      />

      {/* ------------------------------------- section 1 - article hero */}
      <section className="relative flex min-h-[65dvh] items-end overflow-hidden bg-nsu-ink">
        <motion.div
          initial={{ scale: reduced ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: PRECISION_EASE }}
          className="absolute inset-0"
        >
          <ContentImage
            src={post.imageSrc}
            type="news"
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-nsu-ink via-nsu-ink/70 to-nsu-ink/30"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-4xl px-5 pb-16 pt-32 md:px-8 md:pb-20">
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[#7FB3EC]"
          >
            <Link to="/news" className="hover:text-white">
              NEWS
            </Link>
            <span className="mx-2 text-slate-400">/</span>
            {year}
            <span className="mx-2 text-slate-400">/</span>
            <span className="break-all text-slate-300">{post.slug}</span>
          </motion.div>

          {/* meta row */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: PRECISION_EASE }}
            className="mb-5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-300"
          >
            <time dateTime={post.date.toISOString()}>{formatNewsDate(post.date)}</time>
            <span className="text-slate-500">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min read
            </span>
            {isAwardPost(post) && (
              <>
                <span className="text-slate-500">·</span>
                <Chip variant="gold">
                  <Medal className="h-3 w-3" />
                  award
                </Chip>
              </>
            )}
            {post.tags.map((t) => (
              <Chip key={t} dark>
                {t}
              </Chip>
            ))}
          </motion.div>

          {/* word-mask title */}
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            {words.map((word, i) => (
              <span key={i}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: reduced ? "0%" : "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + i * 0.045,
                      ease: PRECISION_EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          {post.summary && (
            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: PRECISION_EASE }}
              className="mt-5 max-w-2xl text-[1.25rem] leading-[1.6] text-slate-200"
            >
              {post.summary}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-8"
          >
            <Link
              to="/news"
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-sky transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All news
            </Link>
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------- section 2 - body + share */}
      <section className="bg-nsu-mist py-16 md:py-20">
        <div ref={bodyRef} className="relative mx-auto max-w-3xl px-5 md:px-8">
          {/* share rail - sticky right on desktop, row on mobile */}
          <div className="lg:absolute lg:-right-24 lg:top-0 lg:h-full">
            <ShareRail title={post.title} />
          </div>

          <Reveal y={24}>
            <Markdown
              html={post.html}
              className={cn(
                // article typography per news.md §B.2
                "[&>p:first-of-type]:first-letter:float-left",
                "[&>p:first-of-type]:first-letter:mr-3",
                "[&>p:first-of-type]:first-letter:font-display",
                "[&>p:first-of-type]:first-letter:text-[3.5rem]",
                "[&>p:first-of-type]:first-letter:font-bold",
                "[&>p:first-of-type]:first-letter:leading-[0.9]",
                "[&>p:first-of-type]:first-letter:text-nsu-navy",
                "[&_blockquote]:rounded-r-xl [&_blockquote]:bg-nsu-ice [&_blockquote]:py-4 [&_blockquote]:pr-5 [&_blockquote]:not-italic",
              )}
            />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ section 3 - related + prev/next */}
      {(related.length > 0 || newer || older) && (
        <section className="border-t border-nsu-line bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            {related.length > 0 && (
              <Reveal className="mb-12">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-nsu-blue" />
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                    {"// RELATED STORIES"}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {related.map((p) => (
                    <NewsCard key={p.slug} post={p} />
                  ))}
                </div>
              </Reveal>
            )}

            {(newer || older) && (
              <Reveal className="grid gap-4 sm:grid-cols-2">
                {newer ? (
                  <NavCard post={newer} direction="newer" />
                ) : (
                  <span className="hidden sm:block" />
                )}
                {older ? (
                  <NavCard post={older} direction="older" />
                ) : (
                  <span className="hidden sm:block" />
                )}
              </Reveal>
            )}
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------------------------------------------------- share rail */
function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const onCopy = async () => {
    const ok = await copyText(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const buttons = [
    {
      key: "copy",
      label: copied ? "Copied ✓" : "Copy link",
      icon: copied ? Check : Link2,
      onClick: onCopy,
      active: copied,
    },
    {
      key: "x",
      label: "Share on X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="mb-8 flex gap-2 lg:sticky lg:top-32 lg:mb-0 lg:flex-col">
      {buttons.map((b) => {
        const Icon = b.icon;
        const inner = (
          <>
            <Icon className="h-4 w-4" />
            {/* tooltip micro-pop */}
            <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-nsu-ink px-2.5 py-1 font-mono text-[10px] text-white opacity-0 transition-all duration-200 group-hover:opacity-100 lg:block">
              {b.label}
            </span>
          </>
        );
        const cls = cn(
          "group relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
          b.active
            ? "border-nsu-success/50 bg-nsu-success/10 text-nsu-success"
            : "border-nsu-line bg-white text-nsu-blue hover:border-nsu-blue/50 hover:bg-nsu-ice",
        );
        return b.href ? (
          <a
            key={b.key}
            href={b.href}
            target="_blank"
            rel="noreferrer"
            aria-label={b.label}
            className={cls}
          >
            {inner}
          </a>
        ) : (
          <button key={b.key} onClick={b.onClick} aria-label={b.label} className={cls}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------- prev / next */
function NavCard({
  post,
  direction,
}: {
  post: { slug: string; title: string; date: Date };
  direction: "newer" | "older";
}) {
  const newer = direction === "newer";
  return (
    <Link
      to={`/news/${post.slug}`}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden rounded-2xl bg-nsu-navy px-7 py-6 transition-colors hover:bg-nsu-ink",
        !newer && "sm:items-end sm:text-right",
      )}
    >
      <div className="blueprint-grid-dark absolute inset-0 opacity-40" aria-hidden />
      <span className="relative mb-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#7FB3EC]">
        {newer ? (
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
        ) : null}
        {newer ? "Newer" : "Older"}
        {newer ? null : (
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      <span className="relative line-clamp-2 font-display text-lg font-semibold leading-snug text-white">
        {post.title}
      </span>
    </Link>
  );
}
