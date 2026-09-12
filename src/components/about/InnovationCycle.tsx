import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RotateCcw } from "lucide-react";
import { INNOVATION_CYCLE } from "@/lib/lab-data";
import Chip from "@/components/Chip";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The Robotics Innovation Cycle (about.md §3) — the site's centerpiece
 * scroll story. GSAP owns this component (isolated here, per react-dev.md
 * library-isolation rules).
 *
 * Desktop (md+, motion allowed): the section pins for ~600vh while a scrub
 * timeline drives stage panels, a dashed 6-node ring, segment arcs that
 * draw solid sky, and a gold progress dot travelling the loop. On the final
 * stage the ring flashes, the ITERATE label pulses, and the ring docks at
 * 70% scale before unpinning.
 * Mobile / reduced motion: no pin — a sticky mini-ring header plus a
 * vertical list of the six stages with default reveals.
 */

/* ------------------------------------------------------- stage content */
const STAGE_DETAILS: {
  description: string;
  /** flow-position chip: what comes after this stage */
  next: string;
}[] = [
  {
    description:
      "Rigorous computational modeling validates every concept before physical implementation. Risks are minimized and designs optimized long before hardware is touched.",
    next: "Design",
  },
  {
    description:
      "Detailed mechanical and electronic designs ensure every component is optimized. Performance and manufacturability are engineered together from the first sketch.",
    next: "Fabrication",
  },
  {
    description:
      "In-house fabrication brings designs to life with 3D printing, CNC machining, and other manufacturing techniques. Prototypes move from screen to workbench in days.",
    next: "Assembling",
  },
  {
    description:
      "Components are carefully integrated with attention to mechanical tolerances. System architecture is respected at every joint, wire, and connector.",
    next: "Software Development",
  },
  {
    description:
      "Robust control algorithms, perception systems, and AI-driven decision-making software give the machine its intelligence. Code is validated in simulation before deployment.",
    next: "Physical Testing",
  },
  {
    description:
      "Real-world testing validates performance under true conditions. Every insight feeds straight back into the cycle — the loop begins again, smarter.",
    next: "Modelling & Simulation",
  },
];

/* ------------------------------------------------------------ geometry */
const SIZE = 520;
const C = SIZE / 2;
const R = 190;
/** node ring radius as % of the square container */
const NODE_R_PCT = (R / SIZE) * 100;

function polar(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: C + R * Math.cos(rad), y: C + R * Math.sin(rad) };
}

function segmentArc(j: number) {
  const a0 = -90 + j * 60 + 5;
  const a1 = -90 + (j + 1) * 60 - 5;
  const p0 = polar(a0);
  const p1 = polar(a1);
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

function nodePosition(i: number) {
  const rad = ((-90 + i * 60) * Math.PI) / 180;
  return {
    left: `${50 + NODE_R_PCT * Math.cos(rad)}%`,
    top: `${50 + NODE_R_PCT * Math.sin(rad)}%`,
  };
}

const NODE_BASE =
  "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-nsu-navy/80 transition-[border-color,background-color] duration-300 border-nsu-line-dark lg:h-14 lg:w-14";
const NODE_DONE =
  "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-nsu-navy/80 transition-[border-color,background-color] duration-300 border-nsu-sky/50 lg:h-14 lg:w-14";
const NODE_ACTIVE =
  "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-nsu-navy/80 transition-[border-color,background-color] duration-300 border-nsu-sky bg-nsu-sky/15 shadow-[0_0_28px_rgba(61,143,224,0.35)] lg:h-14 lg:w-14";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ---------------------------------------------------- pinned (desktop) */
function CyclePinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const flashRef = useRef<SVGCircleElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pulseRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const panels = panelRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      const arcs = arcRefs.current.filter(
        (el): el is SVGPathElement => el !== null,
      );
      const nodes = nodeRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      const pulses = pulseRefs.current.filter(
        (el): el is HTMLSpanElement => el !== null,
      );

      // initial states
      panels.forEach((p, i) => gsap.set(p, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 }));
      arcs.forEach((a) => gsap.set(a, { strokeDashoffset: 100 }));
      let activeIdx = 0;
      nodes.forEach((n, i) => {
        n.className = i === 0 ? NODE_ACTIVE : NODE_BASE;
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const idx = Math.min(5, Math.floor(self.progress * 6));
            if (idx !== activeIdx) {
              activeIdx = idx;
              nodes.forEach((n, j) => {
                n.className =
                  j === idx ? NODE_ACTIVE : j < idx ? NODE_DONE : NODE_BASE;
              });
              // active node pulses once
              const ring = pulses[idx];
              if (ring) {
                gsap.fromTo(
                  ring,
                  { opacity: 0.8, scale: 1 },
                  { opacity: 0, scale: 1.6, duration: 0.6, ease: "power2.out", overwrite: "auto" },
                );
              }
            }
          },
        },
      });

      // gold progress dot travels the full loop across the six stages
      tl.to(
        dotRef.current,
        { rotation: 360, svgOrigin: `${C} ${C}`, duration: 6, ease: "none" },
        0,
      );

      // completed segments draw solid sky while their stage is active
      arcs.forEach((arc, j) => {
        tl.to(arc, { strokeDashoffset: 0, duration: 0.85, ease: "none" }, j + 0.08);
      });

      // stage panel transitions: outgoing y -40 fade, incoming y 40 → 0,
      // ghost numerals cross-fade with a 0.1 overlap
      for (let j = 1; j < 6; j++) {
        tl.to(
          panels[j - 1],
          { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" },
          j - 0.32,
        );
        tl.to(
          panels[j],
          { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" },
          j - 0.22,
        );
      }

      // finale: ring-complete flash, ITERATE label pulse, ring docks at 70%
      tl.fromTo(
        flashRef.current,
        { opacity: 0.9, scale: 0.96, svgOrigin: `${C} ${C}` },
        { opacity: 0, scale: 1.05, svgOrigin: `${C} ${C}`, duration: 0.4, ease: "power1.out" },
        5.55,
      );
      tl.to(labelRef.current, { scale: 1.15, duration: 0.15, ease: "power2.out" }, 5.6);
      tl.to(labelRef.current, { scale: 1, duration: 0.15, ease: "power2.in" }, 5.78);
      tl.to(ringRef.current, { scale: 0.7, duration: 0.4, ease: "power2.inOut" }, 5.6);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="innovation-cycle"
      className="relative overflow-hidden bg-nsu-ink"
      aria-label="The Robotics Innovation Cycle"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-5 py-20 md:px-8">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-sky" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky">
              {"// THE ROBOTICS INNOVATION CYCLE"}
            </span>
          </div>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400 md:block">
            Six stages · one loop · scroll to travel it
          </span>
        </div>

        <div className="mt-8 grid items-center gap-12 md:mt-12 md:grid-cols-5">
          {/* left 40% — current stage panel */}
          <div className="relative min-h-[300px] md:col-span-2 md:min-h-[340px]">
            {INNOVATION_CYCLE.map((stage, i) => (
              <div
                key={stage.index}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-3 top-1/2 -translate-y-1/2 select-none font-display text-[10rem] font-extrabold leading-none text-white/[0.06]"
                >
                  {stage.index}
                </span>
                <div className="relative">
                  <span className="font-mono text-xs font-medium tracking-[0.22em] text-nsu-sky">
                    STAGE {String(stage.index).padStart(2, "0")} / 06
                  </span>
                  <h3 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-white">
                    {stage.name}
                  </h3>
                  <p className="mt-4 max-w-md text-[1.0625rem] leading-[1.7] text-slate-300">
                    {STAGE_DETAILS[i].description}
                  </p>
                  <Chip dark className="mt-6 self-start">
                    {i < 5
                      ? `UP NEXT → ${STAGE_DETAILS[i].next.toUpperCase()}`
                      : `↺ LOOPS BACK → ${STAGE_DETAILS[i].next.toUpperCase()}`}
                  </Chip>
                </div>
              </div>
            ))}
          </div>

          {/* right 60% — circular cycle diagram */}
          <div className="flex justify-center md:col-span-3">
            <div
              ref={ringRef}
              className="relative h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px] xl:h-[520px] xl:w-[520px]"
            >
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                {/* base dashed ring */}
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  stroke="#1E3A66"
                  strokeWidth="1.5"
                  strokeDasharray="3 9"
                />
                {/* completed segments draw solid sky */}
                {INNOVATION_CYCLE.map((stage, j) => (
                  <path
                    key={stage.index}
                    ref={(el) => {
                      arcRefs.current[j] = el;
                    }}
                    d={segmentArc(j)}
                    stroke="#3D8FE0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={100}
                    strokeDashoffset={100}
                  />
                ))}
                {/* ring-complete flash */}
                <circle
                  ref={flashRef}
                  cx={C}
                  cy={C}
                  r={R}
                  stroke="#3D8FE0"
                  strokeWidth="3"
                  opacity="0"
                />
                {/* gold progress dot */}
                <g ref={dotRef}>
                  <circle cx={C} cy={C - R} r="13" fill="#F2A900" opacity="0.18" />
                  <circle cx={C} cy={C - R} r="6.5" fill="#F2A900" />
                </g>
              </svg>

              {/* stage nodes */}
              {INNOVATION_CYCLE.map((stage, i) => (
                <div
                  key={stage.index}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className={NODE_BASE}
                  style={nodePosition(i)}
                  aria-label={stage.name}
                >
                  <span
                    ref={(el) => {
                      pulseRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-nsu-sky opacity-0"
                  />
                  <img src={stage.icon} alt="" className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>
              ))}

              {/* center label */}
              <div
                ref={labelRef}
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
              >
                <RotateCcw className="h-6 w-6 text-nsu-sky" aria-hidden />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-slate-300">
                  Iterate
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* scroll progress hairline */}
        <div
          className="absolute inset-x-5 bottom-8 h-px bg-nsu-line-dark md:inset-x-8"
          aria-hidden
        >
          <div
            ref={progressRef}
            className="h-full w-full origin-left scale-x-0 bg-nsu-sky"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------ static (mobile / reduced motion) */
function CycleStatic() {
  return (
    <section
      id="innovation-cycle"
      className="relative bg-nsu-ink py-24 md:py-32"
      aria-label="The Robotics Innovation Cycle"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />

      {/* sticky mini-ring header */}
      <div className="sticky top-[60px] z-20 border-b border-nsu-line-dark bg-nsu-ink/90 backdrop-blur-sm">
        <div className="relative mx-auto flex max-w-md items-center justify-between px-5 py-3">
          <span
            aria-hidden
            className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-nsu-line-dark"
          />
          {INNOVATION_CYCLE.map((stage) => (
            <span
              key={stage.index}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-nsu-line-dark bg-nsu-navy/80"
              title={stage.name}
            >
              <img src={stage.icon} alt="" className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-nsu-sky" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky">
              {"// THE ROBOTICS INNOVATION CYCLE"}
            </span>
          </div>
          <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Six stages. One loop.
          </h2>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-[1.7] text-slate-300">
            Every project at NIRO Lab travels the same disciplined cycle —
            from simulation to physical testing, and back again smarter.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 space-y-5" stagger={0.08}>
          {INNOVATION_CYCLE.map((stage, i) => (
            <RevealItem key={stage.index} y={32}>
              <article className="relative overflow-hidden rounded-2xl border border-nsu-line-dark bg-nsu-navy/40 p-6 sm:p-7">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-8xl font-extrabold leading-none text-white/[0.05]"
                >
                  {stage.index}
                </span>
                <div className="relative flex items-start gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-nsu-sky/50 bg-nsu-sky/10">
                    <img src={stage.icon} alt="" className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] font-medium tracking-[0.22em] text-nsu-sky">
                      STAGE {String(stage.index).padStart(2, "0")} / 06
                    </span>
                    <h3 className="mt-1.5 font-display text-xl font-semibold text-white">
                      {stage.name}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.7] text-slate-300">
                      {STAGE_DETAILS[i].description}
                    </p>
                    <Chip dark className="mt-4">
                      {i < 5
                        ? `UP NEXT → ${STAGE_DETAILS[i].next.toUpperCase()}`
                        : `↺ LOOPS BACK → ${STAGE_DETAILS[i].next.toUpperCase()}`}
                    </Chip>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- root */
export default function InnovationCycle() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (reduced || !isDesktop) return <CycleStatic />;
  return <CyclePinned />;
}
