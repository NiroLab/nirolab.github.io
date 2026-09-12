# Projects — `/projects` (index) + `/projects/:slug` (detail)

**Goal:** Present 8 projects with the weight of a serious research portfolio; a rich, reusable detail template that grows as projects mature. 100% CMS-driven from `content/projects/{slug}/{slug}.md`.

---

# A. Projects Index — `/projects`

## Section 1 — Page hero (dark, compact)

- Eyebrow `// RESEARCH PROJECTS`, H1 "Machines in the making." (word-mask rise)
- Sub: "From educational robots to CubeSats — active research across land, air, water, and orbit."
- Live chips: `{n} PROJECTS` · `{n} ACTIVE` · `{n} RESEARCH AREAS COVERED`.

**Animation:** standard hero sequence.

## Section 2 — Featured carousel (dark continuation)

**Layout:** large single-feature carousel (16:7 aspect area) above the grid, auto-built from `featured: true` projects (NiroBot, NSU AI-SAT). Full-bleed image (placeholder wireframe art), gradient scrim left, content bottom-left: "FEATURED" gold badge, title H2, description, status chip + duration mono, team avatar stack, primary button "View project →". Right-bottom: slide counter `01/02` + prev/next round buttons + auto-advance progress ring (8s, pauses on hover/focus).

**Animation:** slide change — image cross-fades with 24px parallax drift (0.6s), content panel slides `y 24→0` stagger 0.06s; progress ring draws via stroke-dashoffset loop.

## Section 3 — Filter + grid (light)

**FilterBar (sticky):** pills — **All · Active · Completed · Concept** + a secondary dropdown "By research area" (facets auto-derived from project `areas` arrays) + search box. Count badge per pill.

**Grid:** 3-up xl / 2-up md / 1-up mobile. **ProjectCard:**
- 16:10 image with status chip overlay top-left (Active = pulsing sky dot + "ACTIVE" mono; Completed solid; Concept dashed).
- Title (Sora 600, 1.375rem), description (2-line clamp), duration mono meta, areas chips (max 2, "+n").
- Footer row: team avatar stack (person placeholders, initials) + linked-name tooltip on hover; arrow icon.
- Hover: lift + sheen + image scale 1.04 + arrow slides 4px.

**Animation:** default reveal stagger 0.06s; filter changes animate with `layout` reflow (0.4s) + exit fade.

**Seeded projects (8):** NIRO Educational Bot (featured) · NSU AI-SAT (featured) · Autonomous Navigation · Agriculture Monitoring UAV · HexaBot · Swarm Drone · Pursuit-Evasion · BIT Robotic Home Assistant System.

## Section 4 — Proposal CTA (light end)

Ice panel: "Have a project idea?" — text about welcoming proposals from students/partners + button "Get in touch →". Subtle mono note: "Projects are added via `content/projects/` — see the Contribute guide."

---

# B. Project Detail — `/projects/:slug`

**Route:** generated per project folder; 404-style designed fallback if slug missing ("This project file hasn't been added yet" + back link + Contribute pointer).

## Section 1 — Detail hero (dark, tall ~70vh)

- Full-bleed project image with ink gradient scrim; blueprint grid overlay.
- Breadcrumb mono: `PROJECTS / {SLUG}`.
- Title H1 (word-mask), description sub, meta chip row: status · duration · funding (if present) · research areas chips.
- Right side (desktop): facts card (glass, backdrop-blur): Team list (names auto-linked to people modal where matched), links row (GitHub/demo/paper icons — only if present).
- Back link top-left "← All projects".

**Animation:** hero image slow zoom-out 1.08→1 over 1.4s on load; content standard hero sequence; facts card slides `x 40→0`.

## Section 2 — Body with sticky TOC (light)

**Layout:** 12-col: left 3-col sticky TOC (auto-built from `##` headings in the markdown: Overview · Objectives · Methodology · Current Progress · whatever the file contains), right 9-col reading column (max-w-none but measure-capped 72ch).

- Markdown styling: H2 with numbered mono prefix (auto), GFM tables styled (ice header row, hairlines), lists with sky tick bullets, bold lead-ins, images in `rounded-xl` frames with captions.
- TOC: active item tracked via scroll-spy (IntersectionObserver), sky left-border indicator animates between items (Framer `layoutId`).

**Animation:** TOC slides in `x -16→0`; headings reveal on scroll (block-level only — reading flow not over-animated).

## Section 3 — Team strip (light)

"Project team" — horizontal row of mini PersonCards (portrait circle 64px, name, role) pulled from `team:` names matched against `content/people/` (unmatched names render as plain chips). Clicking a matched person opens the People modal component.

## Section 4 — Related achievements (conditional)

If any `content/achievements/*.md` references this project slug, render gold-accent badge cards ("Champion — BEAR Summit 2025") with `placeholders/achievement.svg` thumbs. (NiroBot/delivery robot + EDU BOT will show this.)

## Section 5 — Next project (navy)

Full-width nav card: "Next project →" with next project's title (by `order`) + image thumb; hover slides the thumb in from right. Loops around.

**Animation:** default reveals; next-project card content slides `x -24→0` on enter.
