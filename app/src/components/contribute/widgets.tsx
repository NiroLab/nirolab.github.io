/**
 * Page-local building blocks for the Contribute handbook:
 * crosshair corner ticks, copy-to-clipboard button, syntax-tinted YAML
 * block, and the tabbed "Blank template / Filled example" viewer.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const PRECISION_EASE = [0.22, 1, 0.36, 1] as [
  number,
  number,
  number,
  number,
];

/** Smooth-scroll to an in-page anchor (Lenis-safe: native scroll is adopted). */
export function scrollToId(id: string, reduced: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

/* ---------------------------------------------------------- crosshairs */

/** Engineering-drawing `+` ticks at the four corners of a relative parent. */
export function Crosshairs({
  dark = false,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  const color = dark ? "text-nsu-line-dark" : "text-nsu-line";
  const pos = [
    "-left-1.5 -top-3",
    "-right-1.5 -top-3",
    "-left-1.5 -bottom-3",
    "-right-1.5 -bottom-3",
  ];
  return (
    <span aria-hidden className={cn("pointer-events-none", className)}>
      {pos.map((p) => (
        <span
          key={p}
          className={cn(
            "absolute select-none font-mono text-lg font-light leading-none",
            color,
            p,
          )}
        >
          +
        </span>
      ))}
    </span>
  );
}

/* ----------------------------------------------------------- copy button */

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers
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

export function CopyButton({
  text,
  dark = false,
  label = "Copy",
  className,
}: {
  text: string;
  dark?: boolean;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }
      }}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[11px] font-medium tracking-wide transition-colors active:scale-[0.97]",
        dark
          ? "border-nsu-line-dark text-nsu-sky hover:border-nsu-sky/60 hover:bg-nsu-sky/10"
          : "border-nsu-line bg-white text-nsu-blue hover:border-nsu-blue/50 hover:bg-nsu-ice",
        className,
      )}
      aria-live="polite"
    >
      <span className="relative h-3.5 w-3.5">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              <Check className="h-3.5 w-3.5 text-nsu-success" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {copied ? "Copied ✓" : label}
    </button>
  );
}

/* ------------------------------------------------------------- yaml tint */

interface Token {
  text: string;
  cls: string;
}

const C = {
  comment: "text-slate-500",
  key: "text-nsu-sky",
  punct: "text-slate-400",
  value: "text-slate-100",
  body: "text-slate-400",
  delim: "text-nsu-gold/80",
};

function tokenizeLine(line: string, inFrontmatter: boolean): Token[] {
  const trimmed = line.trim();
  if (trimmed.startsWith("#")) return [{ text: line, cls: C.comment }];
  if (!inFrontmatter) return [{ text: line, cls: C.body }];

  // key: value   (also nested "  github: …" and list items)
  const m = line.match(/^(\s*-?\s*)([A-Za-z_][\w-]*)(:)(.*)$/);
  if (m) {
    const [, lead, key, colon, rest] = m;
    const tokens: Token[] = [
      { text: lead, cls: C.punct },
      { text: key, cls: C.key },
      { text: colon, cls: C.punct },
    ];
    // split trailing comment off the value
    const hashIdx = rest.indexOf("  #");
    if (hashIdx >= 0) {
      tokens.push({ text: rest.slice(0, hashIdx), cls: C.value });
      tokens.push({ text: rest.slice(hashIdx), cls: C.comment });
    } else if (rest) {
      tokens.push({ text: rest, cls: C.value });
    }
    return tokens;
  }
  if (trimmed.startsWith("-")) {
    const idx = line.indexOf("-");
    return [
      { text: line.slice(0, idx + 1), cls: C.punct },
      { text: line.slice(idx + 1), cls: C.value },
    ];
  }
  return [{ text: line, cls: C.value }];
}

/** Mono YAML/markdown block with light syntax tinting (design §3 code style). */
export function YamlBlock({ code, className }: { code: string; className?: string }) {
  const lines = code.split("\n");
  let fenceCount = 0;
  return (
    <pre
      className={cn(
        "overflow-x-auto p-5 font-mono text-[0.8125rem] leading-[1.75]",
        className,
      )}
    >
      {lines.map((line, i) => {
        let tokens: Token[];
        if (line.trim() === "---" && fenceCount < 2) {
          fenceCount += 1;
          tokens = [{ text: line, cls: C.delim }];
        } else {
          tokens = tokenizeLine(line, fenceCount === 1);
        }
        return (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 select-none pr-4 text-right text-slate-600">
              {i + 1}
            </span>
            <code className="whitespace-pre break-words">
              {tokens.map((t, j) => (
                <span key={j} className={t.cls}>
                  {t.text}
                </span>
              ))}
              {line === "" ? " " : ""}
            </code>
          </div>
        );
      })}
    </pre>
  );
}

/* -------------------------------------------------------- template viewer */

/** Tabbed viewer: "Blank template" / "Filled example" + copy button. */
export function TemplateViewer({
  blank,
  filled,
  filledCaption,
  fileName,
}: {
  blank: string;
  filled: string;
  filledCaption: string;
  fileName: string;
}) {
  const [tab, setTab] = useState<"blank" | "filled">("blank");
  const reduced = useReducedMotion();
  const active = tab === "blank" ? blank : filled;

  return (
    <div className="overflow-hidden rounded-2xl border border-nsu-line-dark bg-[#0D2C5A] shadow-nsu-card">
      {/* chrome bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-nsu-line-dark bg-nsu-ink/60 px-4 py-2.5">
        <div
          className="inline-flex rounded-lg bg-nsu-line-dark/50 p-0.5"
          role="tablist"
          aria-label={`${fileName} views`}
        >
          {(
            [
              ["blank", "Blank template"],
              ["filled", "Filled example"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "relative rounded-md px-3 py-1.5 font-mono text-[11px] font-medium tracking-wide transition-colors",
                tab === key ? "text-white" : "text-slate-400 hover:text-slate-200",
              )}
            >
              {tab === key && (
                <motion.span
                  layoutId={`tab-${fileName}`}
                  transition={{ duration: 0.25, ease: PRECISION_EASE }}
                  className="absolute inset-0 rounded-md bg-nsu-blue"
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
        <span className="ml-1 hidden min-w-0 flex-1 items-center gap-1.5 truncate font-mono text-[11px] text-slate-400 sm:flex">
          <FileCode2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {tab === "blank" ? `templates/${fileName}` : filledCaption}
          </span>
        </span>
        <CopyButton text={active} dark className="ml-auto sm:ml-0" />
      </div>
      {/* body */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="max-h-[440px] overflow-y-auto"
        >
          <YamlBlock code={active} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
