import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  Copy,
  FileText,
  Link2,
  Quote,
} from "lucide-react";
import type { Publication } from "@/lib/content";
import { cn } from "@/lib/utils";

const PRECISION_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ------------------------------------------------------------ bibtex */
/** BibTeX for a publication: the sibling .bib verbatim when present,
 *  otherwise synthesized from frontmatter (publications.md §3). */
export function bibtexFor(pub: Publication): string {
  if (pub.bibtex) return pub.bibtex.trim();
  const family =
    (pub.authors[0]?.split(",")[0] ?? "niro")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "") || "niro";
  const firstWord =
    pub.title
      .split(/\s+/)[0]
      ?.toLowerCase()
      .replace(/[^a-z]/g, "") || "work";
  const key = `${family}${pub.year}${firstWord}`;
  const entryType =
    pub.type === "journal"
      ? "article"
      : pub.type === "preprint"
        ? "misc"
        : "inproceedings";
  const venueField =
    pub.type === "journal" ? "journal" : pub.type === "preprint" ? "note" : "booktitle";
  const lines = [
    `@${entryType}{${key},`,
    `  title   = {${pub.title}},`,
    `  author  = {${pub.authors.join(" and ")}},`,
    `  ${venueField.padEnd(7)}= {${pub.venue}},`,
    `  year    = {${pub.year}},`,
  ];
  if (pub.doi) lines.push(`  doi     = {${pub.doi}},`);
  if (pub.pdf) lines.push(`  url     = {${pub.pdf}},`);
  lines.push(`}`);
  return lines.join("\n");
}

/* ------------------------------------------------------- type styling */
const TYPE_CHIP: Record<Publication["type"], string> = {
  journal: "bg-nsu-blue text-white",
  conference: "bg-nsu-sky/15 text-nsu-blue",
  workshop: "bg-slate-200/70 text-nsu-slate",
  preprint: "border border-dashed border-nsu-blue/50 text-nsu-blue",
};

/* ------------------------------------------------------- copy helper */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/* ------------------------------------------------------------ PubItem */
/**
 * Publication row (publications.md §3): type chip, linked title, authors
 * with NIRO members bolded, italic venue + mono year, collapsible abstract,
 * PDF/DOI/Code links, Cite (BibTeX) popover with copy.
 */
export default function PubItem({
  pub,
  memberSurnames,
}: {
  pub: Publication;
  /** lowercase surnames of NIRO members - matched authors render bold */
  memberSurnames: Set<string>;
}) {
  const [abstractOpen, setAbstractOpen] = useState(false);
  const [citeOpen, setCiteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const citeRef = useRef<HTMLDivElement>(null);

  // close cite popover on outside click / ESC
  useEffect(() => {
    if (!citeOpen) return;
    const onClick = (e: MouseEvent) => {
      if (citeRef.current && !citeRef.current.contains(e.target as Node)) {
        setCiteOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCiteOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [citeOpen]);

  const titleHref = pub.doi
    ? pub.doi.startsWith("http")
      ? pub.doi
      : `https://doi.org/${pub.doi}`
    : pub.pdf;

  const isMember = (author: string) => {
    const family = author.split(",")[0]?.trim().toLowerCase();
    return family ? memberSurnames.has(family) : false;
  };

  const onCopy = async () => {
    const ok = await copyText(bibtexFor(pub));
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: PRECISION_EASE }}
      className="group relative border-b border-nsu-line px-4 py-6 transition-colors duration-300 hover:bg-nsu-ice/50 md:px-6"
    >
      {/* left border draws sky on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-nsu-sky transition-transform duration-300 group-hover:scale-y-100"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide",
            TYPE_CHIP[pub.type],
          )}
        >
          {pub.type}
        </span>
        <span className="font-mono text-xs text-nsu-slate">
          <span className="italic text-nsu-navy/80">{pub.venue}</span>
          {" · "}
          <span className="tabular-nums">{pub.year}</span>
        </span>
      </div>

      <h3 className="mt-2.5 font-mono text-[1.125rem] font-semibold leading-[1.35] tracking-[-0.01em] text-nsu-navy">
        {titleHref ? (
          <a
            href={titleHref}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-nsu-blue/0 underline-offset-4 transition-colors hover:text-nsu-blue hover:decoration-nsu-blue/40"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>

      <p className="mt-1.5 text-sm leading-relaxed text-nsu-slate">
        {pub.authors.map((author, i) => (
          <span key={i}>
            <span className={cn(isMember(author) && "font-semibold text-nsu-navy")}>
              {author}
            </span>
            {i < pub.authors.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      {/* abstract toggle */}
      {pub.abstract && (
        <div className="mt-3">
          <button
            onClick={() => setAbstractOpen((v) => !v)}
            aria-expanded={abstractOpen}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wide text-nsu-blue hover:text-nsu-navy"
          >
            Abstract
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                abstractOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {abstractOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: PRECISION_EASE }}
                className="overflow-hidden"
              >
                <p className="max-w-[68ch] pt-2 font-body text-sm leading-relaxed text-nsu-text">
                  {pub.abstract}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* action row */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {pub.pdf && (
          <ActionLink href={pub.pdf} icon={FileText} label="PDF" />
        )}
        {pub.doi && (
          <ActionLink
            href={pub.doi.startsWith("http") ? pub.doi : `https://doi.org/${pub.doi}`}
            icon={Link2}
            label="DOI"
          />
        )}
        {pub.code && (
          <ActionLink href={pub.code} icon={Code2} label="Code" />
        )}

        {/* Cite (BibTeX) popover */}
        <div ref={citeRef} className="relative">
          <button
            onClick={() => setCiteOpen((v) => !v)}
            aria-expanded={citeOpen}
            className="inline-flex items-center gap-1.5 rounded-full border border-nsu-line px-3 py-1.5 font-mono text-[11px] font-medium text-nsu-blue transition-colors hover:border-nsu-blue/40 hover:bg-nsu-ice"
          >
            <Quote className="h-3.5 w-3.5" />
            Cite (BibTeX)
          </button>
          <AnimatePresence>
            {citeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: PRECISION_EASE }}
                className="absolute left-0 top-full z-30 mt-2 w-[min(28rem,calc(100vw-3rem))] overflow-hidden rounded-xl border border-nsu-line bg-white shadow-[0_8px_30px_-8px_rgba(16,34,44,0.25)]"
              >
                <div className="flex items-center justify-between border-b border-nsu-line bg-nsu-mist px-4 py-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-nsu-slate">
                    <BookOpen className="h-3.5 w-3.5" />
                    {pub.bibtex ? `${pub.slug}.bib` : "generated BibTeX"}
                  </span>
                  <button
                    onClick={onCopy}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-colors",
                      copied
                        ? "bg-nsu-success/15 text-nsu-success"
                        : "bg-nsu-blue text-white hover:bg-nsu-navy",
                    )}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <pre className="max-h-64 overflow-auto bg-nsu-ice p-4 font-mono text-xs leading-relaxed text-nsu-navy [overflow-wrap:anywhere] whitespace-pre-wrap">
                  {bibtexFor(pub)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

function ActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-nsu-line px-3 py-1.5 font-mono text-[11px] font-medium text-nsu-blue transition-colors hover:border-nsu-blue/40 hover:bg-nsu-ice"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
