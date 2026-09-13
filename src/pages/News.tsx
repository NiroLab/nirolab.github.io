import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Medal, X } from "lucide-react";
import { useNews, type NewsPost } from "@/lib/content";
import PageHero from "@/components/news/PageHero";
import NewsCard, {
  formatNewsDate,
  isAwardPost,
  monthGroupKey,
} from "@/components/news/NewsCard";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import ContentImage from "@/components/ContentImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ==================================================================== */
export default function News() {
  const news = useNews();
  const reduced = useReducedMotion();
  const [tag, setTag] = useState<string | null>(null);
  const [archiveYear, setArchiveYear] = useState<string>("all");

  /* derived facets */
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of news)
      for (const t of post.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [news]);

  const archiveYears = useMemo(
    () =>
      [...new Set(news.map((p) => p.date.getUTCFullYear()))].sort((a, b) => b - a),
    [news],
  );

  /* filter: strict date-desc order is preserved from useNews() */
  const filtered = useMemo(
    () =>
      news.filter((p) => {
        if (tag && !p.tags.includes(tag)) return false;
        if (archiveYear !== "all" && p.date.getUTCFullYear() !== Number(archiveYear))
          return false;
        return true;
      }),
    [news, tag, archiveYear],
  );

  const featured = filtered[0] ?? null;
  const feed = filtered.slice(1);

  /* month groups for the timeline */
  const monthGroups = useMemo(() => {
    const map = new Map<string, NewsPost[]>();
    for (const post of feed) {
      const key = monthGroupKey(post.date);
      const bucket = map.get(key) ?? [];
      bucket.push(post);
      map.set(key, bucket);
    }
    return [...map.entries()];
  }, [feed]);

  /* timeline spine draw-on-scroll */
  const feedRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: feedRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const spineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  /* newest by date (news is strictly date-descending) */
  const latest = useMemo(
    () =>
      news.length === 0
        ? null
        : news.reduce((a, b) => (b.date.getTime() > a.date.getTime() ? b : a)),
    [news],
  );
  const heroChips =
    news.length > 0
      ? [
          `${news.length} ${news.length === 1 ? "STORY" : "STORIES"}`,
          ...(latest
            ? [
                `LATEST: ${latest.date
                  .toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                  .toUpperCase()}`,
              ]
            : []),
        ]
      : [];

  return (
    <>
      {/* ------------------------------------------- section 1 - hero */}
      <PageHero
        eyebrow="NEWS & EVENTS"
        title="What's happening at NIRO."
        sub="Workshops, awards, demos, and milestones from the lab."
        chips={heroChips}
      />

      {news.length === 0 ? (
        <section className="bg-nsu-mist py-14 md:py-28">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <EmptyState
              title="No stories yet"
              message="News and announcements from the lab will appear here."
            />
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="bg-nsu-mist py-14">
          <div className="mx-auto flex max-w-xl flex-col items-center px-5 text-center md:px-8">
            <p className="mb-6 text-nsu-slate">
              No stories match the selected tag and year.
            </p>
            <button
              onClick={() => {
                setTag(null);
                setArchiveYear("all");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 px-5 py-2.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* --------------------- section 2 - pinned / latest feature */}
          {featured && (
            <section className="bg-nsu-mist pt-16 md:pt-24">
              <div className="mx-auto max-w-7xl px-5 md:px-8">
                <Reveal>
                  <Link
                    to={`/news/${featured.slug}`}
                    className="group grid overflow-hidden rounded-3xl border border-nsu-line bg-white transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(16,34,44,0.06),0_8px_24px_-8px_rgba(16,34,44,0.12)] lg:grid-cols-12"
                  >
                    {/* image - clip reveal */}
                    <div className="relative overflow-hidden lg:col-span-7">
                      <motion.div
                        initial={{ clipPath: reduced ? undefined : "inset(0 12% 0 0)" }}
                        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.9, ease: PRECISION_EASE }}
                        className="h-full"
                      >
                        <ContentImage
                          src={featured.imageSrc}
                          type="news"
                          alt={featured.title}
                          className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </motion.div>
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-nsu-gold px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-nsu-ink shadow-sm">
                        {featured.pinned ? "Pinned" : "Latest"}
                      </span>
                      {isAwardPost(featured) && (
                        <Medal className="absolute right-4 top-4 h-6 w-6 text-nsu-gold drop-shadow" />
                      )}
                    </div>

                    {/* content */}
                    <div className="flex flex-col justify-center p-7 md:p-10 lg:col-span-5">
                      <RevealGroup>
                        <RevealItem y={16}>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
                            <time dateTime={featured.date.toISOString()}>
                              {formatNewsDate(featured.date)}
                            </time>
                            {featured.tags.map((t) => (
                              <Chip key={t}>{t}</Chip>
                            ))}
                          </div>
                        </RevealItem>
                        <RevealItem y={20}>
                          <h2 className="mt-4 type-h3 text-nsu-navy transition-colors group-hover:text-nsu-blue">
                            {featured.title}
                          </h2>
                        </RevealItem>
                        {featured.summary && (
                          <RevealItem y={20}>
                            <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-nsu-slate">
                              {featured.summary}
                            </p>
                          </RevealItem>
                        )}
                        <RevealItem y={20}>
                          <div className="mt-6 flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
                              <Clock className="h-3.5 w-3.5" />
                              {featured.readingTime} min read
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-nsu-sky/40">
                              Read story
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </div>
                        </RevealItem>
                      </RevealGroup>
                    </div>
                  </Link>
                </Reveal>
              </div>
            </section>
          )}

          {/* ------------------------------ section 3 - timeline feed */}
          {feed.length > 0 && (
            <section className="bg-nsu-mist py-16 md:py-24">
              <div ref={feedRef} className="relative mx-auto max-w-7xl px-5 md:px-8">
                {/* spine */}
                <div className="absolute bottom-4 left-[30px] top-2 w-px md:left-[204px]">
                  <div className="absolute inset-0 bg-nsu-line" />
                  <motion.div
                    style={{ scaleY: reduced ? 1 : spineScale }}
                    className="absolute inset-0 origin-top bg-nsu-sky/60"
                    aria-hidden
                  />
                </div>

                <div className="space-y-12">
                  {monthGroups.map(([month, posts]) => (
                    <div key={month} className="relative md:grid md:grid-cols-[140px_1fr] md:gap-16">
                      {/* pulse node */}
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        transition={{ duration: 0.4, ease: PRECISION_EASE }}
                        className="absolute left-[3.5px] top-2 z-10 flex h-[13px] w-[13px] md:left-[166px]"
                        aria-hidden
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nsu-sky opacity-50" />
                        <span className="relative inline-flex h-[13px] w-[13px] rounded-full border-2 border-nsu-sky bg-white" />
                      </motion.span>

                      {/* month header floats left */}
                      <div className="mb-4 pl-8 type-eyebrow text-nsu-slate md:mb-0 md:pl-0 md:pt-1 md:text-right">
                        {month}
                      </div>

                      {/* rows */}
                      <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.08 } },
                        }}
                        className="ml-8 space-y-1 md:ml-0"
                      >
                        {posts.map((post) => (
                          <motion.div
                            key={post.slug}
                            variants={{
                              hidden: { opacity: 0, x: reduced ? 0 : -20 },
                              show: {
                                opacity: 1,
                                x: 0,
                                transition: { duration: 0.6, ease: PRECISION_EASE },
                              },
                            }}
                          >
                            <NewsCard post={post} />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* ------------------------ section 4 - archive + tags footer */}
      {news.length > 0 && (
        <section className="border-t border-nsu-line bg-white py-14">
          <Reveal className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-2xl">
                <div className="mb-4 type-eyebrow text-nsu-blue">
                  {"// FILTER BY TAG"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    <motion.button
                      layout
                      key="all"
                      onClick={() => setTag(null)}
                      className={cn(
                        "rounded-full px-4 py-2 font-mono text-[11px] font-medium transition-colors",
                        tag === null
                          ? "bg-nsu-blue text-white"
                          : "bg-nsu-ice text-nsu-blue hover:bg-nsu-sky/20",
                      )}
                    >
                      all stories
                    </motion.button>
                    {tagCounts.map(([t, count]) => (
                      <motion.button
                        layout
                        key={t}
                        onClick={() => setTag((cur) => (cur === t ? null : t))}
                        className={cn(
                          "rounded-full px-4 py-2 font-mono text-[11px] font-medium transition-colors",
                          tag === t
                            ? "bg-nsu-blue text-white"
                            : "bg-nsu-ice text-nsu-blue hover:bg-nsu-sky/20",
                        )}
                      >
                        {t}
                        <span className="ml-1.5 opacity-60">{count}</span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <div className="mb-4 type-eyebrow text-nsu-blue">
                  {"// ARCHIVE"}
                </div>
                <label className="relative inline-flex items-center">
                  <span className="sr-only">Filter by year</span>
                  <select
                    value={archiveYear}
                    onChange={(e) => setArchiveYear(e.target.value)}
                    className="appearance-none rounded-full border border-nsu-line bg-white py-2 pl-4 pr-9 font-mono text-[11px] font-medium text-nsu-blue outline-none transition-colors focus:border-nsu-blue/50"
                  >
                    <option value="all">All years</option>
                    {archiveYears.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-nsu-slate" />
                </label>
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
