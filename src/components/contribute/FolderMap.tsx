/**
 * Interactive folder map of the CMS (contribute.md §3) — IDE-style file
 * tree with live counts from the CMS hooks; clicking a content folder
 * smooth-scrolls to that type's guide section.
 */
import { Folder, FileText, FileImage, FileArchive, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ContentTypeDoc, CountMap } from "./guide-data";
import { Crosshairs, scrollToId } from "./widgets";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TreeRow {
  icon: typeof Folder;
  name: string;
  desc: string;
  target?: string;
  count?: number;
  branch: string;
  isFolder: boolean;
}

export default function FolderMap({
  types,
  counts,
}: {
  types: ContentTypeDoc[];
  counts: CountMap;
}) {
  const reduced = useReducedMotion();
  const descByFolder: Record<string, string> = {
    people: "team profiles",
    projects: "one folder per project",
    publications: "papers & citations",
    news: "announcements & events",
    gallery: "photos",
    achievements: "awards & milestones",
  };

  const rows: TreeRow[] = [
    ...types.map((t, i) => ({
      icon: Folder,
      name: t.folder.replace("content/", ""),
      desc: descByFolder[t.id],
      target: t.id,
      count: counts[t.id],
      branch: i === types.length - 1 ? "└──" : "├──",
      isFolder: true,
    })),
    {
      icon: FileText,
      name: "site.yml",
      desc: "lab-wide settings — maintained by the coordinator",
      branch: "└──",
      isFolder: false,
    },
  ];

  const rootRows: TreeRow[] = [
    {
      icon: FileImage,
      name: "public/assets/",
      desc: "images — same path as the image: field in your file",
      target: "image-rules",
      branch: "",
      isFolder: true,
    },
    {
      icon: FileArchive,
      name: "templates/",
      desc: "blank forms to download",
      target: "template-pack",
      branch: "",
      isFolder: true,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-nsu-line bg-nsu-ice shadow-nsu-card">
      <Crosshairs />
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-nsu-line bg-white/70 px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-nsu-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-nsu-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-nsu-sky/50" />
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-nsu-slate">
          nirolab — repository
        </span>
        <span className="ml-auto hidden font-mono text-[11px] text-nsu-slate sm:block">
          click a folder to jump to its guide
        </span>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2.5 px-2 pb-2 font-mono text-sm font-semibold text-nsu-navy">
          <Folder className="h-4 w-4 text-nsu-blue" />
          content/
        </div>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          {[...rows, ...rootRows].map((row) => {
            const clickable = Boolean(row.target);
            const inner = (
              <>
                {row.branch && (
                  <span className="select-none text-nsu-slate/60">
                    {row.branch}
                  </span>
                )}
                <row.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    row.isFolder ? "text-nsu-blue" : "text-nsu-slate",
                  )}
                />
                <span className="font-semibold text-nsu-navy">{row.name}</span>
                <span className="hidden min-w-0 flex-1 truncate text-nsu-slate md:inline">
                  → {row.desc}
                </span>
                {typeof row.count === "number" && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-nsu-blue ring-1 ring-nsu-line">
                    <span className="tabular-nums">{row.count}</span>
                    {row.count === 1 ? "file" : "files"}
                  </span>
                )}
                {clickable && (
                  <span className="ml-auto inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-nsu-blue opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:ml-3">
                    Jump to guide
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </>
            );
            const cls = cn(
              "group flex items-center gap-2.5 rounded-lg px-2 py-2 font-mono text-[0.8125rem] transition-colors",
              clickable
                ? "cursor-pointer hover:bg-white hover:shadow-sm"
                : "opacity-80",
            );
            return (
              <motion.li
                key={row.name}
                className={cn(
                  row.name === "public/assets/" &&
                    "mt-2 border-t border-nsu-line/70 pt-2",
                )}
                variants={{
                  hidden: { opacity: 0, x: reduced ? 0 : -14 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => scrollToId(row.target!, reduced)}
                    className={cn(cls, "w-full text-left")}
                  >
                    {inner}
                  </button>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
        <p className="mt-4 border-t border-nsu-line px-2 pt-4 text-[0.8125rem] leading-[1.6] text-nsu-slate">
          Counts are read live from the loaded content collections — this page
          is proof the pipeline works: add a file, the number goes up.
        </p>
      </div>
    </div>
  );
}
