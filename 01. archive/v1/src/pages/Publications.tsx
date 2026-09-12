import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Command,
  Download,
  Mail,
  Search,
  X,
} from "lucide-react";
import { usePeople, usePublications, useSite, type Publication } from "@/lib/content";
import PageHero from "@/components/news/PageHero";
import PubItem, { bibtexFor } from "@/components/publications/PubItem";
import Reveal from "@/components/Reveal";
import { publicationTypes } from "@/types/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type SortMode = "newest" | "oldest" | "title";

const SORT_LABEL: Record<SortMode, string> = {
  newest: "Newest",
  oldest: "Oldest",
  title: "Title A-Z",
};

/* ------------------------------------------------ sample (empty state) */
/** Rendered in the designed empty state as a labeled EXAMPLE of what one
 *  publication entry will look like. */
const SAMPLE_PUB: Publication = {
  slug: "example-publication",
  filePath: "/content/publications/example-publication.md",
  title: "Swarm Coordination for Low-Cost Educational Robots",
  authors: ["Siddique, S.", "Rahman, A."],
  venue: "IEEE Robotics & Automation Letters",
  year: 2026,
  type: "journal",
  areas: ["Multi-robot systems"],
  doi: "10.0000/example.2026.001",
  pdf: undefined,
  code: undefined,
  abstract:
    "An illustrative example of how a publication from the lab will appear here once our first papers are published.",
  body: "",
  html: "",
  bibtex: null,
};

/* ------------------------------------------------------ orbit empty svg */
function OrbitLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-28 w-28", className)} fill="none" aria-hidden>
      <circle cx="60" cy="60" r="18" stroke="#1B5FAA" strokeWidth="1.5" />
      <g className="origin-center animate-[spin_6s_linear_infinite]">
        <g transform="rotate(18 60 60)">
          <ellipse cx="60" cy="60" rx="48" ry="27" stroke="#3D8FE0" strokeWidth="1.5" />
          <circle cx="108" cy="60" r="4.5" fill="#F2A900" />
        </g>
      </g>
    </svg>
  );
}

/* ==================================================================== */
export default function Publications() {
  const { all, years, areas } = usePublications();
  const people = usePeople();
  const site = useSite();
  const reduced = useReducedMotion();

  /* toolbar state */
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [area, setArea] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("newest");
  const searchRef = useRef<HTMLInputElement>(null);

  /* 200ms debounce + ⌘K focus */
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* NIRO member surnames → bold matched authors */
  const memberSurnames = useMemo(() => {
    const set = new Set<string>();
    for (const p of people) {
      const cleaned = p.name.replace(/^(dr|prof|professor|md|mr|ms|mrs)\.?\s+/i, "");
      const tokens = cleaned.trim().split(/\s+/);
      const surname = tokens[tokens.length - 1]?.toLowerCase().replace(/[^a-z-]/g, "");
      if (surname) set.add(surname);
    }
    return set;
  }, [people]);

  /* facets */
  const venues = useMemo(() => new Set(all.map((p) => p.venue)).size, [all]);
  const sinceYear = years.length > 0 ? years[years.length - 1] : null;
  const presentTypes = useMemo(
    () => publicationTypes.filter((t) => all.some((p) => p.type === t)),
    [all],
  );

  /* filter + sort */
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = all.filter((p) => {
      if (year !== "all" && p.year !== Number(year)) return false;
      if (type !== "all" && p.type !== type) return false;
      if (area !== "all" && !p.areas.includes(area)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q))
      );
    });
    return list.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = sort === "newest" ? b.year - a.year : a.year - b.year;
      return diff || a.title.localeCompare(b.title);
    });
  }, [all, debouncedQuery, year, type, area, sort]);

  /* group by year, group order follows sort */
  const groups = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const p of filtered) {
      const bucket = map.get(p.year) ?? [];
      bucket.push(p);
      map.set(p.year, bucket);
    }
    return [...map.entries()].sort((a, b) =>
      sort === "oldest" ? a[0] - b[0] : b[0] - a[0],
    );
  }, [filtered, sort]);

  const resetFilters = () => {
    setQuery("");
    setYear("all");
    setType("all");
    setArea("all");
  };

  /* export every entry as one .bib file */
  const exportAll = () => {
    const bib = all.map(bibtexFor).join("\n\n");
    const blob = new Blob([bib], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "niro-lab-publications.bib";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const heroChips =
    all.length > 0
      ? [
          `${all.length} PUBLICATION${all.length === 1 ? "" : "S"}`,
          `${venues} VENUE${venues === 1 ? "" : "S"}`,
          ...(sinceYear ? [`SINCE ${sinceYear}`] : []),
        ]
      : [];

  return (
    <>
      {/* ------------------------------------------- section 1 - hero */}
      <PageHero
        eyebrow="PUBLICATIONS"
        title="Research in print."
        sub="Peer-reviewed and presented work from NIRO Lab - robotics, AI, and intelligent systems."
        chips={heroChips}
      />

      {all.length > 0 ? (
        <>
          {/* -------------------------------- section 2 - toolbar */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className="sticky top-[60px] z-30 border-b border-nsu-line bg-nsu-mist/85 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3.5 md:px-8">
              {/* search */}
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nsu-slate" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search title, author, venue…"
                  aria-label="Search publications"
                  className="w-full rounded-full border border-nsu-line bg-white py-2.5 pl-10 pr-16 text-sm text-nsu-text outline-none transition-colors placeholder:text-nsu-slate/70 focus:border-nsu-blue/50 focus:ring-2 focus:ring-nsu-sky/20"
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-nsu-line bg-nsu-ice px-1.5 py-0.5 font-mono text-[10px] text-nsu-slate md:inline-flex">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>

              {/* facet dropdowns */}
              <FacetSelect
                label="Year"
                value={year}
                onChange={setYear}
                options={[
                  { value: "all", label: "All years" },
                  ...years.map((y) => ({ value: String(y), label: String(y) })),
                ]}
              />
              <FacetSelect
                label="Type"
                value={type}
                onChange={setType}
                options={[
                  { value: "all", label: "All types" },
                  ...presentTypes.map((t) => ({
                    value: t,
                    label: t[0].toUpperCase() + t.slice(1),
                  })),
                ]}
              />
              <FacetSelect
                label="Area"
                value={area}
                onChange={setArea}
                options={[
                  { value: "all", label: "All areas" },
                  ...areas.map((a) => ({ value: a, label: a })),
                ]}
              />

              {/* sort + export */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() =>
                    setSort((s) =>
                      s === "newest" ? "oldest" : s === "oldest" ? "title" : "newest",
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-nsu-line bg-white px-4 py-2 font-mono text-[11px] font-medium text-nsu-blue transition-colors hover:border-nsu-blue/40 hover:bg-nsu-ice"
                  title="Toggle sort order"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {SORT_LABEL[sort]}
                </button>
                <button
                  onClick={exportAll}
                  disabled={all.length === 0}
                  title={
                    all.length === 0
                      ? "No publications to export yet"
                      : "Download all entries as one .bib file"
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-nsu-blue/40 bg-nsu-blue px-4 py-2 font-mono text-[11px] font-semibold text-white transition-colors hover:bg-nsu-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  export .bib (all)
                </button>
              </div>
            </div>
          </motion.div>

          {/* -------------------------------- section 3 - list */}
          <section className="bg-nsu-mist py-16 md:py-20">
            <div className="mx-auto max-w-4xl px-5 md:px-8">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-nsu-line bg-white/60 px-8 py-16 text-center">
                  <Search className="mb-4 h-8 w-8 text-nsu-slate/60" />
                  <h3 className="mb-2 font-display text-xl font-semibold text-nsu-navy">
                    No matches for these filters
                  </h3>
                  <p className="mb-6 max-w-md text-sm text-nsu-slate">
                    Try a different search term or clear the active filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 px-5 py-2.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice"
                  >
                    <X className="h-4 w-4" />
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-14">
                  <AnimatePresence mode="popLayout">
                    {groups.map(([groupYear, pubs]) => (
                      <motion.section
                        key={groupYear}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        aria-label={`Publications from ${groupYear}`}
                      >
                        {/* sticky year header w/ ghost numeral */}
                        <div className="relative mb-2 flex items-end justify-between lg:sticky lg:top-[132px] lg:z-10 lg:bg-nsu-mist/90 lg:py-2 lg:backdrop-blur-sm">
                          <h2 className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                            {"// "}
                            {groupYear}
                            <span className="ml-3 text-nsu-slate">
                              {pubs.length} {pubs.length === 1 ? "entry" : "entries"}
                            </span>
                          </h2>
                          <span
                            aria-hidden
                            className="pointer-events-none select-none font-display text-6xl font-extrabold leading-none text-nsu-navy/[0.06] md:text-7xl"
                          >
                            {groupYear}
                          </span>
                        </div>
                        <div className="border-t border-nsu-line">
                          <AnimatePresence mode="popLayout" initial={false}>
                            {pubs.map((pub) => (
                              <PubItem
                                key={pub.slug}
                                pub={pub}
                                memberSurnames={memberSurnames}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.section>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* ------------------------------ section 4 - empty state */
        <section className="bg-nsu-mist py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <Reveal>
              <div className="blueprint-grid relative flex flex-col items-center overflow-hidden rounded-3xl border border-nsu-line bg-white px-8 py-16 text-center md:py-20">
                <OrbitLoop className="mb-8" />
                <h2 className="mb-3 font-display text-2xl font-semibold tracking-[-0.01em] text-nsu-navy md:text-3xl">
                  Our first publications are on their way.
                </h2>
                <p className="mb-8 max-w-lg text-[0.9375rem] leading-relaxed text-nsu-slate">
                  The lab is young and our first papers are in the pipeline.
                  Peer-reviewed and presented work will be listed here as it is
                  published.
                </p>
              </div>
            </Reveal>

            {/* live example card */}
            <Reveal delay={0.2} y={24}>
              <div className="mt-10">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-nsu-line" />
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-nsu-slate">
                    Example - what one entry will look like
                  </span>
                  <span className="h-px flex-1 bg-nsu-line" />
                </div>
                <div className="rounded-2xl border border-dashed border-nsu-blue/30 bg-white/80">
                  <PubItem pub={SAMPLE_PUB} memberSurnames={memberSurnames} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------------------------- section 5 - collaboration note */}
      <section className="border-t border-nsu-line bg-nsu-ice/60 py-12">
        <Reveal className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 md:px-8">
          <p className="text-[0.9375rem] text-nsu-text">
            Interested in co-authoring or citing our work?{" "}
            <span className="font-semibold text-nsu-navy">Contact the lab</span>
          </p>
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-nsu-blue transition-colors hover:bg-nsu-blue hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {site.email}
          </a>
        </Reveal>
      </section>
    </>
  );
}

/* ------------------------------------------------------ facet select */
function FacetSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "max-w-[180px] appearance-none truncate rounded-full border bg-white py-2 pl-4 pr-9 font-mono text-[11px] font-medium outline-none transition-colors focus:border-nsu-blue/50 focus:ring-2 focus:ring-nsu-sky/20",
          value === "all"
            ? "border-nsu-line text-nsu-slate"
            : "border-nsu-blue/50 bg-nsu-ice text-nsu-blue",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3.5 h-3 w-3 text-nsu-slate"
        fill="none"
        aria-hidden
      >
        <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </label>
  );
}
