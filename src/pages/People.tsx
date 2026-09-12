import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Check,
  Copy,
  GraduationCap,
  Handshake,
  Factory,
  Search,
  X,
} from "lucide-react";
import {
  usePeople,
  usePeopleGrouped,
  useSite,
  type Person,
} from "@/lib/content";
import type { PersonCategory } from "@/types/content";
import EmptyState from "@/components/EmptyState";
import PersonCard, { AlumniRow } from "@/components/people/PersonCard";
import { PersonModalPresence } from "@/components/people/PersonModal";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  interestsOf,
} from "@/components/people/meta";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type Filter = PersonCategory | "all";

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function matchesQuery(person: Person, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    person.name.toLowerCase().includes(q) ||
    person.role.toLowerCase().includes(q) ||
    interestsOf(person).some((i) => i.toLowerCase().includes(q))
  );
}

/* ---------------------------------------------------------- hero (dark) */
function Hero({ counts }: { counts: Record<PersonCategory, number> }) {
  const reduced = useReducedMotion();
  const titleWords = ["The", "minds", "behind", "NIRO."];
  return (
    <section className="relative overflow-hidden bg-hero-gradient" aria-label="People hero">
      <div className="blueprint-grid-dark absolute inset-0 opacity-50" aria-hidden />
      <svg
        viewBox="0 0 300 300"
        className="absolute -right-20 -top-20 h-72 w-72 opacity-25"
        fill="none"
        aria-hidden
      >
        <g transform="rotate(18 150 150)">
          <ellipse cx="150" cy="150" rx="132" ry="74" stroke="var(--nsu-sky)" strokeWidth="1.5" />
        </g>
        <circle cx="272" cy="116" r="5" fill="var(--nsu-gold)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-center gap-3"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className="h-px w-8 origin-left bg-nsu-sky"
          />
          <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-skylight">
            {"// THE PEOPLE"}
          </span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
          {titleWords.map((word, i) => (
            <span key={word}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={cn(
                    "inline-block",
                    word === "minds" && "bg-sky-gradient bg-clip-text text-transparent",
                  )}
                  initial={{ y: reduced ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: PRECISION_EASE }}
                >
                  {word}
                </motion.span>
              </span>
              {i < titleWords.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: PRECISION_EASE }}
          className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-300"
        >
          Faculty, researchers, and students building intelligent machines at
          North South University.
        </motion.p>

        {/* live count chips - auto-derived from the member directory */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {CATEGORY_ORDER.map((cat, i) => (
            <motion.span
              key={cat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.7 + i * 0.06, ease: PRECISION_EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-nsu-sky/30 bg-white/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] text-slate-200"
            >
              <span className="font-semibold tabular-nums text-nsu-skylight">{counts[cat]}</span>
              {CATEGORY_META[cat].hero}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------- sticky filter bar (light) */
function FilterBar({
  filter,
  setFilter,
  counts,
  total,
  query,
  setQuery,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  counts: Record<PersonCategory, number>;
  total: number;
  query: string;
  setQuery: (q: string) => void;
}) {
  const pills: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: total },
    ...CATEGORY_ORDER.map((cat) => ({
      key: cat as Filter,
      label: CATEGORY_META[cat].label,
      count: counts[cat],
    })),
  ];

  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: PRECISION_EASE }}
      className="sticky top-[60px] z-30 border-b border-nsu-line bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-3 px-5 py-3 md:px-8">
        <div role="tablist" aria-label="Filter members by category" className="flex flex-wrap items-center gap-1.5">
          {pills.map((pill) => {
            const active = filter === pill.key;
            return (
              <button
                key={pill.key}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(pill.key)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky",
                  active ? "text-white" : "text-nsu-slate hover:text-nsu-navy",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="people-filter-pill"
                    transition={{ duration: 0.35, ease: PRECISION_EASE }}
                    className="absolute inset-0 rounded-full bg-nsu-navy"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {pill.label}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none",
                      active ? "bg-white/15 text-nsu-sky" : "bg-nsu-ice text-nsu-blue",
                    )}
                  >
                    {pill.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* search - filters name / role / interest, expands on focus */}
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nsu-slate" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or interest…"
            aria-label="Search members by name or research interest"
            className="w-full rounded-full border border-nsu-line bg-white py-2 pl-9 pr-8 text-sm text-nsu-text placeholder:text-nsu-slate/70 transition-[width,border-color,box-shadow] duration-300 focus:border-nsu-blue focus:shadow-nsu-card focus:outline-none sm:w-[180px] sm:focus:w-[260px]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-nsu-slate transition-colors hover:text-nsu-navy"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------- category subsection */
function CategorySection({
  category,
  people,
  startIndex,
  onOpen,
}: {
  category: PersonCategory;
  people: Person[];
  startIndex: number;
  onOpen: (slug: string) => void;
}) {
  if (people.length === 0) return null;
  const isAlumni = category === "alumni";
  return (
    <section aria-label={CATEGORY_META[category].label} className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
          {"// "}
          {CATEGORY_META[category].label}
        </span>
        <span className="rounded-md bg-nsu-ice px-2 py-0.5 font-mono text-[11px] tabular-nums text-nsu-blue">
          {people.length}
        </span>
        <span className="h-px flex-1 bg-nsu-line" aria-hidden />
      </div>
      {isAlumni ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {people.map((person, i) => (
            <AlumniRow key={person.slug} person={person} index={startIndex + i} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {people.map((person, i) => (
            <PersonCard key={person.slug} person={person} index={startIndex + i} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------- join-the-lab CTA */
const CTA_AUDIENCES = [
  {
    icon: GraduationCap,
    title: "For students",
    pitch: "Join a research team, build real robots, and compete nationally.",
  },
  {
    icon: Handshake,
    title: "For collaborators",
    pitch: "Co-author papers and co-supervise projects with our faculty.",
  },
  {
    icon: Factory,
    title: "For industry",
    pitch: "Partner on applied robotics R&D and talent pipelines.",
  },
];

function JoinCta({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32" aria-label="Join the lab">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: PRECISION_EASE }}
        className="grid gap-10 rounded-3xl border border-nsu-line bg-nsu-ice p-8 md:grid-cols-2 md:p-12"
      >
        <div>
          <h3 className="font-mono text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.01em] text-nsu-navy">
            Want to research with us?
          </h3>
          <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-nsu-slate">
            NIRO Lab welcomes motivated students at every level - no prior
            robotics experience required, just curiosity and commitment.{" "}
            <Link to="/contact" className="font-medium text-nsu-blue underline decoration-nsu-blue/30 underline-offset-4 hover:decoration-nsu-blue">
              Get in touch
            </Link>{" "}
            or email us directly:
          </p>
          <div className="relative mt-5 inline-flex">
            <button
              type="button"
              onClick={copy}
              className="group inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 bg-white px-4 py-2 font-mono text-xs text-nsu-blue transition-colors hover:bg-nsu-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nsu-sky"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {email}
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: PRECISION_EASE }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-nsu-navy px-2.5 py-1 font-mono text-[11px] text-white shadow-nsu-card"
                  role="status"
                >
                  Copied ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {CTA_AUDIENCES.map(({ icon: Icon, title, pitch }) => (
            <div key={title} className="rounded-2xl border border-nsu-line bg-white p-5">
              <Icon className="h-5 w-5 text-nsu-blue" />
              <div className="mt-3 font-mono text-sm font-semibold text-nsu-navy">{title}</div>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-nsu-slate">{pitch}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ page */
export default function People() {
  const site = useSite();
  const people = usePeople();
  const groups = usePeopleGrouped();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 200);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORY_ORDER.map((cat) => [cat, groups[cat].length]),
      ) as Record<PersonCategory, number>,
    [groups],
  );

  // current filtered list - also the Prev/Next cycle list for the modal
  const visible = useMemo(() => {
    const searched = people.filter((p) => matchesQuery(p, debouncedQuery.trim()));
    return filter === "all" ? searched : searched.filter((p) => p.category === filter);
  }, [people, debouncedQuery, filter]);

  const searching = debouncedQuery.trim().length > 0;
  const groupedView = filter === "all" && !searching;

  /* ------- deep-linkable modal: /people?m=slug (member= also accepted) */
  const activeSlug = searchParams.get("m") ?? searchParams.get("member");
  const activePerson = activeSlug
    ? people.find((p) => p.slug === activeSlug)
    : undefined;
  const activeIndex = activePerson
    ? visible.findIndex((p) => p.slug === activePerson.slug)
    : -1;

  const openPerson = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete("member");
    next.set("m", slug);
    setSearchParams(next);
  };
  const closePerson = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("m");
    next.delete("member");
    setSearchParams(next);
  };
  const cycle = (dir: 1 | -1) => {
    if (visible.length === 0) return;
    const current = activeIndex >= 0 ? activeIndex : dir === 1 ? -1 : 0;
    const nextSlug = visible[(current + dir + visible.length) % visible.length].slug;
    const next = new URLSearchParams(searchParams);
    next.delete("member");
    next.set("m", nextSlug);
    setSearchParams(next, { replace: true });
  };

  return (
    <LayoutGroup>
      <Hero counts={counts} />

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        total={people.length}
        query={query}
        setQuery={setQuery}
      />

      {/* directory */}
      <div className="relative">
        <div className="blueprint-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          {people.length === 0 ? (
            <EmptyState
              title="No members yet"
              message="Our member directory will appear here as the lab grows."
            />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-nsu-line bg-white/60 px-8 py-16 text-center">
              <p className="font-mono text-xl font-semibold text-nsu-navy">
                No members match your search.
              </p>
              <p className="mt-2 max-w-md text-sm text-nsu-slate">
                Try a different name, role, or research interest.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 px-5 py-2.5 text-sm font-semibold text-nsu-blue transition-colors hover:bg-nsu-ice"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {groupedView ? (
                <div key="grouped">
                  {CATEGORY_ORDER.map((cat) => {
                    const startIndex = CATEGORY_ORDER.slice(0, CATEGORY_ORDER.indexOf(cat))
                      .reduce((sum, c) => sum + groups[c].length, 0);
                    return (
                      <CategorySection
                        key={cat}
                        category={cat}
                        people={groups[cat]}
                        startIndex={startIndex}
                        onOpen={openPerson}
                      />
                    );
                  })}
                </div>
              ) : (
                <div key={`flat-${filter}-${debouncedQuery.trim()}`}>
                  {visible.some((p) => p.category !== "alumni") && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {visible
                        .filter((p) => p.category !== "alumni")
                        .map((person, i) => (
                          <PersonCard key={person.slug} person={person} index={i} onOpen={openPerson} />
                        ))}
                    </div>
                  )}
                  {visible.some((p) => p.category === "alumni") && (
                    <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {visible
                        .filter((p) => p.category === "alumni")
                        .map((person, i) => (
                          <AlumniRow key={person.slug} person={person} index={i} onOpen={openPerson} />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          )}

        </div>
      </div>

      <JoinCta email={site.email} />

      {/* person detail modal (route-aware) */}
      <PersonModalPresence
        open={Boolean(activePerson)}
        person={(activePerson ?? people[0]) as Person}
        index={activeIndex}
        total={visible.length}
        onClose={closePerson}
        onPrev={() => cycle(-1)}
        onNext={() => cycle(1)}
      />
    </LayoutGroup>
  );
}
