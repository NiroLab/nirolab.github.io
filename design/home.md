# Home Page — `/`

**Goal:** Land like a modern research lab, not a Jekyll blog. Cinematic hero → proof (stats, honors) → work (projects) → knowledge (research areas, innovation cycle teaser) → people → news → CTA. Everything content-driven from `content/` + `site.yml`.

**Data sources:** `content/site.yml` (identity, stats), `content/projects/*` (featured), `content/news/*` (3 latest), `content/achievements/*`, `content/people/*` (leadership), `content/publications/*` (count only).

---

## Section 1 — Hero (full viewport, dark)

**Layout:** 100vh (min 680px), `--nsu-ink → --nsu-navy` gradient with `hero-gradient` radial glow top-right. Full-bleed **Three.js particle field** (~600 nodes, hairline connections, cursor repulsion) behind content. Blueprint grid overlay at 4% opacity. Fallback: `hero-constellation-fallback.png`.

- **Content (left-aligned, max-w-4xl):**
  - Eyebrow: `// NSU INTELLIGENT ROBOTICS LAB` in mono, preceded by a 32px sky hairline that draws in.
  - H1 (Sora, word-mask animation): **"Advancing robotics research through innovation and collaboration."** — with "robotics research" in a gradient `--nsu-sky → #7FB7F0`.
  - Sub (Inter, slate-200): "An innovation hub at North South University, Dhaka — turning ideas into intelligent machines since October 2024."
  - CTA row: primary pill **Explore Our Research →** (scrolls to featured projects band), secondary ghost **Meet the Team**.
  - Bottom-left: three inline mini-stats (mono): `EST. 2024` · `8 RESEARCH AREAS` · `NSU, DHAKA`.
- **Right side (desktop only):** large orbit-ring motif (SVG, 480px) slowly rotating (24s), gold satellite dot, center holds `logo.svg`; a "pulse" ring expands every 3s.
- **Bottom center:** scroll cue — thin hairline with a descending dot (loops), mono label `SCROLL`.

**Animation:**
- Load sequence (0s–1.6s): eyebrow line `scaleX 0→1` (0.5s) → H1 words rise `yPercent 110→0`, 0.06s stagger, 0.9s precision ease → sub + CTAs fade up `y 24→0`, 0.7s, +0.15s stagger → canvas fades in `opacity 0→1` 1.2s.
- Canvas runs continuously (cursor-repelling swarm). On scroll (ScrollTrigger, no pin): hero content parallax `y -80`, opacity `1→0.2` over first 90vh; orbit ring rotates extra 45°.

---

## Section 2 — Mission strip (light)

**Layout:** `--nsu-mist` background. Centered reading column (max-w-3xl), flanked left/right by faint vertical hairlines.

- Eyebrow `// OUR MISSION`
- Statement (Sora, 600, 1.75–2.25rem, words highlight in `--nsu-blue` as they pass mid-viewport via ScrollTrigger word-by-word scrub):
  > "We make robotics research accessible, impactful, and future-focused — transforming theoretical concepts into tangible, real-world solutions."

**Animation:** word-highlight scrub across the section's 60% scroll range; block reveal on entry (default reveal).

---

## Section 3 — Stats band (navy)

**Layout:** `--nsu-navy` band, 4-column grid (2×2 on mobile), divided by `--nsu-linet-dark` hairlines.

- Stats (auto-derived from content, overridable in `site.yml`): **16** Members · **8** Research Areas · **8** Active Projects · **2** Awards Won. Fourth cell gets the `gold-flare` underline.
- Each: tabular numeral (Sora 4rem) + mono caption + small sky tick icon.

**Animation:** count-up 0→value on enter (1.6s, snap 1, 0.15s stagger); cells reveal with `y 32→0`.

---

## Section 4 — Featured Projects (horizontal scroll band, dark)

**Layout:** `--nsu-ink` section. Header row (SectionHeader: eyebrow `// FLAGSHIP WORK`, H2 "Featured projects", right link "All projects →"). Below: a horizontal track of **3–4 large ProjectCards** (each 62vw desktop, 85vw mobile; aspect-tall image top, content below: status chip, title Sora 1.5rem, description, team avatars row — person-placeholder initials circles, areas chips).

- **Desktop:** GSAP pin — section pins for ~200vh; scroll drives the track horizontally (`x: 0 → -(trackWidth - viewport)`), with a progress hairline + fractional counter `01 / 03` in mono at top-right.
- **Mobile/tablet:** no pin; native horizontal scroll-snap with edge fade masks + swipe hint chip (auto-hides after first swipe).
- Card art: project image (placeholder `placeholders/project.svg` variants). Hover: image scale 1.04, sheen sweep, gold tick appears on featured card's corner badge.

**Animation:** on pin-entry, header words rise; cards stagger in `x 60→0, opacity 0→1` (0.1s) before horizontal scrub engages. Exit unpin → next section slides over with a 24px rounded top reveal.

---

## Section 5 — Innovation Cycle teaser (light)

**Layout:** light section with blueprint grid. Split layout: left sticky text block; right a **compact circular cycle diagram** (SVG ring with 6 icon nodes using `innovation-cycle-icon-1..6.svg`, connected by a dashed progress arc).

- Left: eyebrow `// HOW WE BUILD`, H2 "The Robotics Innovation Cycle", 2-line description, list of the 6 stage names (mono, numbered 01–06), ghost button "See the full cycle →" (→ About, deep-linked to the pinned section).
- Right ring: slowly rotates 30s; active stage dot pulses sky; hovering a stage node highlights the matching list item (bidirectional).

**Animation:** ring draws in (stroke-dashoffset 0.9s), nodes pop `scale 0→1` 0.08s stagger; list items slide `x -16→0`.

---

## Section 6 — Research Areas (light, tinted ice)

**Layout:** `--nsu-ice` section. SectionHeader (`// WHAT WE STUDY`, "Research across the robotics stack"). Grid: 8 tiles, 4-up desktop / 2-up tablet / 1-up mobile.

- Tile: `research-area-icon-N.svg` in a rounded ice-white square, area name (Sora 600, 1.125rem), 1-line gloss (Inter small, slate), hover: border turns `--nsu-blue`, icon square fills blue with white icon, tile lifts.
- Tiles are links → `/about#areas` (future-proof: `areas` facet on projects).

**Animation:** default reveal, stagger 0.06s per tile with slight `scale 0.96→1`.

---

## Section 7 — Honors strip (navy, conditional)

Renders only if `content/achievements/` has entries (it does: 2).

**Layout:** navy band with gold hairline top border. Horizontal row of AchievementBadges: gold medal icon (`placeholders/achievement.svg` thumb for large variant), rank label in `gold-flare` gradient text ("Champion"), event + year mono meta, linked project name.

- Entries: "Championship Award — BEAR Summit 2025 · Autonomous Delivery Robot" and "Top 3 — NIRO EDU BOT · BEAR Summit 2025".

**Animation:** badges slide `x -24→0` stagger 0.12s; medal icons get a one-time 360° shine sweep on enter.

---

## Section 8 — Leadership + Latest News (light)

**Layout:** two asymmetric columns (5/7 split):

- **Left (5):** eyebrow `// LEADERSHIP`, two compact PersonCards side-by-side — Dr. Shahnewaz Siddique (Lab Director) & Dr. Lamia Iftekhar (Co-Director): placeholder portrait (initials), name, role, 1-line focus, link "Full team →". Hover: portrait desaturates→color shift, card lifts.
- **Right (7):** eyebrow `// LATEST`, H3 "News & updates", list of 3 latest NewsCards (horizontal: 120×80 thumb, date mono, title 2-line clamp, tag chip). Clicking → `/news/:slug`. Footer link "All news →".

**Animation:** columns reveal with 0.15s offset; news rows stagger 0.1s; thumbs scale 1.05 on row hover; title underline grows.

---

## Section 9 — Closing CTA (gradient)

**Layout:** full-width navy→blue gradient panel inside container, `rounded-3xl`, blueprint grid + oversized orbit ring bleeding off the right edge, gold satellite dot.

- H2 (white): "Building the robotics ecosystem of Bangladesh."
- Sub: "We welcome collaborators, students, and industry partners."
- Buttons: primary white-fill "Get in touch →" (→ /contact), ghost-sky "Contribute content" (→ /contribute).

**Animation:** panel scales `0.97→1` + fades on enter; orbit ring rotates continuously; buttons stagger up.

---

## Global home notes
- Page transition per global doc. Scroll progress bar visible throughout.
- All counts/lists re-derive automatically when content files change — home is 100% CMS-driven except the fixed mission sentence and section copy.
