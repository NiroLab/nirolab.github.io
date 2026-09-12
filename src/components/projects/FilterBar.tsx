import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface StatusFacet {
  value: string;
  label: string;
  count: number;
}

/**
 * FilterBar (design.md §8.3 / projects.md §A.3): sticky-under-nav status
 * pills with an animated active pill (`layoutId` background) + count
 * badges, a "By research area" dropdown (facets auto-derived from project
 * areas), and a search box.
 */
export default function FilterBar({
  statuses,
  status,
  onStatus,
  areas,
  area,
  onArea,
  query,
  onQuery,
  resultCount,
}: {
  statuses: StatusFacet[];
  status: string;
  onStatus: (value: string) => void;
  areas: string[];
  area: string;
  onArea: (value: string) => void;
  query: string;
  onQuery: (value: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* status pills */}
      <div
        role="tablist"
        aria-label="Filter by status"
        className="flex flex-wrap items-center gap-1 rounded-full border border-nsu-line bg-white p-1"
      >
        {statuses.map((facet) => {
          const active = facet.value === status;
          return (
            <button
              key={facet.value}
              role="tab"
              aria-selected={active}
              onClick={() => onStatus(facet.value)}
              className={cn(
                "relative rounded-full px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200",
                active ? "text-white" : "text-nsu-slate hover:text-nsu-navy",
              )}
            >
              {active && (
                <motion.span
                  layoutId="project-status-pill"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-full bg-nsu-navy"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {facet.label}
                <span
                  className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-nsu-ice text-nsu-blue",
                  )}
                >
                  {facet.count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* area dropdown + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={area} onValueChange={onArea}>
          <SelectTrigger
            aria-label="Filter by research area"
            className="h-10 w-full rounded-full border-nsu-line bg-white font-mono text-[11px] uppercase tracking-[0.12em] text-nsu-slate sm:w-[240px]"
          >
            <SelectValue placeholder="All research areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All research areas</SelectItem>
            {areas.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="relative block sm:w-[220px]">
          <span className="sr-only">Search projects</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-nsu-slate"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search projects…"
            className="h-10 w-full rounded-full border border-nsu-line bg-white pl-10 pr-9 text-sm text-nsu-text placeholder:text-nsu-slate/70 focus:border-nsu-sky focus:outline-none focus:ring-2 focus:ring-nsu-sky/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              onClick={() => onQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-nsu-slate hover:bg-nsu-ice hover:text-nsu-navy"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
      </div>

      <span className="sr-only" role="status">
        {resultCount} projects shown
      </span>
    </div>
  );
}
