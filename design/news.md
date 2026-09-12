# News — `/news` (index) + `/news/:slug` (article)

**Goal:** A living lab journal — announcements, awards, events. Driven by `content/news/YYYY-MM-DD-slug.md` (filename date = auto ordering).

**Seeded posts (6):** Hands-on Robotics Workshop (Mar 20, 2025) · Championship Award at BEAR Summit 2025 (Jul 10) · NIRO EDU BOT Top 3 at BEAR Summit 2025 (Jul 15) · NIRO Lab at BEAR Summit 2025 (Jul 16) · Lab Director moderates Industry 4.0 panel at BEAR Summit (Jul 16) · NSU AI and Robotics Day showcase (Nov 8, 2025).

---

# A. News Index — `/news`

## Section 1 — Page hero (dark, compact)

- Eyebrow `// NEWS & EVENTS`, H1 "What's happening at NIRO." (word-mask rise)
- Sub: "Workshops, awards, demos, and milestones from the lab."
- Live chip: `{n} STORIES` · `LATEST: NOV 2025`.

**Animation:** standard hero sequence.

## Section 2 — Pinned / latest feature (light)

**Layout:** the most recent post (or `pinned: true`) gets a hero card: 7/5 split — large 16:10 image (placeholder `placeholders/news.svg`) left with "LATEST" gold-corner badge; right content: date mono + tags chips, title H2, summary (3-line), reading time mono, primary button "Read story →".

**Animation:** image clip-reveal `inset(0 12% 0 0)→0` (0.9s) + parallax; content staggers up 0.08s.

## Section 3 — Timeline feed (light)

**Layout:** remaining posts render as a vertical timeline — a center-left hairline spine with pulse-dot nodes, posts as alternating-width rows (on desktop: month/year group headers float left in mono, e.g. `JUL 2025`).

**NewsCard (row variant):** 120×80 thumb, date mono, title (2-line clamp, Sora 600), summary 1-line slate, tag chip, arrow. Award-related posts get a small gold medal glyph. Hover: thumb scales, row bg ice, arrow slides.

**Animation:** spine draws down on scroll (scaleY scrub); each node pulses once as it enters; rows slide `x -20→0` stagger 0.08s per month group.

## Section 4 — Archive + tags footer (light)

Auto-derived tag chips cloud (e.g. `workshop`, `award`, `BEAR Summit`, `showcase`) — clicking filters the feed (animated reflow). Year archive dropdown. Mono note: "News posts are markdown files in `content/news/` — see Contribute."

---

# B. News Article — `/news/:slug`

## Section 1 — Article hero (dark, tall ~65vh)

- Full-bleed post image + ink scrim; breadcrumb mono `NEWS / {YYYY} / {SLUG}`.
- Meta row: date (mono), tags chips, reading time, award badge if tagged.
- Title H1 (word-mask), summary standfirst (Inter 1.25rem, slate-200).
- Back link "← All news".

**Animation:** image zoom-out 1.08→1 (1.4s); standard hero content sequence.

## Section 2 — Article body (light)

- Reading container (max-w-3xl), 2px scroll progress hairline (sky) under navbar.
- Markdown typography: drop-cap first letter (Sora, 3.5rem, navy), H2/H3 styled, images `rounded-xl` with mono captions, blockquotes with sky left border + ice bg, links sky with underline-grow.
- Share row (sticky right rail on desktop): copy-link, Facebook, LinkedIn, X — circular ghost buttons, tooltip micro-pops.

**Animation:** paragraphs block-reveal at 30% viewport (fast, 0.5s — reading flow stays snappy).

## Section 3 — Related + prev/next (light end)

- Related: up to 2 posts sharing a tag (NewsCard row variant).
- Prev/Next nav pair (navy cards): "← Newer" / "Older →" with titles.

**Animation:** default reveals.
