/**
 * Contribute — the in-site CMS handbook (design/contribute.md).
 * Teaches non-developers how to publish content by filling a template
 * and dropping it into the right content/ folder. Live counts come from
 * the CMS hooks, so the page proves the pipeline works.
 */
import { useMemo } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileDown,
  FolderInput,
  GitBranch,
  Image as ImageIcon,
  Mail,
  PenLine,
  Ruler,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  useAchievements,
  useGallery,
  useNews,
  usePeople,
  useProjects,
  usePublications,
} from "@/lib/content";
import SectionHeader from "@/components/SectionHeader";
import Reveal, { RevealGroup, RevealItem } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { buildContentTypes, type CountMap } from "@/components/contribute/guide-data";
import {
  Crosshairs,
  PRECISION_EASE,
  scrollToId,
} from "@/components/contribute/widgets";
import FolderMap from "@/components/contribute/FolderMap";
import ContentTypeSection from "@/components/contribute/ContentTypeSection";
import Checklist from "@/components/contribute/Checklist";
import PlaceholderMorph from "@/components/contribute/PlaceholderMorph";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------- section 1 */

function Hero() {
  const reduced = useReducedMotion();
  const words = "Add content. No code required.".split(" ");
  const chips = ["6 CONTENT TYPES", "0 CODE EDITS NEEDED", "~5 MIN PER ENTRY"];
  return (
    <section
      className="relative overflow-hidden bg-hero-gradient py-20 md:py-28"
      aria-label="Content guide hero"
    >
      <div className="blueprint-grid-dark absolute inset-0 opacity-60" aria-hidden />
      {/* orbit motif */}
      <div
        className="absolute -right-28 top-1/2 hidden h-[380px] w-[380px] -translate-y-1/2 md:block"
        aria-hidden
      >
        <div className="h-full w-full animate-[spin_24s_linear_infinite]">
          <svg viewBox="0 0 380 380" fill="none" className="h-full w-full opacity-50">
            <g transform="rotate(18 190 190)">
              <ellipse cx="190" cy="190" rx="176" ry="98" stroke="#3D8FE0" strokeWidth="1.5" />
            </g>
            <circle cx="360" cy="146" r="6" fill="#F2A900" />
          </svg>
        </div>
      </div>
      <Crosshairs dark className="absolute inset-6 hidden md:block" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
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
            transition={{ delay: 0.3 }}
            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky"
          >
            {"// CONTENT GUIDE"}
          </motion.span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={cn(
                  "inline-block",
                  i >= 2 && "bg-sky-gradient bg-clip-text text-transparent",
                )}
                initial={{ y: reduced ? "0%" : "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.06, ease: PRECISION_EASE }}
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: PRECISION_EASE }}
          className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-200"
        >
          The NIRO Lab website is powered by structured text files. Fill in a
          template, place it in the right folder — the site detects, validates,
          and publishes it automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: PRECISION_EASE }}
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3"
        >
          {chips.map((chip, i) => (
            <span key={chip} className="flex items-center gap-3">
              <span className="rounded-md border border-nsu-line-dark bg-nsu-ink/50 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-nsu-sky">
                {chip}
              </span>
              {i < chips.length - 1 && (
                <span className="hidden h-1 w-1 rounded-full bg-nsu-gold sm:block" aria-hidden />
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- sticky section nav */

const NAV_ITEMS: Array<[string, string]> = [
  ["how-it-works", "How it works"],
  ["folder-map", "Folder map"],
  ["people", "People"],
  ["projects", "Projects"],
  ["publications", "Publications"],
  ["news", "News"],
  ["gallery", "Gallery"],
  ["achievements", "Achievements"],
  ["image-rules", "Images"],
  ["submit", "Submit"],
  ["faq", "FAQ"],
  ["template-pack", "Templates"],
];

function SectionNav() {
  const reduced = useReducedMotion();
  return (
    <nav
      aria-label="Page sections"
      className="sticky top-[60px] z-40 border-b border-nsu-line bg-nsu-mist/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-2.5 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToId(id, reduced)}
            className="whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wide text-nsu-slate transition-colors hover:bg-nsu-ice hover:text-nsu-blue active:scale-[0.97]"
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------- section 2 */

const STEPS = [
  {
    icon: FileDown,
    title: "Pick a template",
    body: "Download the blank form for your content type — person, project, publication, news, gallery, or achievement.",
  },
  {
    icon: PenLine,
    title: "Fill it in",
    body: "Open it in any text editor, follow the field guide inside, then delete the instructions block at the top.",
  },
  {
    icon: FolderInput,
    title: "Name & place it",
    body: "Save with the exact filename convention into the matching content/ folder — and put images at the path your file references.",
  },
  {
    icon: Sparkles,
    title: "Done",
    body: "The site rebuilds and your content appears in the right section automatically. Invalid files never break the site — they're skipped with a clear warning.",
  },
];

function HowItWorks() {
  const reduced = useReducedMotion();
  return (
    <section id="how-it-works" className="relative scroll-mt-32 bg-nsu-mist py-24 md:py-32" aria-label="How it works">
      <div className="blueprint-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow="HOW IT WORKS" title="Four steps, zero code" />
        <div className="relative">
          {/* connector — desktop */}
          <motion.div
            initial={{ scaleX: reduced ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: PRECISION_EASE }}
            className="absolute left-6 right-6 top-6 hidden origin-left border-t-2 border-dashed border-nsu-sky/50 lg:block"
            aria-hidden
          />
          {/* connector — mobile */}
          <motion.div
            initial={{ scaleY: reduced ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, ease: PRECISION_EASE }}
            className="absolute bottom-8 left-6 top-8 origin-top border-l-2 border-dashed border-nsu-sky/50 lg:hidden"
            aria-hidden
          />
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5 lg:flex-col lg:gap-0">
                <motion.span
                  initial={{ scale: reduced ? 1 : 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                    delay: reduced ? 0 : 0.35 + i * 0.28,
                  }}
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-nsu-blue bg-white font-mono text-sm font-semibold text-nsu-blue shadow-sm"
                >
                  {i + 1}
                </motion.span>
                <Reveal
                  delay={0.2 + i * 0.12}
                  y={24}
                  className="group relative min-w-0 flex-1 rounded-2xl border border-nsu-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-nsu-card lg:mt-6"
                >
                  <Crosshairs />
                  <step.icon className="h-6 w-6 text-nsu-blue" />
                  <h3 className="mt-4 font-display text-[1.125rem] font-semibold leading-snug text-nsu-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.65] text-nsu-slate">
                    {step.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- image specs data */

const IMAGE_SPECS: Array<[string, string, string, string]> = [
  ["Person portrait", "400×400", "JPG", "square, face centered"],
  ["Project hero", "1600×900", "JPG / GIF", "GIF ok for demos"],
  ["News image", "1200×675", "JPG", "16:9"],
  ["Gallery photo", "1200×900", "JPG", "4:3"],
  ["Achievement", "800×600", "JPG", "4:3"],
];

/* ------------------------------------------------------------ section 10 */

function ImageRules() {
  return (
    <section
      id="image-rules"
      className="relative scroll-mt-32 overflow-hidden bg-nsu-navy py-24 md:py-32"
      aria-label="Image rules"
    >
      <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader
          eyebrow="IMAGE RULES"
          title="Images: sizes, placeholders, weight"
          dark
        />
        <RevealGroup className="grid gap-6 lg:grid-cols-3" stagger={0.12}>
          {/* 1 — sizes */}
          <RevealItem y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-nsu-line-dark bg-nsu-ink/60 p-6">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky">
                <Ruler className="h-4 w-4" />
                {"// SIZES"}
              </div>
              <table className="w-full font-mono text-[0.75rem] leading-relaxed">
                <thead>
                  <tr className="border-b border-nsu-line-dark text-left text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    <th className="pb-2 pr-2 font-medium">Slot</th>
                    <th className="pb-2 pr-2 font-medium">Size</th>
                    <th className="pb-2 font-medium">Format</th>
                  </tr>
                </thead>
                <tbody>
                  {IMAGE_SPECS.map(([slot, size, format, note]) => (
                    <tr key={slot} className="border-b border-nsu-line-dark/50 last:border-0">
                      <td className="py-2.5 pr-2 text-slate-200">
                        {slot}
                        <span className="block text-[10px] text-slate-500">{note}</span>
                      </td>
                      <td className="py-2.5 pr-2 tabular-nums text-nsu-sky">{size}</td>
                      <td className="py-2.5 text-slate-300">{format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[0.75rem] leading-[1.6] text-slate-400">
                PNG is fine for diagrams and screenshots.
              </p>
            </div>
          </RevealItem>

          {/* 2 — placeholders + morph demo */}
          <RevealItem y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-nsu-line-dark bg-nsu-ink/60 p-6">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky">
                <ImageIcon className="h-4 w-4" />
                {"// PLACEHOLDERS"}
              </div>
              <p className="mb-5 text-[0.875rem] leading-[1.65] text-slate-300">
                Missing image? A designed placeholder appears automatically —
                the layout never breaks. Replace the file at the{" "}
                <span className="font-mono text-[0.8125rem] text-nsu-sky">
                  exact same path
                </span>{" "}
                later and the site swaps it in. Nothing else to touch.
              </p>
              <div className="mt-auto">
                <PlaceholderMorph />
              </div>
            </div>
          </RevealItem>

          {/* 3 — formats & weight */}
          <RevealItem y={24}>
            <div className="flex h-full flex-col rounded-2xl border border-nsu-line-dark bg-nsu-ink/60 p-6">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-sky">
                <ShieldCheck className="h-4 w-4" />
                {"// FORMATS & WEIGHT"}
              </div>
              <ul className="space-y-4 text-[0.875rem] leading-[1.65] text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nsu-gold" />
                  Keep every image under{" "}
                  <span className="font-mono text-nsu-sky">~500 KB</span> — the
                  site loads fast for everyone.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nsu-gold" />
                  GIF is allowed for project demos, e.g.{" "}
                  <span className="font-mono text-nsu-sky">nirobot.gif</span>.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nsu-gold" />
                  Name the file exactly as your{" "}
                  <span className="font-mono text-nsu-sky">image:</span> field
                  references it — case matters.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-nsu-gold" />
                  Photos go in{" "}
                  <span className="font-mono text-nsu-sky">public/assets/…</span>,
                  never inside{" "}
                  <span className="font-mono text-nsu-sky">content/</span>.
                </li>
              </ul>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 11 */

const SUBJECT_EXAMPLES = [
  "NIRO Website - Jane Doe - Person",
  "NIRO Website - Robotics Workshop - News",
  "NIRO Website - NIRO EDU BOT - Project",
];

function Submission() {
  return (
    <section id="submit" className="scroll-mt-32 bg-nsu-mist py-24 md:py-32" aria-label="Submission and workflow">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow="SUBMIT" title="Two ways in — pick yours" />
        <RevealGroup className="grid items-stretch gap-6 lg:grid-cols-3" stagger={0.1}>
          {/* with repo access */}
          <RevealItem y={24} className="h-full">
            <div className="relative h-full rounded-2xl border border-nsu-line bg-white p-6">
              <Crosshairs />
              <div className="mb-4 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                <GitBranch className="h-4 w-4" />
                {"// WITH REPOSITORY ACCESS"}
              </div>
              <ol className="space-y-3">
                {[
                  "Drop your filled files into the right content/ folders (and images into public/assets/…).",
                  "Commit and push — or open a pull request for review.",
                  "The site rebuilds on deploy. Your content is live.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-[0.875rem] leading-[1.65] text-nsu-slate">
                    <span className="font-mono text-xs font-semibold text-nsu-sky">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </RevealItem>

          {/* without access */}
          <RevealItem y={24} className="h-full">
            <div className="relative h-full rounded-2xl border border-nsu-line bg-white p-6">
              <Crosshairs />
              <div className="mb-4 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                <Mail className="h-4 w-4" />
                {"// WITHOUT ACCESS — EMAIL IT"}
              </div>
              <p className="text-[0.875rem] leading-[1.65] text-nsu-slate">
                ZIP your <span className="font-mono text-nsu-navy">.md</span>{" "}
                files and images, then email them to{" "}
                <a
                  href="mailto:nirolaboratory@gmail.com?subject=NIRO%20Website%20-%20%5BName%5D%20-%20%5BContent%20Type%5D"
                  className="font-semibold text-nsu-blue underline-offset-4 hover:underline"
                >
                  nirolaboratory@gmail.com
                </a>{" "}
                — the coordinator places the files for you. Use this subject
                format:
              </p>
              <code className="mt-3 block rounded-md bg-nsu-ice px-3 py-2 font-mono text-[0.75rem] text-nsu-navy [overflow-wrap:anywhere]">
                NIRO Website - [Name] - [Content Type]
              </code>
              <ul className="mt-3 space-y-1.5">
                {SUBJECT_EXAMPLES.map((s) => (
                  <li key={s} className="font-mono text-[0.75rem] leading-[1.6] text-nsu-slate">
                    <span className="mr-2 text-nsu-sky">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* checklist */}
          <RevealItem y={24} className="h-full">
            <Checklist />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 12 */

const SAFETY_LINES = [
  { kind: "meta" as const, text: "NIRO CMS · content check — 14 files scanned" },
  { kind: "ok" as const, text: "12 files valid → published" },
  { kind: "err" as const, text: "content/people/jane-doe.md — skipped" },
  {
    kind: "detail" as const,
    text: "category: invalid value — expected one of founding_faculty | affiliated_faculty | ra | student | alumni",
  },
  { kind: "err" as const, text: "content/news/workshop.md — skipped" },
  {
    kind: "detail" as const,
    text: "date: must match the date in the filename (YYYY-MM-DD)",
  },
];

const FAQ_ITEMS: Array<[string, string]> = [
  [
    "What if I make a mistake?",
    "Nothing breaks. Every file is validated when the site builds: an invalid file is skipped and the warning names the file and the exact field — everything else on the site keeps working. Fix the field, save, and the file joins the site on the next rebuild.",
  ],
  [
    "How do I update or remove an entry later?",
    "Edit the same file and save (or email the updated file to the coordinator) — the site re-renders it in place. To remove an entry, delete the file; nothing else references it, so no other page needs touching.",
  ],
  [
    "Can I use Word or Google Docs?",
    "No — rich-text editors add hidden formatting characters that corrupt the file. Use a plain-text editor: Notepad on Windows, TextEdit on Mac in plain-text mode (Format → Make Plain Text), or VS Code. You can draft in Docs, but paste into the template as plain text.",
  ],
  [
    "How do I add a brand-new section type?",
    "That's the one task that does need code — new collections (say, a courses section) are added by the site maintainer. Everything inside the six existing types is file-only. Request new sections at nirolaboratory@gmail.com.",
  ],
  [
    "Who reviews submissions?",
    "The lab coordinator reviews every emailed submission before it goes live, and repository changes land through pull-request review. Expect a reply confirming your content is up — usually within a few days.",
  ],
];

function SafetyNetAndFaq() {
  return (
    <section id="faq" className="scroll-mt-32 bg-nsu-ice py-24 md:py-32" aria-label="Safety net and FAQ">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeader eyebrow="SAFETY NET" title="Mistakes can't break the site" />
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="max-w-xl text-[1.0625rem] leading-[1.7] text-nsu-slate">
              Every content file is checked against a strict schema when the
              site builds. A file with errors is{" "}
              <strong className="font-semibold text-nsu-navy">
                skipped with a named warning
              </strong>{" "}
              — the rest of the site keeps working, always. In development, a
              small "content issues" badge lists exactly what's wrong, down to
              the field.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Invalid file → skipped, never a crash or a blank page.",
                "The warning names the file and the field that failed.",
                "Fix the field, save — the file joins the site on the next rebuild.",
                "Missing images fall back to designed placeholders automatically.",
              ].map((point) => (
                <li key={point} className="flex gap-3 text-[0.9375rem] leading-[1.6] text-nsu-text">
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-nsu-success" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* mock content-issues panel */}
          <Reveal delay={0.1} y={24}>
            <div className="relative overflow-hidden rounded-2xl border border-nsu-line bg-white shadow-nsu-card">
              <Crosshairs />
              <div className="flex items-center gap-2 border-b border-nsu-line bg-nsu-mist px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-nsu-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-nsu-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-nsu-gold/60" />
                <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
                  content issues — build log
                </span>
              </div>
              <div className="space-y-2.5 p-5 font-mono text-[0.75rem] leading-[1.7]">
                {SAFETY_LINES.map((line, i) => (
                  <div key={i} className="flex gap-2.5">
                    {line.kind === "meta" && (
                      <span className="text-nsu-slate">{line.text}</span>
                    )}
                    {line.kind === "ok" && (
                      <>
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nsu-success" />
                        <span className="text-nsu-success">{line.text}</span>
                      </>
                    )}
                    {line.kind === "err" && (
                      <>
                        <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nsu-error" />
                        <span className="font-semibold text-nsu-error">{line.text}</span>
                      </>
                    )}
                    {line.kind === "detail" && (
                      <span className="pl-6 text-nsu-slate [overflow-wrap:anywhere]">
                        {line.text}
                      </span>
                    )}
                  </div>
                ))}
                <div className="border-t border-nsu-line pt-3 text-nsu-slate">
                  site status: <span className="font-semibold text-nsu-success">healthy</span>
                  {" — "}12 of 14 entries live
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <Reveal className="mt-16">
          <h3 className="mb-6 font-display text-2xl font-bold tracking-[-0.02em] text-nsu-navy">
            Frequently asked
          </h3>
          <Accordion type="single" collapsible className="max-w-3xl">
            {FAQ_ITEMS.map(([q, a], i) => (
              <AccordionItem
                key={q}
                value={`faq-${i}`}
                className="border-b border-nsu-line"
              >
                <AccordionTrigger className="py-5 text-left font-display text-[1rem] font-semibold text-nsu-navy hover:text-nsu-blue hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[68ch] pb-5 text-[0.9375rem] leading-[1.7] text-nsu-slate">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ section 13 */

function TemplatePackCta({ templateFiles }: { templateFiles: string[] }) {
  return (
    <section
      id="template-pack"
      className="scroll-mt-32 bg-nsu-ice pb-24 md:pb-32"
      aria-label="Template pack"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: PRECISION_EASE }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nsu-ink via-nsu-navy to-nsu-blue px-8 py-14 md:px-16 md:py-20"
          >
            <div className="blueprint-grid-dark absolute inset-0" aria-hidden />
            <div
              className="absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 animate-[spin_24s_linear_infinite]"
              aria-hidden
            >
              <svg viewBox="0 0 420 420" fill="none" className="h-full w-full opacity-40">
                <g transform="rotate(18 210 210)">
                  <ellipse cx="210" cy="210" rx="195" ry="108" stroke="#3D8FE0" strokeWidth="1.5" />
                </g>
                <circle cx="398" cy="160" r="6" fill="#F2A900" />
              </svg>
            </div>
            <div className="relative">
              <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                Get the full template pack
              </h2>
              <p className="mt-4 max-w-2xl text-[1.0625rem] leading-[1.7] text-slate-200">
                All six blank forms, ready to fill — plus a README that walks
                through the whole workflow.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {templateFiles.map((file) => (
                  <a
                    key={file}
                    href={`/templates/${file}`}
                    download
                    className="group inline-flex items-center gap-2 rounded-full border border-nsu-sky/50 px-4 py-2 font-mono text-[0.75rem] font-medium text-nsu-sky transition-colors hover:bg-nsu-sky/10 hover:text-white active:scale-[0.97]"
                  >
                    <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                    {file}
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/templates/README.md"
                  download
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-nsu-navy transition-transform active:scale-[0.97]"
                >
                  Download the pack README
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="mailto:nirolaboratory@gmail.com?subject=NIRO%20Website%20-%20%5BName%5D%20-%20%5BContent%20Type%5D"
                  className="inline-flex items-center gap-2 rounded-full border border-nsu-sky/60 px-7 py-3.5 text-[0.9375rem] font-semibold tracking-[0.01em] text-nsu-sky transition-colors hover:bg-nsu-sky/10 hover:text-white active:scale-[0.97]"
                >
                  <Mail className="h-4 w-4" />
                  Email the coordinator
                </a>
              </div>
              <p className="mt-6 font-mono text-[0.75rem] tracking-wide text-slate-400">
                Templates also live in /templates/ in the repository.
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */

export default function Contribute() {
  const people = usePeople();
  const { all: projects } = useProjects();
  const publications = usePublications();
  const news = useNews();
  const gallery = useGallery();
  const achievements = useAchievements();

  const counts: CountMap = useMemo(
    () => ({
      people: people.length,
      projects: projects.length,
      publications: publications.all.length,
      news: news.length,
      gallery: gallery.length,
      achievements: achievements.length,
    }),
    [people, projects, publications, news, gallery, achievements],
  );

  const types = useMemo(() => buildContentTypes(), []);
  const templateFiles = useMemo(
    () => types.map((t) => t.templateFile),
    [types],
  );

  return (
    <>
      <Hero />
      <SectionNav />
      <HowItWorks />

      {/* folder map */}
      <section
        id="folder-map"
        className="scroll-mt-32 bg-nsu-ice py-24 md:py-32"
        aria-label="Folder map"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeader
            eyebrow="FOLDER MAP"
            title="Everything lives in content/"
          />
          <Reveal>
            <FolderMap types={types} counts={counts} />
          </Reveal>
          <p className="mt-6 max-w-3xl text-[0.875rem] leading-[1.7] text-nsu-slate">
            Not sure where something goes? If it's about a person, it's{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.75rem] text-nsu-blue">people/</code>.
            If it happened on a date, it's{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.75rem] text-nsu-blue">news/</code>.
            If it won something, it's{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[0.75rem] text-nsu-blue">achievements/</code>.
          </p>
        </div>
      </section>

      {/* per-type handbook blocks */}
      {types.map((doc, i) => (
        <ContentTypeSection
          key={doc.id}
          doc={doc}
          count={counts[doc.id]}
          dark={i % 2 === 0}
        />
      ))}

      <ImageRules />
      <Submission />
      <SafetyNetAndFaq />
      <TemplatePackCta templateFiles={templateFiles} />

      {/* still stuck → contact */}
      <section className="bg-nsu-mist pb-24" aria-label="More help">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-nsu-line bg-white px-6 py-5">
              <p className="text-[0.9375rem] text-nsu-slate">
                Still stuck, or want to propose a new kind of content?
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-nsu-blue hover:text-nsu-navy"
              >
                Talk to the lab
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
