import { marked } from "marked";

/**
 * Shared markdown pipeline for CMS bodies (design.md §7.3.2).
 * GFM tables, external links decorated to open in a new tab.
 */

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : "";
      const isExternal = /^https?:\/\//i.test(href ?? "");
      const external = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${href}"${titleAttr}${external}>${text}</a>`;
    },
  },
});

export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string;
}

/** Rough reading time in minutes (200 wpm). */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
