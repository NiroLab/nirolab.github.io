# About Page — `/about`

**Goal:** Tell the lab's story with institutional weight, showcase the signature **Innovation Cycle** as the site's centerpiece scroll experience, and present vision, mission pillars, and research areas in depth.

**Data sources:** static copy (story/vision/mission — lab-level identity, lives in page), `content/site.yml` (established date, email), `content/people/*` (leadership teaser), `content/achievements/*` (milestone timeline entries optional).

---

## Section 1 — Page hero (dark, compact)

**Layout:** ~60vh dark hero (`--nsu-ink → --nsu-navy`), blueprint grid + faint orbit rings bottom-right.

- Eyebrow `// ABOUT THE LAB`
- H1 (word-mask rise): "Where creativity meets cutting-edge research."
- Sub: "Officially established in October 2024 at North South University, the NSU Intelligent Robotics Lab (NIRO) is an innovation hub turning theory into tangible, real-world robotic systems."
- Meta chips row: `EST. OCT 2024` · `DEPT. OF ECE` · `NSU, BASHUNDHARA, DHAKA`.

**Animation:** standard hero load sequence (eyebrow line → H1 words → sub/chips fade-up, 0.12s stagger).

---

## Section 2 — Our Story (light, split)

**Layout:** 6/6 split (stack on mobile). Left: `about-lab-space.jpg` in a `rounded-2xl` frame with crosshair corners and a floating caption chip (mono): "NIRO Lab · North South University". Right: reading column.

- Eyebrow `// OUR STORY`, H2 "An innovation hub for intelligent machines."
- Two paragraphs (from legacy about): mission to make robotics research accessible/impactful/future-focused; supported by expert faculty and passionate students, equipped for every development stage — conceptualization → simulation → design → fabrication → assembly → software → testing — delivering solutions while shaping a self-sustaining robotics ecosystem.

**Animation:** image reveals with clip-path `inset(12%)→0` + scale 1.06→1 (0.9s); text column default reveal; subtle image parallax `y ±40` on scroll.

---

## Section 3 — The Robotics Innovation Cycle (pinned scroll story — centerpiece)

**Layout:** full dark (`--nsu-ink`) pinned sequence, ~600vh scroll distance. Screen splits:

- **Left 40% (sticky within pin):** current stage panel — giant ghost numeral (Sora 800, 10rem, 6% white) behind; stage index mono `STAGE 03 / 06`; stage name H2; 2-sentence description; small chip showing flow position.
- **Right 60%:** large circular cycle diagram (SVG, ~520px): 6 nodes with `innovation-cycle-icon-1..6.svg` evenly on a ring, joined by a dashed circular arc; a **gold progress dot** travels the arc as scroll advances; completed segments draw solid sky; a center label shows "ITERATE ↺" reminding it's a loop.

**The six stages (content):**
1. **Modelling & Simulation** — computational modeling validates concepts before physical build, minimizing risk and optimizing designs.
2. **Design** — detailed mechanical & electronic design, optimized for performance and manufacturability.
3. **Fabrication** — in-house 3D printing, CNC machining, and manufacturing techniques.
4. **Assembling** — careful integration of components with attention to tolerances and system architecture.
5. **Software Development** — control algorithms, perception systems, AI-driven decision-making.
6. **Physical Testing** — real-world validation feeds insights back for continuous refinement.

**Animation (ScrollTrigger scrub, pin 600vh):**
- Stage transitions: outgoing panel `y -40, opacity →0` (0.3 of each segment), incoming `y 40→0, opacity 0→1`; ghost numeral cross-fades with 0.1 overlap.
- Arc progress dot moves 60° per stage; segment stroke draws (`stroke-dashoffset`) through each segment; active node icon fills `--nsu-sky` and pulses once.
- On the final stage, a ring-complete flash (0.4s) and the center "ITERATE" label scales 1→1.15→1, then the section unpins; the whole ring shrinks to 70% and docks into the following section as a summary graphic.
- Mobile (<md): no pin — vertical accordion of the 6 stages with the mini ring as sticky header; each stage reveals with default reveal.

---

## Section 4 — Vision (light, statement)

**Layout:** centered max-w-4xl, big Sora statement with inline gold-underlined phrase:

- Eyebrow `// OUR VISION`
- Statement: "To be the cornerstone of a **self-sustaining robotics ecosystem** in Bangladesh — bridging academic research and industrial application, and positioning NSU as a central hub where 'impossible' ideas are rebuilt into intelligent solutions."
- Below: small node-and-wire SVG flourish.

**Animation:** word-by-word opacity scrub highlight (same as home mission strip); flourish draws in.

---

## Section 5 — Mission Pillars (ice, 5 cards)

**Layout:** `--nsu-ice`, 5 cards in a 3+2 asymmetric grid (2-col mobile → 1). Each: numbered mono index, Sora 600 title, 1–2 line description:

1. **Research Excellence** — cutting-edge robotics & AI research addressing real-world challenges.
2. **Education & Training** — exceptional research training and mentorship at all levels.
3. **Collaboration** — partnerships with industry, government, and academia, locally and internationally.
4. **Innovation** — translating research into practical applications that benefit society.
5. **Community Building** — an inclusive environment that inspires creativity and excellence.

**Animation:** default reveal, stagger 0.08s, cards `y 40→0` + `scale 0.97→1`; hover lift + blue top-border draw (scaleX, 0.35s).

---

## Section 6 — Research Areas (dark, deep-dive) `{#areas}`

**Layout:** navy section, anchor `#areas`. Header + 8 rows in an expandable accordion list (not tiles — this is the detailed view vs home's teaser):

- Row: index mono (01–08) + `research-area-icon-N.svg` + area name (Sora 600, 1.25rem) + chevron.
- Expanded: 2–3 line description of the lab's focus in that area + chips listing related projects (auto-derived by matching `areas` in project files; empty → "Projects coming soon" mini-note linking to Contribute).
- Areas: AI-driven robotics · Multi-Robot Systems · Edge AI computing for robotic systems · Autonomous & context-aware robotics · Aerial & Underwater Robotics · Adaptive decision-making in robotics · Uncertainty quantification & inference · IoT / Edge / Cloud / Blockchain integration in robotics.

**Animation:** rows stagger in; accordion height animates with Framer `AnimatePresence` (0.35s precision ease); icon rotates 90°→0 on open; only one row open at a time.

---

## Section 7 — Leadership teaser (light)

**Layout:** SectionHeader (`// LEADERSHIP`, "Guided by experienced faculty", right link "Meet everyone →"). Two large PersonCards (director & co-director, pulled from `category: founding_faculty`, `order 1–2`): portrait placeholder with initials, name, role, research interests chips, quick links (mail, scholar, website icons).

**Animation:** cards slide `x ±32→0` from opposite sides, 0.15s offset; chips stagger in on hover-expand.

---

## Section 8 — Milestones mini-timeline (optional, renders from achievements + site.yml)

**Layout:** horizontal hairline timeline, nodes: `Oct 2024 — Lab established`, then one node per achievement file (date + label). Scroll-linked: the timeline fills sky as it enters viewport (scrub over 40% viewport).

---

## Section 9 — Standard CTA band (global footer CTA)

As defined in global doc (collaboration CTA above footer).
