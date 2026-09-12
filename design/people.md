# People Page — `/people`

**Goal:** A directory that makes 16+ members feel like a serious research group, with rich person profiles — fully driven by `content/people/*.md`. Adding a member = dropping one file (+ optional photo).

**Data sources:** `content/people/*.md`, grouped/sorted by `category` + `order`. Images resolve from `/assets/people/` else `placeholders/person.svg` (with initials overlay).

---

## Section 1 — Page hero (dark, compact)

- Eyebrow `// THE PEOPLE`, H1 "The minds behind NIRO." (word-mask rise)
- Sub: "Faculty, researchers, and students building intelligent machines at North South University."
- Live count chips (auto-derived): `2 FOUNDING FACULTY` · `4 AFFILIATED FACULTY` · `3 RESEARCH ASSISTANTS` · `N STUDENTS` · `ALUMNI`.

**Animation:** standard hero sequence; chips count up/pop with 0.06s stagger.

---

## Section 2 — Filter bar (sticky)

**Layout:** sticky below navbar (top offset 60px, backdrop-blur light glass, hairline bottom). Category pills with animated active background (`layoutId`): **All · Founding Faculty · Affiliated Faculty · Research Assistants · Students · Alumni**, each with count badge. Right side: search input (filters by name/interest, 200ms debounce, expands on focus 180→260px).

**Animation:** bar slides down `y -8→0` on page entry; results re-grid with Framer `AnimatePresence` + `layout` (cards animate to new positions, 0.4s precision ease); non-matching cards exit `scale 0.9, opacity 0` (0.2s).

---

## Section 3 — Category sections / filtered grid (light)

**Layout:** when "All" selected, people render under labeled category subsections (subsection header: mono category label + count + hairline). When a filter is active, one flat grid. Grid: 4-up xl / 3-up lg / 2-up sm / 1-up mobile.

**PersonCard:**
- Top: square portrait (placeholder with runtime initials, e.g. "SS" for Shahnewaz Siddique, navy→sky gradient chosen by name hash). Crosshair corners.
- Body: name (Sora 600), role (Inter small, slate), 2 research-interest chips max (+n more), category tag.
- Founding faculty variant: slightly taller card with gold hairline top and "Director"/"Co-Director" badge.
- Alumni variant: 60% scale-down treatment — compact horizontal rows instead of cards (portrait 56px circle + name + role + years).
- Hover: lift `translateY(-6px)`, portrait overlay "View profile →" slides up, card border turns `--nsu-blue`.

**Animation:** default reveal, stagger 0.05s (capped 12 items per stagger batch).

**Seeded members:** Dr. Shahnewaz Siddique (Assoc. Prof. & Lab Director), Dr. Lamia Iftekhar (Prof. & Co-Director); affiliated: Dr. Md Shahriar Karim, Dr. Riasat Khan, Dr. Mohammad Abdul Qayum, Dr. Fariah Mahzabeen; RAs incl. Saif Ahammod Khan, Nasim Mahmud; ~10 student researchers; alumni: Md. Saif Ahammod Khan (Former RA).

---

## Section 4 — Person detail modal (route-aware: `/people?member=slug`)

**Layout:** center dialog (max-w-3xl, `rounded-2xl`, ink scrim + blur). Structure:

- Header band (navy gradient): large portrait left (160px, rounded-xl, crosshair corners), name H2, role, category tag; icon links row (email, website, scholar, linkedin — only rendered if present in file).
- Body (scrollable, max-h 60vh): rendered markdown from the person's file — bio, **Education** list (degree rows with dot leaders), **Research Focus** paragraphs, **Teaching** if present.
- Sidebar facts column (right, desktop): office, phone, email, full research-interests chip list.
- Close: X top-right (rotates 90° on hover), ESC, scrim click. Prev/Next arrows cycle within the current filtered list (keyboard ←/→).

**Animation:** open — card scales from the clicked grid card via `layoutId` (0.4s), scrim fades 0.25s; body content staggers up 0.05s; close reverses. URL updates (deep-linkable, back-button safe).

---

## Section 5 — Join the lab CTA (light, end of page)

**Layout:** ice panel, split: left text — H3 "Want to research with us?" + line about welcoming motivated students (link to /contact and a mono mailto chip `nirolaboratory@gmail.com`); right: three mini-cards "For students / For collaborators / For industry" with one-line pitches.

**Animation:** default reveal; mailto chip copies on click with a "Copied ✓" tooltip micro-pop (Framer, 0.2s).

---

## CMS notes (surfaced in UI)
- Footer of the grid (subtle, ice text): "This directory updates automatically from `content/people/`. Members: submit your profile via the Contribute guide →" with a small button. Teaches the system without cluttering.
- If a category has zero entries, its pill still renders (count 0) but its subsection is skipped; "All" never breaks.
