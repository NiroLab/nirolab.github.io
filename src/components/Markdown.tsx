import { useMemo } from "react";
import { renderMarkdown } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Shared Markdown renderer for CMS bodies.
 * Accepts either raw markdown (`children`) or pre-rendered `html`.
 * External links open in a new tab (handled in the pipeline).
 */
export default function Markdown({
  children,
  html,
  className,
}: {
  children?: string;
  html?: string;
  className?: string;
}) {
  const rendered = useMemo(
    () => html ?? renderMarkdown(children ?? ""),
    [html, children],
  );
  return (
    <div
      className={cn(
        "markdown-body max-w-[68ch] font-body text-[1.0625rem] leading-[1.7] text-nsu-text",
        "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-nsu-navy",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-mono [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-nsu-navy",
        "[&_p]:mb-5",
        "[&_a]:font-medium [&_a]:text-nsu-blue [&_a]:underline [&_a]:decoration-nsu-blue/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-nsu-blue",
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_strong]:font-semibold [&_strong]:text-nsu-navy",
        "[&_code]:rounded [&_code]:bg-nsu-ice [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875rem] [&_code]:text-nsu-navy [&_code]:[overflow-wrap:anywhere]",
        "[&_pre]:mb-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-nsu-ink [&_pre]:p-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-nsu-ice",
        "[&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.9375rem]",
        "[&_th]:border [&_th]:border-nsu-line [&_th]:bg-nsu-ice [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-nsu-navy",
        "[&_td]:border [&_td]:border-nsu-line [&_td]:px-4 [&_td]:py-2.5",
        "[&_tr:nth-child(even)_td]:bg-nsu-mist",
        "[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-nsu-sky [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-nsu-slate",
        "[&_hr]:my-10 [&_hr]:border-nsu-line",
        "[&_img]:rounded-xl [&_img]:border [&_img]:border-nsu-line",
        className,
      )}
      // Content is contributor-authored markdown rendered by `marked`;
      // frontmatter is validated by zod before this ever runs.
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
