import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  useSite,
  useProjects,
  useAchievements,
} from "@/lib/content";
import { RESEARCH_AREAS } from "@/lib/lab-data";
import SectionHeader from "@/components/SectionHeader";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import Chip from "@/components/Chip";
import Crosshairs from "@/components/about/Crosshairs";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------ word-mask H1 (dark) */
function MaskedWords({ text, delay = 0.3 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <h1 className="type-display text-white">
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: reduced ? "0%" : "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: delay + i * 0.06, ease: PRECISION_EASE }}
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
  const reduced = useReducedMotion();
  return (
    <section
      className="relative flex min-h-[60dvh] items-center overflow-hidden bg-hero-gradient"
      aria-label="About the lab"
    >
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden />
      {/* faint orbit rings, bottom-right */}
      <svg
        viewBox="0 0 500 500"
        className="absolute -bottom-32 -right-24 h-[420px] w-[420px] opacity-25"
        fill="none"
        aria-hidden
      >
        <circle cx="250" cy="250" r="220" stroke="var(--nsu-sky)" strokeWidth="1" />
        <circle cx="250" cy="250" r="150" stroke="var(--nsu-sky)" strokeWidth="1" strokeDasharray="4 10" />
        <circle cx="250" cy="250" r="80" stroke="var(--nsu-sky)" strokeWidth="1" />
        <circle cx="250" cy="30" r="6" fill="var(--nsu-gold)" />
      </svg>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 md:px-8">
        {/* eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: PRECISION_EASE }}
            className="h-px w-8 origin-left bg-nsu-sky"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="type-eyebrow text-nsu-skylight"
          >
            {"// ABOUT THE LAB"}
          </motion.span>
        </div>

        <MaskedWords text="Where creativity meets cutting-edge research." />

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: PRECISION_EASE }}
          className="mt-6 max-w-2xl type-body-mono text-slate-200"
        >
          The NSU Intelligent Robotics Lab (NIRO) - an innovation hub at
          North South University.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: PRECISION_EASE }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs tracking-[0.22em] text-slate-300"
        >
          <span>DEPT. OF ECE</span>
          <span className="h-1 w-1 rounded-full bg-nsu-gold" />
          <span>NSU, BASHUNDHARA R/A, DHAKA</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 2 */
function Story() {
  const reduced = useReducedMotion();
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section className="relative bg-nsu-mist py-16 md:py-32" aria-label="Our story">
      <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        {/* image with clip reveal + parallax */}
        <motion.div
          ref={imgRef}
          initial={{
            clipPath: reduced ? "inset(0% 0% 0% 0%)" : "inset(12% 12% 12% 12%)",
            scale: reduced ? 1 : 1.06,
            opacity: 0,
          }}
          whileInView={{
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: PRECISION_EASE }}
          className="relative"
        >
          <Crosshairs />
          <div className="overflow-hidden rounded-2xl border border-nsu-line">
            <motion.div style={reduced ? undefined : { y: parallaxY }}>
              <img
                src="/pictures/about/lab-space.jpg"
                alt="Inside the NIRO Lab workspace at North South University"
                className="aspect-[16/10] w-full scale-[1.12] object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
          <span className="absolute bottom-4 left-4 rounded-md bg-nsu-ink/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-nsu-sky backdrop-blur">
            NIRO Lab · North South University
          </span>
        </motion.div>

        {/* reading column */}
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-blue" />
            <span className="type-eyebrow text-nsu-blue">
              {"// OUR STORY"}
            </span>
          </div>
          <h2 className="type-h2 text-nsu-navy">
            An innovation hub for intelligent machines.
          </h2>
          <p className="mt-6 max-w-[68ch] type-body text-nsu-text">
            Our mission is to make robotics research accessible, impactful,
            and future-focused - transforming theoretical concepts into
            tangible, real-world solutions.
          </p>
          <p className="mt-5 max-w-[68ch] type-body text-nsu-text">
            Supported by expert faculty and passionate students, the lab is
            equipped with advanced facilities for every stage of development.
            Through a structured cycle of conceptualization, simulation,
            design, fabrication, assembly, software integration and testing,
            NIRO Lab delivers innovative real-world solutions while shaping a
            self-sustaining robotics ecosystem.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 4 */
const VISION_BEFORE = "To be the cornerstone of a";
const VISION_PHRASE = "self-sustaining robotics ecosystem";
const VISION_AFTER =
  "in Bangladesh - bridging academic research and industrial application, and positioning NSU as a central hub where “impossible” ideas are rebuilt into intelligent solutions.";
const VISION_WORDS = `${VISION_BEFORE} ${VISION_PHRASE} ${VISION_AFTER}`.split(" ");
const PHRASE_SET = new Set(
  VISION_PHRASE.split(" ").map((w) => w.toLowerCase()),
);

function VisionWord({
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
  const color = useTransform(progress, [start, end], ["#4E6570", "#10222C"]);
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  const inPhrase = PHRASE_SET.has(word.toLowerCase().replace(/[^a-z-]/g, ""));
  return (
    <>
      <motion.span
        style={{ color, opacity }}
        className={cn(
          "inline-block",
          inPhrase &&
            "bg-[linear-gradient(#E8A33D,#E8A33D)] bg-[length:100%_2px] bg-left-bottom bg-no-repeat pb-0.5",
        )}
      >
        {word}
      </motion.span>
      {index < total - 1 ? " " : null}
    </>
  );
}

function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  const statement = (
    <>
      {VISION_BEFORE}{" "}
      <span className="bg-[linear-gradient(#E8A33D,#E8A33D)] bg-[length:100%_2px] bg-left-bottom bg-no-repeat pb-0.5">
        {VISION_PHRASE}
      </span>{" "}
      {VISION_AFTER}
    </>
  );

  return (
    <section className="relative bg-nsu-mist py-16 md:py-32" aria-label="Our vision">
      <div
        className="pointer-events-none absolute inset-y-0 left-5 w-px bg-nsu-line md:left-8"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-5 w-px bg-nsu-line md:right-8"
        aria-hidden
      />
      <Reveal className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-nsu-blue" />
          <span className="type-eyebrow text-nsu-blue">
            {"// OUR VISION"}
          </span>
          <span className="h-px w-8 bg-nsu-blue" />
        </div>
        <div ref={ref}>
          {reduced ? (
            <p className="type-h2 text-nsu-navy">
              {statement}
            </p>
          ) : (
            <p className="type-h2">
              {VISION_WORDS.map((w, i) => (
                <VisionWord
                  key={i}
                  word={w}
                  index={i}
                  total={VISION_WORDS.length}
                  progress={scrollYProgress}
                />
              ))}
            </p>
          )}
        </div>
        {/* node-and-wire flourish */}
        <svg
          viewBox="0 0 240 48"
          className="mx-auto mt-12 h-12 w-60"
          fill="none"
          aria-hidden
        >
          <motion.path
            d="M8 40 L64 16 L120 34 L176 10 L232 38"
            stroke="var(--nsu-blue)"
            strokeWidth="1"
            initial={{ pathLength: reduced ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: PRECISION_EASE }}
          />
          {[
            [8, 40],
            [64, 16],
            [120, 34],
            [176, 10],
            [232, 38],
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill={i === 2 ? "var(--nsu-gold)" : "var(--nsu-sky)"}
              initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.22, duration: 0.4 }}
            />
          ))}
        </svg>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------ section 5 */
const PILLARS = [
  {
    title: "Research Excellence",
    body: "Conduct cutting-edge research in robotics and artificial intelligence that addresses real-world challenges.",
  },
  {
    title: "Education & Training",
    body: "Provide exceptional research training and mentorship to students at all levels.",
  },
  {
    title: "Collaboration",
    body: "Foster partnerships with industry, government, and academic institutions - locally and internationally.",
  },
  {
    title: "Innovation",
    body: "Translate research outcomes into practical applications that benefit society.",
  },
  {
    title: "Community Building",
    body: "Create an inclusive, collaborative research environment that inspires creativity and excellence.",
  },
];

function MissionPillars() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-nsu-ice py-16 md:py-32" aria-label="Mission pillars">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="OUR MISSION"
          title="Five pillars, one direction"
        />
        <RevealGroup
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6"
          stagger={0.08}
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.97 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.8, ease: PRECISION_EASE },
                },
              }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-nsu-line bg-white p-7 transition-transform duration-300 hover:-translate-y-1.5",
                i < 3 ? "lg:col-span-2" : "lg:col-span-3",
              )}
            >
              {/* top-border draw on hover */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 bg-nsu-blue transition-transform ease-precision [transition-duration:350ms] group-hover:scale-x-100"
              />
              <span className="font-mono text-xs font-semibold tracking-[0.22em] text-nsu-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-mono text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.01em] text-nsu-navy">
                {pillar.title}
              </h3>
              <p className="mt-3 type-body-mono text-nsu-slate">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 6 */
const AREA_DETAILS: string[] = [
  "Learning-based perception, planning, and control for physical machines. We develop robots that improve with data - from vision pipelines to learned control policies deployed on real hardware.",
  "Swarm coordination and distributed autonomy across robot teams. Our work spans formation control, task allocation, and communication-aware planning for fleets that must act as one.",
  "On-device inference for robots and satellites with tight power budgets. We optimize neural models and pipelines so intelligence runs where the sensors are - not in a distant data center.",
  "Robots that sense their environment and act without supervision. Research covers situational awareness, semantic mapping, and safe decision-making in dynamic, human-shared spaces.",
  "Platforms for the air - from fixed-wing survey drones to multirotor UAVs. We build guidance, navigation, and control systems for machines operating far from easy communication.",
  "Policies that adjust to changing goals, teammates, and terrain. Our robots replan on the fly, blending classical control with learning to stay robust when conditions shift.",
  "Knowing what the robot doesn't know - principled confidence in action. We study probabilistic inference and calibration so autonomous systems can fail gracefully and ask for help.",
  "Connected infrastructure linking robots, sensors, and trusted data. Research integrates IoT telemetry, edge-cloud orchestration, and blockchain-backed integrity into robotic systems.",
];

function ResearchAreas() {
  const { all: projects } = useProjects();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="areas"
      className="scroll-mt-20 bg-nsu-navy py-16 md:py-32"
      aria-label="Research areas"
    >
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHeader
          dark
          eyebrow="RESEARCH AREAS"
          title="Eight fronts of intelligent robotics"
        />
        <RevealGroup className="border-t border-nsu-line-dark" stagger={0.05}>
          {RESEARCH_AREAS.map((area, i) => {
            const isOpen = open === i;
            const related = projects.filter((p) => p.areas.includes(area.name));
            return (
              <RevealItem key={area.index} y={24}>
                <div className="border-b border-nsu-line-dark">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs tracking-[0.22em] text-nsu-skylight">
                      {String(area.index).padStart(2, "0")}
                    </span>
                    <motion.img
                      src={area.icon}
                      alt=""
                      animate={{ rotate: isOpen ? 0 : 90 }}
                      transition={{ duration: 0.35, ease: PRECISION_EASE }}
                      className="h-8 w-8 shrink-0"
                    />
                    <span className="flex-1 type-h3 text-white transition-colors group-hover:text-nsu-sky">
                      {area.name}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-nsu-sky transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: PRECISION_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-12 pr-2 sm:pl-[4.5rem]">
                          <p className="max-w-2xl text-sm leading-[1.7] text-slate-300">
                            {AREA_DETAILS[i]}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {related.length > 0 ? (
                              related.map((p) => (
                                <Link key={p.slug} to={`/projects/${p.slug}`}>
                                  <Chip dark className="transition-colors hover:bg-nsu-sky/25">
                                    {p.title}
                                  </Chip>
                                </Link>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400">
                                Projects coming soon -{" "}
                                <Link
                                  to="/contact"
                                  className="text-nsu-sky underline-offset-4 hover:underline"
                                >
                                  get in touch to learn more
                                </Link>
                                .
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 8 */
function Milestones() {
  const site = useSite();
  const achievements = useAchievements();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // "October 2024" → "Oct 2024"
  const estDate = (() => {
    const m = site.established?.match(/([A-Za-z]+)\s+(\d{4})/);
    return m ? `${m[1].slice(0, 3)} ${m[2]}` : (site.established ?? "Oct 2024");
  })();

  const entries = [
    { date: estDate, label: "Lab established", gold: false },
    ...[...achievements]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((a) => ({
        date: a.date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        label: `${a.rank} · ${a.event ?? a.title}`,
        gold: true,
      })),
  ];

  return (
    <section
      className="border-t border-nsu-line bg-nsu-mist pb-16 md:pb-32"
      aria-label="Milestones"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="MILESTONES"
          title="A young lab, moving fast"
          className="mb-14 pt-24 md:pt-32"
        />
        <Reveal>
          {/* desktop: horizontal hairline timeline */}
          <div
            ref={ref}
            className={cn("relative hidden", !reduced && "md:block")}
          >
            <div className="absolute left-0 right-0 top-[5px] h-px bg-nsu-line" />
            <motion.div
              style={{ scaleX: fillScale }}
              className="absolute left-0 right-0 top-[5px] h-px origin-left bg-nsu-sky"
            />
            <div
              className="relative grid"
              style={{
                gridTemplateColumns: `repeat(${entries.length}, minmax(0,1fr))`,
              }}
            >
              {entries.map((entry) => (
                <div key={entry.date + entry.label} className="pr-6">
                  <span
                    className={cn(
                      "block h-[11px] w-[11px] rounded-full border-2 bg-nsu-mist",
                      entry.gold ? "border-nsu-gold" : "border-nsu-sky",
                    )}
                  />
                  <div className="mt-4 font-mono text-xs tracking-[0.18em] text-nsu-slate">
                    {entry.date.toUpperCase()}
                  </div>
                  <div className="mt-1.5 text-sm font-medium leading-snug text-nsu-navy">
                    {entry.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* mobile / reduced-motion: vertical timeline */}
          <div className={cn("relative pl-6", reduced ? "" : "md:hidden")}>
            <span
              aria-hidden
              className="absolute bottom-1 left-[5px] top-1 w-px bg-nsu-line"
            />
            <div className="space-y-8">
              {entries.map((entry) => (
                <div key={entry.date + entry.label} className="relative">
                  <span
                    className={cn(
                      "absolute -left-6 top-1 block h-[11px] w-[11px] rounded-full border-2 bg-nsu-mist",
                      entry.gold ? "border-nsu-gold" : "border-nsu-sky",
                    )}
                  />
                  <div className="font-mono text-xs tracking-[0.18em] text-nsu-slate">
                    {entry.date.toUpperCase()}
                  </div>
                  <div className="mt-1 text-sm font-medium leading-snug text-nsu-navy">
                    {entry.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */
export default function About() {
  // honor in-page anchors (e.g. /about#areas) after mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }, 150);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Hero />
      <Story />
      <Vision />
      <MissionPillars />
      <ResearchAreas />
      <Milestones />
    </>
  );
}
