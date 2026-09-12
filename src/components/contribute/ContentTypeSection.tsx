/**
 * One handbook block per content type (contribute.md §4–9):
 * header row with template download + live count, full field table,
 * tabbed template/example viewer, naming & placement card, and a
 * "where it shows up" strip.
 */
import { Download, FolderInput, MapPin, Info } from "lucide-react";
import type { ContentTypeDoc, FieldDoc } from "./guide-data";
import Chip from "@/components/Chip";
import Reveal from "@/components/Reveal";
import { RESEARCH_AREAS } from "@/lib/lab-data";
import { CopyButton, Crosshairs, TemplateViewer } from "./widgets";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------- field table */

function FieldRow({ field }: { field: FieldDoc }) {
  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-2 border-t border-nsu-line px-1 py-4 md:grid-cols-[minmax(0,1.1fr)_96px_minmax(0,1.6fr)_minmax(0,1.3fr)]",
        field.required && "border-l-2 border-l-nsu-sky pl-3",
      )}
    >
      <div>
        <div className="font-mono text-[0.8125rem] font-semibold text-nsu-navy">
          {field.name}
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-nsu-slate">
          {field.type}
        </div>
      </div>
      <div>
        {field.required ? (
          <Chip variant="completed">REQUIRED</Chip>
        ) : (
          <Chip variant="concept">OPTIONAL</Chip>
        )}
      </div>
      <div className="text-[0.8125rem] leading-[1.6] text-nsu-slate">
        {field.description}
        {field.allowed && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {field.allowed.map((v) => (
              <span
                key={v}
                className="rounded bg-nsu-ice px-1.5 py-0.5 font-mono text-[11px] text-nsu-blue"
              >
                {v}
              </span>
            ))}
          </span>
        )}
        {field.areasRef && (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {RESEARCH_AREAS.map((a) => (
              <span
                key={a.index}
                className="rounded bg-nsu-ice px-1.5 py-0.5 font-mono text-[11px] text-nsu-blue"
              >
                {a.name}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className="font-mono text-[0.75rem] leading-[1.7] text-nsu-blue [overflow-wrap:anywhere]">
        {field.example}
      </div>
    </div>
  );
}

function FieldTable({ fields }: { fields: FieldDoc[] }) {
  return (
    <div className="rounded-2xl border border-nsu-line bg-white p-4 sm:p-5">
      <div className="hidden gap-x-6 px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-nsu-slate md:grid md:grid-cols-[minmax(0,1.1fr)_96px_minmax(0,1.6fr)_minmax(0,1.3fr)]">
        <span>Field</span>
        <span>Status</span>
        <span>Description · allowed values</span>
        <span>Example</span>
      </div>
      {fields.map((f) => (
        <FieldRow key={f.name} field={f} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- section */

export default function ContentTypeSection({
  doc,
  count,
  dark = false,
}: {
  doc: ContentTypeDoc;
  count: number;
  dark?: boolean;
}) {
  const Icon = doc.icon;
  return (
    <section
      id={doc.id}
      aria-label={`${doc.name} guide`}
      className={cn(
        "scroll-mt-32 py-20 md:py-24",
        dark ? "bg-nsu-ice" : "bg-nsu-mist",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* 1 — header row */}
        <Reveal>
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-nsu-line bg-white text-nsu-blue">
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.01em] text-nsu-navy">
                  {doc.name}
                </h3>
                <Chip>
                  LIVE · {count} {count === 1 ? "ENTRY" : "ENTRIES"}
                </Chip>
              </div>
              <p className="mt-1 max-w-2xl text-[0.875rem] leading-[1.6] text-nsu-slate">
                {doc.blurb}
              </p>
            </div>
            <a
              href={`/templates/${doc.templateFile}`}
              download
              className="group ml-auto inline-flex items-center gap-2 rounded-full border border-nsu-blue/40 px-5 py-2.5 font-mono text-[0.75rem] font-medium text-nsu-blue transition-colors hover:bg-nsu-ice active:scale-[0.97]"
            >
              <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              {doc.templateFile}
            </a>
          </div>
        </Reveal>

        {/* 2+3 — field table & template viewer */}
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
              {"// FIELDS"}
            </h4>
            <FieldTable fields={doc.fields} />
            <p className="mt-3 flex gap-2 text-[0.8125rem] leading-[1.6] text-nsu-slate">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-nsu-sky" />
              {doc.bodyNote}
            </p>
            {doc.footnote && (
              <p className="mt-2 flex gap-2 text-[0.8125rem] leading-[1.6] text-nsu-slate">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-nsu-sky" />
                {doc.footnote}
              </p>
            )}
          </Reveal>
          <Reveal delay={0.1} y={24}>
            <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
              {"// TEMPLATE & EXAMPLE"}
            </h4>
            <TemplateViewer
              blank={doc.blankTemplate}
              filled={doc.filledExample}
              filledCaption={doc.filledCaption}
              fileName={doc.templateFile}
            />
          </Reveal>
        </div>

        {/* 4+5 — naming & placement / where it shows up */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="relative h-full rounded-2xl border border-nsu-line bg-white p-6">
              <Crosshairs />
              <div className="mb-4 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                <FolderInput className="h-4 w-4" />
                {"// NAMING & PLACEMENT"}
              </div>
              <ul className="space-y-4">
                {doc.naming.map((rule, i) => (
                  <li key={rule.path} className="flex items-start gap-3">
                    <span className="mt-0.5 w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-nsu-slate">
                      {rule.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <code className="min-w-0 flex-1 rounded-md bg-nsu-ice px-2 py-1 font-mono text-[0.75rem] leading-[1.6] text-nsu-navy [overflow-wrap:anywhere]">
                          {rule.path}
                        </code>
                        {i === 0 && (
                          <CopyButton
                            text={rule.path}
                            label="Copy path"
                            className="mt-0.5"
                          />
                        )}
                      </div>
                      {rule.note && (
                        <p className="mt-1 text-[0.75rem] leading-[1.5] text-nsu-slate">
                          {rule.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-nsu-line bg-white p-6">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-nsu-blue">
                <MapPin className="h-4 w-4" />
                {"// WHERE IT SHOWS UP"}
              </div>
              <p className="mb-4 text-[0.875rem] leading-[1.6] text-nsu-slate">
                One file feeds every one of these surfaces — no extra steps:
              </p>
              <div className="flex flex-wrap gap-2">
                {doc.showsUp.map((spot) => (
                  <Chip key={spot}>{spot}</Chip>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
