import { useState } from "react";
import { getContentWarnings } from "@/lib/content";
import { AlertTriangle, X } from "lucide-react";

/**
 * Dev-only content health badge (design.md §8.3): fixed corner pill listing
 * invalid content files with reasons. Renders nothing in production or when
 * all content is valid.
 */
export default function ContentHealthBadge() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!import.meta.env.DEV || dismissed) return null;
  const warnings = getContentWarnings();
  if (warnings.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm font-mono text-xs">
      {open ? (
        <div className="rounded-xl border border-nsu-gold/50 bg-nsu-ink p-4 text-nsu-ice shadow-2xl">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 font-semibold text-nsu-gold">
              <AlertTriangle className="h-4 w-4" />
              {warnings.length} invalid content{" "}
              {warnings.length === 1 ? "file" : "files"}
            </span>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss content warnings"
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="max-h-64 space-y-3 overflow-y-auto">
            {warnings.map((w) => (
              <li key={w.file}>
                <div className="break-all text-nsu-sky">{w.file}</div>
                <ul className="mt-1 space-y-0.5 pl-3 text-slate-300">
                  {w.issues.map((issue, i) => (
                    <li key={i}>· {issue}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setOpen(false)}
            className="mt-3 text-slate-400 underline underline-offset-2 hover:text-white"
          >
            Collapse
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-nsu-gold/50 bg-nsu-ink px-4 py-2 font-semibold text-nsu-gold shadow-lg hover:bg-nsu-navy"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          CMS: {warnings.length} issue{warnings.length === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}
