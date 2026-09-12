import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Images,
  LayoutGrid,
  Mail,
  X,
} from "lucide-react";
import { useGallery, useSite, type GalleryItem } from "@/lib/content";
import { startLenis, stopLenis } from "@/lib/lenis";
import PageHero from "@/components/news/PageHero";
import Chip from "@/components/Chip";
import Reveal from "@/components/Reveal";
import ContentImage from "@/components/ContentImage";
import { galleryCategories } from "@/types/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const ASPECTS = ["aspect-[4/3]", "aspect-square", "aspect-[16/10]"] as const;

function aspectFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ASPECTS[hash % ASPECTS.length];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const CATEGORY_LABEL: Record<string, string> = {
  lab: "Lab",
  events: "Events",
  research: "Research",
  team: "Team",
};

/* ==================================================================== */
export default function Gallery() {
  const items = useGallery();
  const site = useSite();
  const reduced = useReducedMotion();

  const [category, setCategory] = useState<string>("all");
  const [view, setView] = useState<"masonry" | "grid">("masonry");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  const presentCategories = useMemo(
    () => galleryCategories.filter((c) => (counts.get(c) ?? 0) > 0),
    [counts],
  );

  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((i) => i.category === category)),
    [items, category],
  );

  /* close the lightbox whenever the visible set changes */
  useEffect(() => {
    setActiveIndex(null);
  }, [category, view]);

  /* lightbox keyboard nav + body scroll lock */
  const step = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((cur) =>
        cur === null ? cur : (cur + dir + filtered.length) % filtered.length,
      );
    },
    [filtered.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    // background scroll-lock (same pattern as PersonModal): pause Lenis +
    // hide body overflow while the lightbox is open, restore on close
    stopLenis();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      startLenis();
    };
  }, [activeIndex === null, step]);

  const heroChips =
    items.length > 0
      ? [
          `${items.length} PHOTO${items.length === 1 ? "" : "S"}`,
          `${presentCategories.length} ALBUM${presentCategories.length === 1 ? "" : "S"}`,
        ]
      : [];

  return (
    <>
      {/* ------------------------------------------- section 1 - hero */}
      <PageHero
        eyebrow="GALLERY"
        title="Inside the lab."
        sub="Workshops, demos, builds, and the people behind them."
        chips={heroChips}
      />

      {items.length > 0 ? (
        <>
          {/* ---------------------- section 2 - category filter bar */}
          <div className="sticky top-[60px] z-30 border-b border-nsu-line bg-nsu-mist/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-3.5 md:px-8">
              <FilterPill
                active={category === "all"}
                onClick={() => setCategory("all")}
                label="All"
                count={items.length}
              />
              {presentCategories.map((c) => (
                <FilterPill
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  label={CATEGORY_LABEL[c] ?? c}
                  count={counts.get(c) ?? 0}
                />
              ))}

              {/* view toggle */}
              <div className="ml-auto flex items-center gap-1 rounded-full border border-nsu-line bg-white p-1">
                {(
                  [
                    { key: "masonry", icon: Images, label: "Masonry view" },
                    { key: "grid", icon: LayoutGrid, label: "Grid view" },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setView(v.key)}
                    aria-label={v.label}
                    aria-pressed={view === v.key}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      view === v.key
                        ? "bg-nsu-blue text-white"
                        : "text-nsu-slate hover:text-nsu-blue",
                    )}
                  >
                    <motion.span
                      key={`${v.key}-${view === v.key}`}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: PRECISION_EASE }}
                      className="inline-flex"
                    >
                      <v.icon className="h-4 w-4" />
                    </motion.span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --------------------------- section 3 - masonry wall */}
          <section className="bg-nsu-mist py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-5 md:px-8">
              {filtered.length === 0 ? (
                <p className="py-16 text-center text-sm text-nsu-slate">
                  No photos in this category yet.
                </p>
              ) : (
                <div
                  className={
                    view === "masonry"
                      ? "columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4"
                      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((item, i) => (
                      <GalleryTile
                        key={item.slug}
                        item={item}
                        index={i}
                        aspect={view === "masonry" ? aspectFor(item.slug) : "aspect-[4/3]"}
                        masonry={view === "masonry"}
                        reduced={reduced}
                        onOpen={() => setActiveIndex(i)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* ------------------------------ section 5 - empty state */
        <section className="bg-nsu-mist py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-5 md:px-8">
            <Reveal>
              <div className="blueprint-grid relative flex flex-col items-center overflow-hidden rounded-3xl border border-nsu-line bg-white px-8 py-16 text-center md:py-20">
                <ApertureLoop className="mb-8" />
                <h2 className="mb-3 font-display text-2xl font-semibold tracking-[-0.01em] text-nsu-navy md:text-3xl">
                  The lab album is just getting started.
                </h2>
                <p className="mb-8 max-w-lg text-[0.9375rem] leading-relaxed text-nsu-slate">
                  Photos from workshops, demos, and builds will appear here as
                  the lab grows. Check back soon - or get in touch if you have
                  photos from a NIRO event to share.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-white ring-1 ring-nsu-sky/40 transition-transform active:scale-[0.97]"
                  >
                    Contact the lab
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ----------------------------- section 6 - share photos note */}
      <section className="border-t border-nsu-line bg-nsu-ice/60 py-12">
        <Reveal className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 md:px-8">
          <p className="max-w-2xl text-[0.9375rem] text-nsu-text">
            Have photos from a NIRO workshop, demo, or build? We'd love to
            feature them in the lab album - send them our way.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-nsu-blue transition-colors hover:bg-nsu-blue hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {site.email}
          </a>
        </Reveal>
      </section>

      {/* ----------------------------------- section 4 - lightbox */}
      <Lightbox
        items={filtered}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onStep={step}
        onJump={setActiveIndex}
      />
    </>
  );
}

/* --------------------------------------------------------- filter pill */
function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full px-4 py-2 font-mono text-[11px] font-medium transition-colors",
        active ? "text-white" : "text-nsu-blue hover:bg-nsu-ice",
      )}
    >
      {active && (
        <motion.span
          layoutId="gallery-filter-pill"
          transition={{ duration: 0.35, ease: PRECISION_EASE }}
          className="absolute inset-0 rounded-full bg-nsu-blue"
        />
      )}
      <span className="relative">
        {label}
        <span className={cn("ml-1.5", active ? "text-white/70" : "text-nsu-slate")}>
          {count}
        </span>
      </span>
    </button>
  );
}

/* --------------------------------------------------------- gallery tile */
function GalleryTile({
  item,
  index,
  aspect,
  masonry,
  reduced,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  aspect: string;
  masonry: boolean;
  reduced: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: PRECISION_EASE }}
      onClick={onOpen}
      aria-label={`Open photo: ${item.title}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-xl border border-nsu-line text-left",
        masonry && "mb-5 break-inside-avoid",
      )}
    >
      <motion.div layoutId={`gallery-${item.slug}`} className={cn("relative", aspect)}>
        <ContentImage
          src={item.imageSrc}
          type="gallery"
          alt={item.alt ?? item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </motion.div>

      {/* crosshair corners on hover */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      >
        {[
          [6, 6],
          [94, 6],
          [6, 94],
          [94, 94],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} stroke="#3D8FE0" strokeWidth="1.2">
            <line x1="-3.5" y1="0" x2="3.5" y2="0" />
            <line x1="0" y1="-3.5" x2="0" y2="3.5" />
          </g>
        ))}
      </svg>

      {/* hover scrim + caption bar */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-nsu-ink/85 via-nsu-ink/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="translate-y-3 p-4 transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-semibold text-white">
                {item.title}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <time
                  dateTime={item.date.toISOString()}
                  className="font-mono text-[10px] uppercase tracking-wide text-slate-300"
                >
                  {formatDate(item.date)}
                </time>
                <Chip dark>{CATEGORY_LABEL[item.category] ?? item.category}</Chip>
              </div>
            </div>
            <Expand className="h-4 w-4 shrink-0 text-nsu-sky" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------- lightbox */
function Lightbox({
  items,
  index,
  onClose,
  onStep,
  onJump,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  onJump: (index: number) => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);
  const active = index === null ? null : (items[index] ?? null);

  const step = (dir: 1 | -1) => {
    setDirection(dir);
    onStep(dir);
  };

  if (index !== null && !active) return null;

  return (
    <AnimatePresence>
      {active && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex flex-col overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo viewer: ${active.title}`}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {/* scrim */}
          <div
            className="absolute inset-0 bg-nsu-ink/[0.92] backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* close */}
          <button
            onClick={onClose}
            aria-label="Close viewer"
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-nsu-line-dark text-white transition-colors hover:bg-white/10 md:right-6 md:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {/* prev / next */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-nsu-line-dark text-white transition-colors hover:bg-white/10 md:left-6"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-nsu-line-dark text-white transition-colors hover:bg-white/10 md:right-6"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* image - scales from the clicked tile via layoutId */}
          <div className="relative flex flex-1 items-center justify-center px-12 pb-4 pt-16 md:px-24">
            <motion.figure
              layoutId={`gallery-${active.slug}`}
              transition={{ duration: 0.4, ease: PRECISION_EASE }}
              className="relative max-h-[86vh] overflow-hidden rounded-xl"
            >
              <ContentImage
                src={active.imageSrc}
                type="gallery"
                alt={active.alt ?? active.title}
                className="max-h-[86vh] w-auto max-w-full object-contain"
              />
            </motion.figure>
          </div>

          {/* caption bar */}
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, x: direction * 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: PRECISION_EASE }}
            className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-4 text-center md:px-8"
          >
            <div className="font-display text-lg font-semibold text-white">
              {active.title}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-300">
              <time dateTime={active.date.toISOString()}>{formatDate(active.date)}</time>
              <Chip dark>{CATEGORY_LABEL[active.category] ?? active.category}</Chip>
              {active.credit && <span>© {active.credit}</span>}
              <span className="text-nsu-sky tabular-nums">
                {index + 1} / {items.length}
              </span>
            </div>
          </motion.div>

          {/* filmstrip (desktop) */}
          {items.length > 1 && (
            <div className="relative z-10 mx-auto hidden w-full max-w-4xl gap-2 overflow-x-auto px-5 pb-6 md:flex md:px-8">
              {items.map((item, i) => (
                <button
                  key={item.slug}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    onJump(i);
                  }}
                  aria-label={`Photo ${i + 1}: ${item.title}`}
                  className={cn(
                    "h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                    i === index
                      ? "border-nsu-sky"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <ContentImage
                    src={item.imageSrc}
                    type="gallery"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------- aperture empty svg */
function ApertureLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-28 w-28", className)} fill="none" aria-hidden>
      <g className="origin-center animate-[spin_12s_linear_infinite]">
        <polygon
          points="60,14 99.8,37 99.8,83 60,106 20.2,83 20.2,37"
          stroke="#3D8FE0"
          strokeWidth="1.5"
        />
        <polygon
          points="60,32 84.1,46 84.1,74 60,88 35.9,74 35.9,46"
          stroke="#1B5FAA"
          strokeWidth="1.5"
        />
      </g>
      <circle cx="60" cy="60" r="7" stroke="#1B5FAA" strokeWidth="1.5" />
      <circle cx="99.8" cy="37" r="4" fill="#F2A900" />
    </svg>
  );
}
