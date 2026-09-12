# NIRO Lab — Global Design Document

**Site:** NIRO Lab (NSU Intelligent Robotics Lab) — North South University, Dhaka, Bangladesh
**Stack:** Node.js 20 · Vite 7 · React 19 + TypeScript · Tailwind CSS 3.4 · shadcn/ui · GSAP + ScrollTrigger · Framer Motion · Lenis · Three.js (React Three Fiber)
**Mandate:** Full redesign of nirolab.github.io as a modern, blue-themed, NSU-inspired research lab website with a **file-based CMS**: contributors drop structured markdown files into designated folders and the site auto-renders them — zero code edits.

---

## 1. Design Concept

**"Precision in motion."** The visual language fuses the institutional gravitas of North South University (deep navy, academic blues) with the kinetic, engineered feel of robotics: blueprint grids, circuit-line accents, sensor-pulse dots, and orbital geometry. The site should feel like opening a well-built instrument: clean surfaces, confident typography, precise micro-motion, and moments of genuine delight (scroll-pinned innovation cycle, particle-network hero, blueprint hover states).

- **Mood:** Professional, modern, academic, quietly futuristic.
- **Not:** corporate SaaS, neon cyberpunk, or a static Jekyll brochure.
- **Signature motifs (reuse everywhere):**
  1. **Blueprint grid** — 1px hairline grid (`rgba(27,95,170,0.08)`) on light sections; a 48px cell grid with occasional 240px "major" lines.
  2. **Orbit ring** — thin circular rings with a single satellite dot, echoing the NSU AI-SAT project; used as loading state, section dividers, and hero decoration.
  3. **Node-and-wire** — small dots joined by hairlines (like a multi-robot swarm topology); used in hero canvas, footer, and card hover underlays.
  4. **Crosshair ticks** — `+` marks at layout corners of cards/modals, engineering-drawing style.
  5. **Data eyebrow** — uppercase mono labels like `// RESEARCH AREAS` before each section title.

---

## 2. Color Palette (NSU Blue System)

| Token | Hex | Usage |
|---|---|---|
| `--nsu-navy` | `#0A2A5E` | Primary dark — hero backgrounds, footer, dark sections, heading text on light |
| `--nsu-ink` | `#061A3A` | Deepest navy — page background of dark sections, footer base |
| `--nsu-blue` | `#1B5FAA` | Primary brand blue — buttons, links, active states, icon fills |
| `--nsu-sky` | `#3D8FE0` | Secondary blue — gradients, hover states, chart/ring accents |
| `--nsu-ice` | `#E9F2FC` | Tinted surfaces — card backgrounds, code blocks, table stripes |
| `--nsu-mist` | `#F5F9FE` | Page background (light sections) |
| `--nsu-gold` | `#F2A900` | Accent ONLY — awards, "Championship" badges, featured star, CTA underline sparks. Never large fills. |
| `--nsu-text` | `#1C2E4A` | Body text on light |
| `--nsu-slate` | `#5B6E8C` | Secondary text, captions, meta |
| `--nsu-line` | `#D9E5F3` | Hairline borders on light |
| `--nsu-linet-dark` | `#1E3A66` | Hairline borders on dark |
| `--white` | `#FFFFFF` | Cards, text on dark |

**Gradients:**
- `hero-gradient`: radial `rgba(61,143,224,0.25)` at 70% 20% over `#061A3A → #0A2A5E` linear.
- `card-sheen`: linear 135° `rgba(255,255,255,0.06) → transparent 40%` (dark cards).
- `gold-flare`: linear 90° `#F2A900 → #FFD166` — only for the award ribbon and one hero stat underline.

**Semantic states:** success `#2E9E6B`, error `#D64550` (form validation only).

**Accessibility:** body text contrast ≥ 4.5:1. `--nsu-sky` on `--nsu-ice` is decoration-only, never text.

---

## 3. Typography

Google Fonts: **Sora** (headings/display), **Inter** (body/UI), **JetBrains Mono** (eyebrows, meta, code, CMS docs).

| Role | Font | Size / Weight / Tracking |
|---|---|---|
| Display (hero H1) | Sora | clamp(2.75rem, 6vw, 5rem) / 700 / -0.03em / line-height 1.02 |
| H2 (section) | Sora | clamp(2rem, 3.6vw, 3rem) / 700 / -0.02em / 1.1 |
| H3 (card title) | Sora | 1.375rem / 600 / -0.01em / 1.25 |
| Eyebrow | JetBrains Mono | 0.75rem / 500 / +0.22em / UPPERCASE, `--nsu-blue` (light) or `--nsu-sky` (dark) |
| Body | Inter | 1.0625rem / 400 / 1.7 |
| Body small / meta | Inter | 0.875rem / 400–500 / 1.6, `--nsu-slate` |
| Button / nav | Inter | 0.9375rem / 600 / +0.01em |
| Code / file paths | JetBrains Mono | 0.875rem / 400, on `--nsu-ice` (light) or `#0D2C5A` (dark) |
| Stat numerals | Sora | clamp(2.5rem, 5vw, 4rem) / 700, tabular-nums |

**Rules:** Max measure 68ch for body. Headings never all-caps (except eyebrows). Numbers in stats use `font-variant-numeric: tabular-nums`. Long file paths break with `overflow-wrap:anywhere`.

---

## 4. Spacing, Layout, Shape

- **Spacing scale:** Tailwind defaults; section padding `py-24 md:py-32`; generous `py-40` for dark "moment" sections.
- **Container:** `max-w-7xl` (1280px), `px-5 md:px-8`. Reading container (news articles, contribute docs) `max-w-3xl`.
- **Grid:** 12-col desktop; cards at 3-up (projects/people), 2-up (news featured), 1-up mobile.
- **Radius:** cards `rounded-2xl` (16px); buttons `rounded-full` pills; small chips `rounded-md` (6px); images inside cards `rounded-xl` (12px).
- **Borders:** 1px `--nsu-line` hairlines on light; 1px `--nsu-linet-dark` on dark. Blueprint cards get crosshair `+` pseudo-elements at all four corners (12px, `--nsu-line`).
- **Shadows:** Light elevation only: `shadow-[0_1px_2px_rgba(10,42,94,0.06),0_8px_24px_-8px_rgba(10,42,94,0.12)]` on hover; none at rest (hairlines do the work).
- **Breakpoints:** sm 640 / md 768 / lg 1024 / xl 1280. Mobile-first everywhere.

---

## 5. Animation System

**Libraries:** Lenis (smooth scroll), GSAP + ScrollTrigger (scroll storytelling), Framer Motion (micro-interactions, page transitions), React Three Fiber (hero canvas only).

**Global motion language:**
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` ("precision ease") for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for exits. Spring only for drag/hover (Framer default `stiffness 300, damping 30`).
- **Duration:** entrances 0.7–0.9s; micro 0.2–0.3s; page transitions 0.45s.
- **Default reveal (apply to every content section):** block-level — `y:40 → 0, opacity 0 → 1, duration 0.8s, stagger children 0.1s, trigger at 20% viewport, once:true`.
- **Kinetic typography:** hero H1 animates at word level (`yPercent 110 → 0` inside overflow-hidden masks, 0.06s stagger); H2s at word level; body never splits.
- **Hero canvas:** Three.js particle field — ~600 drifting nodes in navy/space, connected by hairlines when within threshold (swarm topology motif). Nodes gently repel the cursor. DPR-capped, paused when offscreen, `prefers-reduced-motion` → static constellation image.
- **Scroll storytelling:** About page innovation cycle pins for ~600vh, driving a 6-stage progress ring. Home page uses a horizontal-scroll featured-projects band (pins for 200vh on desktop; native horizontal scroll-snap on mobile).
- **Ambient loops (max 1 per viewport):** orbit-ring rotation 24s linear infinite; pulse-dot opacity 0.4↔1 2.4s; gradient drift on hero.
- **Hover micro-interactions:** cards lift `translateY(-6px)` + sheen sweep + image scale 1.04 (0.5s); buttons arrow icon slides 4px; links show underline grow left→right (0.3s).
- **Page transitions:** Framer `AnimatePresence` — outgoing `opacity 0, y -12` (0.25s), incoming `opacity 0→1, y 16→0` (0.45s, delay 0.1s). Scroll resets to top.
- **Reduced motion:** `prefers-reduced-motion` disables Lenis, pins, splits, and canvas; all content visible with simple opacity fades.

**Performance guardrails:** ≤8 simultaneous animating elements per viewport; one heavy effect per section; images lazy-loaded with blur-up; canvas `frameloop="demand"`.

---

## 6. Cursor, Scroll, Sound

- **Cursor:** default system cursor; interactive elements show `cursor-pointer`. A 24px soft dot follower (mix-blend-difference, white) appears on desktop only for the hero and horizontal-scroll band; hidden on touch devices.
- **Scroll:** Lenis smooth scroll (`lerp 0.09`, `wheelMultiplier 0.95`). Scroll progress hairline (2px, `--nsu-sky`) fixed under the navbar.
- **Sound:** none.

---

## 7. File-Based CMS Architecture (core requirement)

> This is the heart of the build. The site reads structured files at build/dev time; nobody edits React code to add content. Everything below must also be documented in-site on the **Contribute** page.

### 7.1 Folder structure

```
/
├── content/                      ← ALL site content lives here (human-edited)
│   ├── people/                   one .md per person
│   │   ├── dr-shahnewaz-siddique.md
│   │   └── …
│   ├── projects/                 one folder per project
│   │   ├── nirobot/
│   │   │   ├── nirobot.md        frontmatter + long-form body
│   │   │   └── (optional extra .md pages: results.md, media.md)
│   │   └── …
│   ├── publications/             one .md per publication
│   │   └── 2025-autonomous-delivery-robot.md
│   ├── news/                     one .md per news post
│   │   └── 2025-07-10-bear-summit-championship.md
│   ├── gallery/                  one .md per photo/album entry
│   │   └── 2025-03-20-workshop-hands-on.md
│   ├── achievements/             one .md per award/milestone
│   │   └── 2025-bear-summit-championship.md
│   └── site.yml                  global settings: lab name, tagline, email, address, socials, nav, stats overrides
├── public/
│   └── assets/
│       ├── placeholders/         generic placeholder images (see §10)
│       ├── people/               firstname-lastname.jpg  (400×400)
│       ├── projects/             slug-hero.jpg (1600×900), slug-*.jpg extras
│       ├── news/                 slug.jpg (1200×675)
│       ├── gallery/              slug.jpg (1200×900)
│       └── brand/                logo.svg, nsu-mark.svg, favicons
├── templates/                    downloadable blank templates (also rendered on Contribute page)
│   ├── person-template.md
│   ├── project-template.md
│   ├── publication-template.md
│   ├── news-template.md
│   ├── gallery-template.md
│   └── achievement-template.md
└── src/
    ├── lib/content/              the data pipeline (see 7.3)
    ├── components/
    ├── pages/
    └── types/                    zod schemas = the "contract" of every content type
```

### 7.2 File formats (frontmatter contracts)

All content files are **Markdown with YAML frontmatter**. Unknown/missing optional fields fall back gracefully; invalid required fields surface a **build-time warning panel** (and in dev, an in-browser "content issues" toast) naming the file — never a silent crash.

**Person** (`content/people/{slug}.md`) — slug = `firstname-lastname`, kebab-case:
```yaml
name: "Dr. Shahnewaz Siddique"        # required
role: "Associate Professor & Lab Director"  # required
category: founding_faculty            # required: founding_faculty | affiliated_faculty | ra | student | alumni
order: 1                              # optional, sort within category
email: shahnewaz.siddique@northsouth.edu
phone: "+88 02 55668200 Ext – 1515"   # optional
office: "SAC 1019"                    # optional
image: /assets/people/shahnewaz-siddique.jpg   # optional → placeholder if missing
website: https://…                    # optional
scholar: https://…                    # optional
linkedin: https://…                   # optional
research_interests: "Controls, Robotics, Intelligent Systems, AI, Modeling and Simulation"
```
Body: free markdown (bio, education list, research focus) rendered on the person detail view.

**Project** (`content/projects/{slug}/{slug}.md`):
```yaml
title: "NIRO Educational Bot"         # required
description: "One-liner for cards"    # required, ≤140 chars
status: Active                        # Active | Completed | Concept
featured: true                        # shows in home horizontal band
order: 1
image: /assets/projects/nirobot-hero.jpg      # optional → placeholder
duration: "October 2024 - Present"
funding: "University Research Grant"  # optional
areas: ["AI-driven robotics", "Edge AI computing"]  # links to research-area filters
team: ["Dr. Shahnewaz Siddique", "Nasim Mahmud Mishu"]   # matched to people by name → auto-links
links: { github: "…", demo: "…", paper: "…" }  # all optional
```
Body: markdown with `## Overview / ## Objectives / ## Methodology / ## Current Progress` — rendered with TOC on the project detail page.

**Publication** (`content/publications/{slug}.md`):
```yaml
title: "…"                # required
authors: ["Khan, S. A.", "Siddique, S."]   # required
venue: "BEAR Summit 2025" # required
year: 2025                # required
type: conference          # journal | conference | workshop | preprint
areas: ["Autonomous robotics"]
doi: …  pdf: …  code: …  # optional
abstract: "2–4 sentences" # optional
```
Optional sibling `{slug}.bib` is picked up automatically and offered as "Cite (BibTeX)" download/copy.

**News** (`content/news/{YYYY-MM-DD-slug}.md`): frontmatter `title` (required), `date` (required, must match filename), `summary`, `image`, `tags`, `pinned: false`. Date in filename drives ordering automatically.

**Gallery** (`content/gallery/{slug}.md`): `title`, `date`, `category: lab | events | research | team`, `image` (required here), `alt`, `credit` optional.

**Achievement** (`content/achievements/{slug}.md`): `title`, `date`, `rank: "Champion | Top 3 | Finalist"`, `event`, `project` (slug link), `image`, `summary`.

**`content/site.yml`** controls: lab name, short name, tagline, established date, email, address, social links, navbar order, home stats numbers, and toggles (e.g. `showAchievementsSection: true`).

### 7.3 Data pipeline (`src/lib/content/`)

1. **Discovery:** `import.meta.glob('/content/**/*.md', { eager: true })` at build time (Vite) — adding a file to the correct folder is the *only* step needed. Dev server hot-reloads on file add/edit.
2. **Parsing:** frontmatter extracted with `gray-matter`; body rendered with a shared markdown pipeline (GFM tables, typographer, external-link decoration).
3. **Validation:** zod schemas per collection. Valid → typed collection. Invalid → skipped with a descriptive warning (dev overlay + build log) telling the contributor exactly which field failed.
4. **Image resolution:** each entry's `image` field is checked against `/public/assets/**`. Missing → typed placeholder (`/assets/placeholders/person.svg` etc.) so the layout never breaks; replacing the real file at the **same path** instantly swaps it in, no code change.
5. **Derivations (automatic):** people grouped by `category`; projects split `featured`/all; news sorted by date desc with `pinned` first; achievements merged into a "Honors" strip on Home + badge on matching project; team names on projects auto-linked to people pages by exact-name match; publication years → filter facets; `readingTime` for news; sitemap counts.
6. **Type-safety:** collections exported as typed hooks: `usePeople()`, `useProjects()`, `useNews()`, etc. Pages only ever consume validated data.

### 7.4 Placeholder strategy

- Every image slot has a designed SVG placeholder (see §10): abstract blueprint-style composition with the orbit-ring motif, labeled subtly ("NIRO Lab · placeholder"). Person placeholders show initials derived from the `name` field over a navy gradient; project placeholders derive a hue from the slug hash.
- Swap rule documented everywhere: *"Put your image at the exact path shown in the template field — the website updates itself."*
- Template files ship pre-filled with the correct target paths so contributors literally replace one file.

---

## 8. Shared Components

### 8.1 Navbar
- Fixed, `backdrop-blur` over `rgba(6,26,58,0.72)` dark glass (always dark, even over light sections — institutional anchor). 72px tall.
- Left: NIRO mark (orbit-ring logomark) + wordmark "NIRO Lab" (Sora 700) + tiny mono caption "NSU · Robotics".
- Center/right links: Home · About · Research · People · Projects · Publications · News · Gallery · Contact. (Contribute lives in footer + a small "＋ Submit content" ghost button on the right.)
- Active link: `--nsu-sky` dot above + white text; inactive `slate-300` → white on hover with underline-grow.
- Right cluster: "Contribute" outline pill (sky border) + mobile hamburger.
- Scroll behavior: on scroll down >200px the bar compresses to 60px and gains `border-b` hairline; hide-on-fast-scroll-down, reveal on scroll-up (Framer `useScroll`).
- **Mobile:** full-screen drawer from right — navy panel, links stagger in (`x:24→0, 0.05s stagger`), big Sora numerals `01–09` beside links, contact info + socials at bottom, close button rotates 90° on tap.

### 8.2 Footer
- Deep ink background with node-and-wire constellation motif (SVG, low opacity) + giant watermark wordmark "NIRO" at 6% opacity.
- 4 columns: (1) brand blurb + NSU affiliation line + socials (GitHub, LinkedIn, Facebook, YouTube, mail); (2) Explore links; (3) Content system links (Contribute guide, Templates download, Content status); (4) Contact block (address, email, office hours).
- Bottom bar: `© 2025 NIRO Lab — North South University` · "Built with a file-based CMS" note · back-to-top pill (appears after 600px, Framer spring).
- CTA band above footer on every page except Contribute: navy gradient card — "Want to collaborate with NIRO Lab?" + gold underlined email link + outline button "See how to contribute".

### 8.3 Component library (shared, shadcn/ui-based)
- **Button:** primary (navy→blue gradient fill, white text, pill), secondary (white/ice, navy text, hairline), ghost-sky (dark sections). All: arrow icon slides on hover, active scale 0.97.
- **Chip/Tag:** ice bg, blue text, `rounded-md`, mono 11px — used for areas, categories, status (Active = blue dot pulse; Completed = solid; Concept = dashed border).
- **SectionHeader:** eyebrow (mono, `// ` prefix) + H2 + optional right-side link ("View all →"). Animated: eyebrow line draws in (scaleX 0→1, 0.5s) then H2 words rise.
- **PersonCard / ProjectCard / NewsCard / PubItem / AchievementBadge / GalleryTile** — per-page docs specify variants; all share: hairline border, crosshair corners, hover lift + sheen, image scale 1.04, Framer `layoutId` for grid↔detail transitions.
- **Modal (Person detail):** center dialog, backdrop blur, content slides up 24px with 0.35s; ESC/scrim close; focus-trapped.
- **Lightbox (Gallery):** full-screen ink scrim, image scales from tile via `layoutId`, arrows + keyboard nav, caption bar.
- **FilterBar:** sticky-under-nav filter pills with animated active pill (`layoutId` background), count badges, slide-down reveal of results with `AnimatePresence` stagger.
- **Stat:** tabular numeral counting up on enter-view (GSAP `snap`, 1.6s) + mono caption.
- **EmptyState:** orbit-ring SVG + "No entries yet — this section is powered by content files." + button linking to the relevant Contribute anchor. **Critical:** Publications and Gallery ship with graceful designed empty states, since legacy content is empty there.
- **ContentHealthBadge (dev only):** fixed corner pill listing invalid content files with reasons; hidden in production.

### 8.4 SEO / meta
- `site.yml` drives title template `"%s — NIRO Lab | NSU"`, OG image (generated placeholder card), JSON-LD `ResearchOrganization` on About, `ScholarlyArticle` stubs on publications.

---

## 9. Page List

| # | File | Route | Purpose |
|---|---|---|---|
| 1 | `home.md` | `/` | Cinematic hero, mission, stats, innovation-cycle teaser, featured projects horizontal band, research areas, honors strip, latest news, CTA |
| 2 | `about.md` | `/about` | Lab story, scroll-pinned 6-stage Innovation Cycle, vision & mission pillars, research areas detail, leadership teaser |
| 3 | `people.md` | `/people` | Filterable member directory (5 category tabs), person cards + detail modal, alumni row |
| 4 | `projects.md` | `/projects` + `/projects/:slug` | Featured carousel, filterable project grid, rich project detail template with TOC |
| 5 | `publications.md` | `/publications` | Year/area/type filters, search, grouped list, BibTeX copy, designed empty state |
| 6 | `news.md` | `/news` + `/news/:slug` | Pinned + timeline news index, article template with share/progress |
| 7 | `gallery.md` | `/gallery` | Masonry grid, category filters, lightbox, designed empty state |
| 8 | `contact.md` | `/contact` | Contact cards, map, collaboration pathways, join-the-lab CTA |
| 9 | `contribute.md` | `/contribute` | The CMS handbook: how the system works, folder map, per-type templates with copy buttons, naming rules, image specs, FAQ |

---

## 10. Assets Manifest

> All are **placeholders by design** (per user requirement) — implementation generates branded placeholder art; real photos later replace files at identical paths. Filenames below are what the site references.

| Filename | Description (generation prompt) | Location | Dimensions | Type |
|---|---|---|---|---|
| `logo.svg` | NIRO logomark: a thin 1.5px orbit ring (circle) in `#3D8FE0` tilted 18°, one small filled satellite dot `#F2A900` at top-right of ring, enclosing a bold geometric "N" built from circuit traces in `#1B5FAA`; flat vector, clean, academic-modern | Navbar, footer, favicon | vector | SVG |
| `nsu-mark.svg` | Simplified university affiliation mark: small rounded-square badge in `--nsu-navy` with white serif-ish "NSU" letters, subtle gold underline — used as a small affiliation chip next to NIRO logo | Footer, About | vector | SVG |
| `hero-constellation-fallback.png` | Static fallback for the hero particle canvas: deep navy `#061A3A→#0A2A5E` gradient with a sparse constellation of small glowing sky-blue dots connected by hairline segments (robot swarm topology), faint blueprint grid, soft radial glow top-right | Home hero (reduced-motion / mobile low-power) | 1920×1080 16:9 | Image |
| `placeholders/person.svg` | Portrait placeholder: navy-to-blue vertical gradient, centered orbit-ring motif in 10% white, large Sora initials slot (dynamically overlaid at runtime), subtle blueprint grid, tiny mono caption "NIRO LAB · PHOTO PLACEHOLDER" bottom | People cards, team lists | 400×400 1:1 | SVG |
| `placeholders/project.svg` | Project hero placeholder: dark navy blueprint scene — grid, crosshair ticks, an outlined isometric robot-rover wireframe in `#3D8FE0` 60% opacity, orbit ring top-right, caption "PROJECT IMAGE PLACEHOLDER" | Project cards/detail heroes | 1600×900 16:9 | SVG |
| `placeholders/news.svg` | News placeholder: lighter ice-blue background, navy orbit ring + abstract megaphone/ribbon geometric shapes in blue/gold, caption "NEWS IMAGE PLACEHOLDER" | News cards, article heroes | 1200×675 16:9 | SVG |
| `placeholders/gallery.svg` | Gallery placeholder: navy gradient, white 8% blueprint grid, centered aperture/hexagon outline in sky blue, caption "GALLERY PLACEHOLDER" | Gallery tiles | 1200×900 4:3 | SVG |
| `placeholders/achievement.svg` | Award placeholder: deep navy field, gold laurel + medal line-art center, caption "ACHIEVEMENT PLACEHOLDER" | Honors strip, achievement cards | 800×600 4:3 | SVG |
| `placeholders/map.svg` | Stylized campus map placeholder: light ice background, navy road/grid lines, one gold location pin over "North South University, Bashundhara", subtle contour rings | Contact page | 1600×900 16:9 | SVG |
| `about-lab-space.jpg` | Photographic placeholder with realism: wide shot of a modern university robotics lab — workbenches with 3D printers, a small differential-drive robot, students blurred in background, cool blue lighting, shallow depth of field, photorealistic render style, no readable text | About page story section | 1600×1000 16:10 | Image |
| `innovation-cycle-icon-1..6.svg` | Six minimal line icons (1.5px stroke, sky blue on transparent): (1) cube-in-brackets Modelling & Simulation, (2) compass+ruler Design, (3) 3D-printer nozzle Fabrication, (4) interlocking parts Assembling, (5) code brackets with gear Software Development, (6) checklist with waveform Physical Testing | About innovation cycle, Home teaser | vector | SVG |
| `research-area-icon-1..8.svg` | Eight minimal 1.5px line icons matching the 8 research areas: (1) neural-node AI brain, (2) three linked drones Multi-Robot Systems, (3) chip with signal Edge AI, (4) robot with radar ring Autonomous/Context-aware, (5) quad-rotor + wave Aerial & Underwater, (6) branching decision tree Adaptive decision-making, (7) gaussian curve with nodes Uncertainty quantification, (8) cloud + chain + devices IoT/Edge/Cloud/Blockchain | About, Home research areas, project filters | vector | SVG |
| `og-image.png` | Social share card: navy gradient, NIRO orbit logo, Sora headline "NSU Intelligent Robotics Lab", mono tagline, blueprint grid, gold accent dot | Site-wide meta | 1200×630 | Image |

*No video assets required. All raster images: export WebP with PNG/JPG fallback; SVGs optimized through SVGO.*

---

## 11. Content Seeding (migration of legacy content)

The implementation seeds the CMS from legacy content (already inventoried):
- **16 people** files (2 founding faculty, 4 affiliated faculty, 3 RAs, ~10 students, 1 alumni entry) — real bios/education from legacy frontmatter; all images → `placeholders/person.svg` paths initially.
- **8 projects** with full overview/objectives/methodology bodies (NiroBot & NSU AI-SAT `featured: true`).
- **6 news posts** (Mar–Nov 2025, incl. BEAR Summit championship & NSU AI & Robotics Day).
- **2 achievements** (BEAR Championship, NIRO EDU BOT Top 3) to power the Honors strip.
- **Publications & gallery** start empty → showcase the designed EmptyState + Contribute CTA (this is intentional product behavior, not a gap).
- `site.yml` filled with real lab identity data.
