/**
 * Pre-submission checklist (contribute.md §11) — interactive checkboxes
 * persisted in localStorage, strike-through draw animation, progress ring.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { Crosshairs } from "./widgets";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "niro-contribute-checklist";

const ITEMS = [
  "Filled in every required field",
  "Deleted the instructions block",
  "Filename follows the convention",
  "Image sits at the exact referenced path",
  "Image is under ~500 KB",
];

function loadState(): boolean[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ITEMS.map(() => false);
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length === ITEMS.length) {
      return parsed.map(Boolean);
    }
  } catch {
    /* corrupted state → reset */
  }
  return ITEMS.map(() => false);
}

export default function Checklist() {
  const [checked, setChecked] = useState<boolean[]>(ITEMS.map(() => false));

  useEffect(() => {
    setChecked(loadState());
  }, []);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — state still works in-session */
      }
      return next;
    });
  };

  const reset = () => {
    const next = ITEMS.map(() => false);
    setChecked(next);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const done = checked.filter(Boolean).length;
  const pct = (done / ITEMS.length) * 100;

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-nsu-line bg-white p-6">
      <Crosshairs />
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
          {"// BEFORE YOU SUBMIT"}
        </div>
        {/* progress mini-ring */}
        <div className="relative h-11 w-11" aria-hidden>
          <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#D9E5F3"
              strokeWidth="3"
            />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={done === ITEMS.length ? "#2E9E6B" : "#3D8FE0"}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100 100"
              animate={{ strokeDashoffset: 100 - pct }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tabular-nums text-nsu-navy">
            {done}/{ITEMS.length}
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-1.5">
        {ITEMS.map((item, i) => {
          const on = checked[i];
          return (
            <li key={item}>
              <button
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(i)}
                className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-nsu-ice/70"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    on
                      ? "border-nsu-success bg-nsu-success text-white"
                      : "border-nsu-line bg-white group-hover:border-nsu-blue",
                  )}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="relative text-[0.875rem] leading-[1.5] text-nsu-text">
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      on && "text-nsu-slate",
                    )}
                  >
                    {item}
                  </span>
                  {/* strike-through draw */}
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ scaleX: on ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-nsu-slate"
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-nsu-line pt-4">
        <p className="text-[0.75rem] text-nsu-slate">
          {done === ITEMS.length
            ? "All clear — ready to send."
            : "Saved in your browser — pick up where you left off."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-nsu-slate transition-colors hover:text-nsu-blue"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
    </div>
  );
}
