import { lazy, Suspense, useRef, useState, memo } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  useSite,
  useNews,
  useAchievements,
  usePeopleGrouped,
  type NewsPost,
  type Person,
} from "@/lib/content";
import { INNOVATION_CYCLE, RESEARCH_AREAS } from "@/lib/lab-data";
import SectionHeader from "@/components/SectionHeader";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import Stat from "@/components/Stat";
import Chip from "@/components/Chip";
import ContentImage, { PersonImage } from "@/components/ContentImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const HeroCanvas = lazy(() => import("@/components/HeroCanvas"));

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------ identity lockup (approved design) */
function HeroLockup({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: PRECISION_EASE }}
      className={cn("flex items-stretch gap-4 sm:gap-5", className)}
    >
      {/* aspect-[276/73] matches the SVG viewBox so the mark can never be
          squeezed/cropped; fixed height, auto width, nothing clips it */}
      <img
        src="/assets/brand/niro-mark-white.svg"
        alt="NIRO"
        className="aspect-[276/73] h-10 w-auto self-center overflow-visible sm:h-16"
      />
      <span aria-hidden className="w-px self-stretch bg-white/45" />
      <span className="font-mono text-[11px] font-medium uppercase leading-[1.7] tracking-[0.3em] text-slate-300 sm:text-xs">
        <span className="block text-nsu-skylight">NSU</span>
        <span className="block">Intelligent</span>
        <span className="block">Robotics</span>
        <span className="block">Lab</span>
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------ ambient orbit motif */
const OrbitMotif = memo(function OrbitMotif() {
  return (
    <div className="relative hidden h-[480px] w-[480px] lg:block">
      <div className="absolute inset-0 animate-[spin_24s_linear_infinite]" aria-hidden>
        <svg viewBox="0 0 480 480" className="h-full w-full" fill="none">
          <g transform="rotate(18 240 240)">
            <ellipse cx="240" cy="240" rx="220" ry="122" stroke="var(--nsu-sky)" strokeOpacity="0.6" strokeWidth="1.5" />
          </g>
          <circle cx="452" cy="184" r="7" fill="var(--nsu-gold)" />
        </svg>
      </div>
      {/* pulse ring every 3s */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span className="absolute h-56 w-56 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-nsu-sky/40" />
        <span className="absolute h-56 w-56 rounded-full border border-nsu-sky/25" />
      </div>
      {/* the hero lockup lives here on desktop (right side of the hero) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HeroLockup />
      </div>
    </div>
  );
});

/* -------------------------------------------------- word-mask heading */
function MaskedWords({
  words,
  gradientFrom,
  gradientTo,
}: {
  words: string[];
  gradientFrom: number;
  gradientTo: number;
}) {
  const reduced = useReducedMotion();
  return (
    <h1 className="type-display text-white">
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={cn(
                "inline-block",
                i >= gradientFrom &&
                  i <= gradientTo &&
                  "bg-sky-gradient bg-clip-text text-transparent",
              )}
              initial={{ y: reduced ? "0%" : "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.9,
                delay: 0.5 + i * 0.06,
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
  );
}

/* ------------------------------------------------------------ section 1 */
function Hero() {
  const site = useSite();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.9], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);

  // "robotics research" (words 1-2) get the sky gradient
  const words = site.tagline.split(" ");
  const gradientFrom = words.findIndex((w) => w.toLowerCase().startsWith("robotics"));
  const gradientTo = gradientFrom >= 0 ? gradientFrom + 1 : -1;

  return (
    <section
      ref={ref}
      data-cursor-dot
      className="relative flex min-h-[calc(100dvh-72px)] md:min-h-[680px] items-center overflow-hidden bg-hero-gradient"
      aria-label="Hero"
    >
      {/* particle canvas / static fallback */}
      {reduced ? (
        <img
          src="/assets/placeholders/hero-constellation-fallback.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Suspense fallback={null}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <HeroCanvas className="absolute inset-0" />
          </motion.div>
        </Suspense>
      )}
      <div className="blueprint-grid-dark absolute inset-0 opacity-[0.4]" aria-hidden />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-12 px-5 py-16 md:px-8"
      >
        <div className="max-w-4xl">
          {/* the lockup stacks above the tagline on mobile; on desktop it
              sits in the right-side orbit motif (one instance per breakpoint) */}
          <HeroLockup className="mb-8 lg:hidden" />

          <MaskedWords words={words} gradientFrom={gradientFrom} gradientTo={gradientTo} />

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15, ease: PRECISION_EASE }}
            className="mt-6 max-w-2xl type-body-mono text-slate-200"
          >
            An innovation hub at {site.university}, Dhaka - turning ideas
            into intelligent machines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: PRECISION_EASE }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nsu-navy to-nsu-blue px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-white ring-1 ring-nsu-sky/40 transition-transform active:scale-[0.97]"
            >
              Explore Our Research
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/people"
              className="inline-flex items-center gap-2 rounded-full border border-nsu-sky/50 px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-nsu-sky transition-colors hover:bg-nsu-sky/10 hover:text-white active:scale-[0.97]"
            >
              Meet the Team
            </Link>
          </motion.div>

          {/* mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.5 }}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-[0.22em] text-slate-300"
          >
            <span>
              ESTABLISHED ON {(site.established ?? "October 2024").toUpperCase()}
            </span>
          </motion.div>
        </div>

        <OrbitMotif />
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-mono text-[11px] tracking-[0.22em] text-slate-400">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-nsu-line-dark">
          <motion.span
            animate={reduced ? {} : { y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
            className="absolute left-0 top-0 h-3 w-px bg-nsu-sky"
          />
        </span>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------ section 2 */
const MISSION =
  "We make robotics research accessible, impactful, and future-focused - transforming theoretical concepts into tangible, real-world solutions.";

function MissionWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = index / total;
  const end = start + 1 / total;
  const color = useTransform(progress, [start, end], ["#4E6570", "#0E7C8C"]);
  const opacity = useTransform(progress, [start, end], [0.35, 1]);
  return (
    <>
      <motion.span style={{ color, opacity }} className="inline-block">
        {word}
      </motion.span>
      {index < total - 1 ? " " : null}
    </>
  );
}

function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const words = MISSION.split(" ");
  return (
    <section className="relative bg-nsu-mist py-16 md:py-32" aria-label="Mission">
      <div className="pointer-events-none absolute inset-y-0 left-5 w-px bg-nsu-line md:left-8" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-5 w-px bg-nsu-line md:right-8" aria-hidden />
      <Reveal className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-nsu-blue" />
          <span className="type-eyebrow text-nsu-blue">
            {"// OUR MISSION"}
          </span>
          <span className="h-px w-8 bg-nsu-blue" />
        </div>
        <div ref={ref}>
          {reduced ? (
            <p className="type-h2 text-nsu-navy">
              {MISSION}
            </p>
          ) : (
            <p className="type-h2">
              {words.map((w, i) => (
                <MissionWord
                  key={i}
                  word={w}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------ section 3 */
function StatsBand() {
  const site = useSite();
  return (
    <section className="bg-nsu-navy py-14" aria-label="Lab statistics">
      <RevealGroup className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-5 md:px-8 lg:grid-cols-4 lg:divide-x lg:divide-nsu-line-dark">
        {site.stats.map((stat, i) => (
          <RevealItem key={stat.label} className={cn("lg:px-10", i === 0 && "lg:pl-0")}>
            <Stat
              value={stat.value}
              label={stat.label}
              goldUnderline={i === site.stats.length - 1}
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

/* ------------------------------------------------------------ section 5 */
function CycleTeaser() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="relative bg-nsu-mist py-16 md:py-32" aria-label="Innovation cycle">
      <div className="blueprint-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-nsu-blue" />
              <span className="type-eyebrow text-nsu-blue">
                {"// HOW WE BUILD"}
              </span>
            </div>
            <h2 className="type-h2 text-nsu-navy">
              The Robotics Innovation Cycle
            </h2>
            <p className="mt-4 max-w-lg type-body-mono text-nsu-slate">
              Every project at NIRO Lab travels the same disciplined loop -
              from simulation to physical testing, and back again smarter.
            </p>
          </Reveal>
          <RevealGroup className="mt-8" stagger={0.06}>
            <ol className="space-y-2.5">
              {INNOVATION_CYCLE.map((stage) => (
                <RevealItem key={stage.index} y={16}>
                  <li
                    onMouseEnter={() => setActive(stage.index)}
                    onMouseLeave={() => setActive(null)}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border px-4 py-3 font-mono text-sm transition-colors",
                      active === stage.index
                        ? "border-nsu-blue bg-nsu-ice text-nsu-navy"
                        : "border-nsu-line bg-white/70 text-nsu-slate",
                    )}
                  >
                    <span className="text-xs text-nsu-sky">
                      {String(stage.index).padStart(2, "0")}
                    </span>
                    {stage.name}
                  </li>
                </RevealItem>
              ))}
            </ol>
          </RevealGroup>
        </div>

        {/* circular cycle diagram */}
        <Reveal className="flex justify-center">
          <div className="relative h-[320px] w-[320px] sm:h-[420px] sm:w-[420px]">
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
              <circle cx="200" cy="200" r="150" fill="none" stroke="var(--nsu-line)" strokeWidth="1.5" />
              <circle
                cx="200" cy="200" r="150" fill="none"
                stroke="var(--nsu-sky)" strokeWidth="1.5" strokeDasharray="4 10"
                className="origin-center animate-[spin_30s_linear_infinite]"
              />
            </svg>
            {INNOVATION_CYCLE.map((stage, i) => {
              const rad = ((i * 60 - 90) * Math.PI) / 180;
              const x = 50 + 37.5 * Math.cos(rad);
              const y = 50 + 37.5 * Math.sin(rad);
              const isActive = active === stage.index;
              return (
                <button
                  key={stage.index}
                  onMouseEnter={() => setActive(stage.index)}
                  onMouseLeave={() => setActive(null)}
                  aria-label={stage.name}
                  className={cn(
                    "absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-white shadow-sm transition-all duration-300",
                    isActive
                      ? "scale-110 border-nsu-blue bg-nsu-ice"
                      : "border-nsu-line hover:border-nsu-blue",
                  )}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {isActive && (
                    <span className="absolute inset-0 animate-ping rounded-2xl border border-nsu-sky/50" />
                  )}
                  <img src={stage.icon} alt="" className="h-7 w-7" />
                </button>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <img src="/assets/brand/niro-mark-black.svg" alt="" className="mx-auto h-12 w-auto" />
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-nsu-slate">
                Innovation Cycle
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 6 */
function ResearchAreas() {
  return (
    <section className="bg-nsu-ice py-16 md:py-32" aria-label="Research areas">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="WHAT WE STUDY"
          title="Machines that sense, decide, and act"
          linkTo="/about#areas"
          linkLabel="All areas"
        />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {RESEARCH_AREAS.map((area) => (
            <RevealItem key={area.index} y={24}>
              <Link
                to="/about#areas"
                className="group flex h-full flex-col rounded-2xl border border-nsu-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-nsu-blue hover:shadow-nsu-card"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-nsu-ice transition-colors duration-300 group-hover:bg-nsu-blue [&_img]:transition group-hover:[&_img]:invert group-hover:[&_img]:brightness-200">
                  <img src={area.icon} alt="" className="h-7 w-7" />
                </span>
                <h3 className="type-h3 text-nsu-navy">
                  {area.name}
                </h3>
                <p className="mt-2 type-body-mono text-nsu-slate">{area.gloss}</p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 7 */
function HonorsStrip() {
  const achievements = useAchievements();
  const site = useSite();
  if (!site.toggles.showAchievementsSection || achievements.length === 0) {
    return null;
  }
  return (
    <section className="border-t-2 border-nsu-gold/70 bg-nsu-navy py-16" aria-label="Honors">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-px w-8 bg-nsu-gold" />
          <span className="type-eyebrow text-nsu-gold">
            {"// HONORS"}
          </span>
        </div>
        <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.12}>
          {achievements.map((a) => (
            <RevealItem key={a.slug} y={0}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: PRECISION_EASE } },
                }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-ink/60 p-6"
              >
                {/* one-time shine sweep */}
                <motion.span
                  initial={{ x: "-120%" }}
                  whileInView={{ x: "220%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.4, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-nsu-gold/15 to-transparent"
                  aria-hidden
                />
                <img
                  src="/assets/placeholders/achievement.svg"
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-xl border border-nsu-gold/30 object-cover"
                />
                <div className="min-w-0">
                  <span className="bg-gold-flare bg-clip-text font-mono text-lg font-bold text-transparent">
                    {a.rank}
                  </span>
                  <h3 className="mt-1 truncate font-mono text-base font-semibold text-white">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs text-slate-400">
                    {a.event}
                    {a.projectEntry && (
                      <>
                        {" · "}
                        <Link
                          to={`/projects/${a.projectEntry.slug}`}
                          className="text-nsu-sky underline-offset-4 hover:underline"
                        >
                          {a.projectEntry.title}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 8 */
function LeaderCard({ person }: { person: Person }) {
  return (
    <Link
      to="/people"
      className="group flex-1 rounded-2xl border border-nsu-line bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-nsu-card"
    >
      <PersonImage
        src={person.imageSrc}
        name={person.name}
        className="mx-auto mt-2 h-32 w-32 rounded-full saturate-[0.85] transition duration-500 group-hover:saturate-100"
        initialsClassName="text-3xl"
      />
      <h3 className="mt-4 font-mono text-lg font-semibold text-nsu-navy">
        {person.name}
      </h3>
      <p className="mt-0.5 text-sm font-medium text-nsu-blue">{person.role}</p>
      {person.research_interests && (
        <p className="mt-2 line-clamp-1 text-sm text-nsu-slate">
          {person.research_interests}
        </p>
      )}
    </Link>
  );
}

function NewsRow({ post }: { post: NewsPost }) {
  return (
    <Link to={`/news/${post.slug}`} className="group flex items-center gap-5 rounded-xl border border-transparent p-3 transition-colors hover:border-nsu-line hover:bg-white">
      <div className="h-20 w-[120px] shrink-0 overflow-hidden rounded-lg">
        <ContentImage
          src={post.imageSrc}
          type="news"
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 font-mono text-[11px] text-nsu-slate">
          {post.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {post.pinned && <Chip variant="gold">PINNED</Chip>}
          {post.tags[0] && !post.pinned && <Chip>{post.tags[0]}</Chip>}
        </div>
        <h4 className="mt-1.5 line-clamp-2 font-mono text-[0.9375rem] font-semibold leading-snug text-nsu-navy">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {post.title}
          </span>
        </h4>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-nsu-slate transition-all duration-300 group-hover:translate-x-1 group-hover:text-nsu-blue" />
    </Link>
  );
}

function LeadershipAndNews() {
  const groups = usePeopleGrouped();
  const news = useNews().slice(0, 3);
  const leaders = groups.founding_faculty.slice(0, 2);
  return (
    <section className="bg-nsu-mist py-16 md:py-32" aria-label="Leadership and news">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-blue" />
            <span className="type-eyebrow text-nsu-blue">
              {"// LEADERSHIP"}
            </span>
          </div>
          <h2 className="mb-8 font-display text-3xl font-bold tracking-[-0.02em] text-nsu-navy">
            Guided by faculty, driven by students
          </h2>
          <div className="flex flex-col gap-5 sm:flex-row">
            {leaders.map((p) => (
              <LeaderCard key={p.slug} person={p} />
            ))}
          </div>
          <Link
            to="/people"
            className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-blue hover:text-nsu-navy"
          >
            Full team
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.15}>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-blue" />
            <span className="type-eyebrow text-nsu-blue">
              {"// LATEST"}
            </span>
          </div>
          <h2 className="mb-8 font-display text-3xl font-bold tracking-[-0.02em] text-nsu-navy">
            News & updates
          </h2>
          <RevealGroup className="space-y-2" stagger={0.1}>
            {news.map((post) => (
              <RevealItem key={post.slug} y={20}>
                <NewsRow post={post} />
              </RevealItem>
            ))}
          </RevealGroup>
          <Link
            to="/news"
            className="group mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-blue hover:text-nsu-navy"
          >
            All news
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */
export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <StatsBand />
      <CycleTeaser />
      <ResearchAreas />
      <HonorsStrip />
      <LeadershipAndNews />
    </>
  );
}
