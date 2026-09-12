# Publications Page — `/publications`

**Goal:** An academic-grade publication index that looks great **both when empty (today) and when full (future)**. Driven entirely by `content/publications/*.md` (+ optional `.bib` siblings).

**Data sources:** `content/publications/*.md`. Years/types/areas facets auto-derived.

---

## Section 1 — Page hero (dark, compact)

- Eyebrow `// PUBLICATIONS`, H1 "Research in print." (word-mask rise)
- Sub: "Peer-reviewed and presented work from NIRO Lab — robotics, AI, and intelligent systems."
- Live chips: `{n} PUBLICATIONS` · `{n} VENUES` · `SINCE 2024` (chips hidden gracefully when n=0).

**Animation:** standard hero sequence.

---

## Section 2 — Toolbar (sticky, light glass)

- Search input ("Search title, author, venue…", 200ms debounce, ⌘K hint chip on desktop).
- Filter dropdowns: **Year** (auto facet, desc), **Type** (Journal / Conference / Workshop / Preprint), **Research area**.
- Right: sort toggle (Newest / Oldest / Title A–Z) + a mono "export .bib (all)" button (disabled with tooltip when empty).

**Animation:** bar slides in `y -8→0`; result list animates with `AnimatePresence` popLayout (items exit `y -12, opacity 0` 0.2s; enter `y 12→0` stagger 0.04s).

---

## Section 3 — Publication list (light)

**Layout:** reading container (max-w-4xl), entries grouped under sticky year headers (big ghost year numeral right side, Sora 800, 6% navy).

**PubItem row:**
- Left: type chip (mono, color-coded: journal blue / conference sky / workshop slate / preprint dashed).
- Title (Sora 600, 1.125rem, links to DOI/pdf if present).
- Authors line (Inter small; NIRO member names auto-bolded by matching `content/people/` names).
- Venue + year, italic venue, mono year.
- Abstract: collapsed by default — "Abstract ▸" toggle expands with height animation (0.3s).
- Action icons row: PDF · DOI · Code · **Cite (BibTeX)** — opens a small popover with the bibtex in a mono block + "Copy" button (copies, tooltip "Copied ✓"). If a `{slug}.bib` file exists it is used verbatim; otherwise bibtex is synthesized from frontmatter.
- Hover: row background shifts to `--nsu-ice` 50%, left border draws sky (scaleY, 0.3s).

**Animation:** year groups reveal with default reveal; sticky year headers slide with a subtle parallax (y 8px) as the group scrolls.

---

## Section 4 — Empty state (current live behavior — publications = 0)

**Layout:** centered in a generous `--nsu-mist` panel: animated orbit-ring SVG (satellite dot circling, 6s loop) + H3 "Our first publications are on their way." + copy: "This section is powered by structured files in `content/publications/`. Drop in a completed publication template and it appears here automatically — no code changes needed." + two buttons: primary "How to submit a publication →" (→ `/contribute#publications`), ghost "Download the template" (direct file download of `templates/publication-template.md`).

- Below: a **live example card** showing exactly what one filled entry will look like (rendered from a commented sample in the template, clearly labeled "EXAMPLE").

**Animation:** orbit loop; panel default reveal; example card slides `y 24→0` with 0.2s delay.

---

## Section 5 — Collaboration note (light end)

Small ice strip: "Interested in co-authoring or citing our work? Contact the lab →" + mailto chip.
