# Contribute Page — `/contribute` (Content Guide / CMS Handbook)

**Goal:** The in-site documentation that lets **non-developers** add people, projects, publications, news, gallery photos, and achievements by filling a template and dropping it in the right folder. This page is a first-class product surface — it *is* the content-management UX.

**Design register:** documentation-clean but on-brand — light background, blueprint grid, JetBrains Mono for all paths/code, sticky section nav, and generous interactive examples. No heavy scroll tricks here; clarity is the feature.

---

## Section 1 — Page hero (dark, compact)

- Eyebrow `// CONTENT GUIDE`, H1 "Add content. No code required." (word-mask rise)
- Sub: "The NIRO Lab website is powered by structured text files. Fill in a template, place it in the right folder — the site detects, validates, and publishes it automatically."
- Three quick-stat chips: `6 CONTENT TYPES` · `0 CODE EDITS NEEDED` · `~5 MIN PER ENTRY`.

**Animation:** standard hero sequence.

---

## Section 2 — How it works (light, 4-step visual)

**Layout:** horizontal 4-step flow (vertical on mobile), steps connected by an animated dashed line that draws as you scroll (scrub):

1. **Pick a template** — download the blank form for your content type (person, project, publication, news, gallery, achievement).
2. **Fill it in** — open in any text editor; follow the field guide inside; delete the instructions block.
3. **Name & place it** — save with the exact filename convention into the matching `content/` folder; put images in `/assets/…` at the path your file references.
4. **Done** — the site rebuilds and your content appears in the right section automatically. Invalid files never break the site — they're skipped with a clear warning.

**Animation:** step nodes pop `scale 0→1` as the line reaches them; each step card lifts on hover.

---

## Section 3 — Folder map (light, interactive diagram)

**Layout:** a styled "file tree" card (mono, ice background, hairline) rendered like an IDE tree with folder/file icons; each content folder is **clickable** → smooth-scrolls to that type's section on this page. Live counts badge beside each folder (e.g. `people/ · 16 files`) — auto-derived from the actual loaded collections, so the page proves the system works.

```
content/
├── people/          → team profiles            [16]
├── projects/        → one folder per project    [8]
├── publications/    → papers & citations        [0]
├── news/            → announcements & events    [6]
├── gallery/         → photos                    [0]
├── achievements/    → awards & milestones       [2]
└── site.yml         → lab-wide settings
public/assets/       → images (same name as in your file)
templates/           → blank forms to download
```

**Animation:** tree rows stagger in 0.04s; hover highlights row + shows tooltip "Jump to guide →".

---

## Sections 4–9 — One block per content type (light, alternating ice/mist)

Anchors: `#people` `#projects` `#publications` `#news` `#gallery` `#achievements`. Each block has an identical, learnable structure (5 sub-parts):

1. **Header row:** type icon + name + "Template" download button (ghost, mono `⬇ person-template.md`) + live count chip.
2. **Field table:** every frontmatter field — name (mono), required/optional chip, description, example value. Required fields get a sky left-tick.
3. **Filled example:** tabbed viewer with two tabs — **"Blank template"** and **"Filled example"** (syntax-tinted mono block, e.g. Dr. Siddique's real person file, NiroBot project file). **"Copy" button** top-right (copies raw text, "Copied ✓" tooltip).
4. **Naming & placement card:** exact convention, e.g.
   - Person → `content/people/firstname-lastname.md`; photo → `public/assets/people/firstname-lastname.jpg` (400×400 JPG, square).
   - Project → `content/projects/my-project/my-project.md`; hero → `public/assets/projects/my-project-hero.jpg` (1600×900).
   - News → `content/news/2025-03-20-my-event.md` (**date in filename controls ordering**); image 1200×675.
   - Publication → `content/publications/my-paper.md` (+ optional `my-paper.bib` — auto-detected for the Cite button).
   - Gallery → `content/gallery/my-photo.md`; photo 1200×900 JPG; category must be one of `lab | events | research | team`.
   - Achievement → `content/achievements/2025-my-award.md`.
5. **"Where it shows up" strip:** mini site-map chips (e.g. Person → People page grid · modal · home leadership · project team strips) with tiny wireframe glyphs.

**Content specifics to include verbatim:**
- Person categories: `founding_faculty | affiliated_faculty | ra | student | alumni`.
- Project statuses: `Active | Completed | Concept`; `featured: true` puts it on the home band.
- Gallery categories list; achievement `rank` values: `Champion | Top 3 | Finalist`.
- The **8 research-area names** exactly as used in `areas:` fields (so facets always match).

**Animation:** blocks reveal with default reveal; example viewer slides `y 24→0`; tab switches cross-fade 0.25s; copy button check micro-pop.

---

## Section 10 — Image rules (navy band)

Dark band, 3 cards:
1. **Sizes** — table of every image spec (profile 400×400 · project 1600×900 · news 1200×675 · gallery 1200×900 · JPG; PNG ok for diagrams).
2. **Placeholders** — "Missing image? A designed placeholder appears automatically. Replace the file at the exact same path later — the site swaps it in, nothing else to touch." + side-by-side visual of placeholder → real photo morph (hover toggles with a wipe animation).
3. **Formats & weight** — keep under ~500KB; GIF allowed for project demos (e.g. `nirobot.gif`).

**Animation:** cards stagger; placeholder→photo wipe uses clip-path on hover.

---

## Section 11 — Submission & workflow (light)

Two pathway cards:
- **With repository access:** drop files into the folders and commit — the site rebuilds on deploy. (One-line, for techies.)
- **Without access:** ZIP your `.md` + images and email to `nirolaboratory@gmail.com` with subject `NIRO Website – [Name] – [Content Type]` (example subjects listed, mono). The coordinator places the files.

Plus a **checklist card** (interactive checkboxes, persist in localStorage): "Filled all required fields ▢ Deleted instructions block ▢ Correct filename ▢ Image at referenced path ▢ Image under 500KB ▢".

**Animation:** checklist items strike-through with a draw animation when checked; progress mini-ring fills.

---

## Section 12 — Safety net + FAQ (light)

- **Safety net explainer:** invalid files are skipped, never fatal — during development the site lists exactly what's wrong ("`content/people/jane-doe.md`: missing required field `category`"). Designed "content issues" panel screenshot-style mock (mono, ice card).
- **FAQ accordion** (5 items): What if I make a mistake? · How do I update/remove an entry later? (edit or delete the same file) · Can I use Word/Google Docs? (no — plain text; tips provided) · How do I add a brand-new section type? (contact the maintainer — new collections are a code task; everything else isn't) · Who reviews submissions?

**Animation:** accordion per global spec (0.35s, one-open-at-a-time).

---

## Section 13 — Download-all CTA (navy, end)

Panel: orbit-ring motif + H3 "Get the full template pack" + primary button "Download all templates (.zip)" + ghost "Email the coordinator". Mono note: "Templates also live in `/templates/` in the repository."

**Animation:** default reveal; button arrow slide.
