# NIRO Lab Website

Official website of the **NSU Intelligent Robotics Lab (NIRO Lab)** - Department of Electrical and Computer Engineering, North South University, Bashundhara, Dhaka-1229, Bangladesh.

**Live site:** https://nirolab.github.io/
**Contact:** nirolaboratory@gmail.com

Built with React 19 + TypeScript + Vite 7 + Tailwind CSS 3.4 + shadcn/ui, with GSAP, Framer Motion, Lenis, and Three.js (React Three Fiber) for motion and the hero canvas.

---

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
```

## Production Build

```bash
npm run build      # outputs static site to dist/
```

## Deployment (GitHub Pages)

The repo deploys automatically via `.github/workflows/deploy.yml`: every push to `main` builds the site and publishes it to GitHub Pages. Requirements:

1. The repository must be named `nirolab.github.io` under the `nirolab` account/organization (this is what serves the site at the root URL).
2. Repo **Settings → Pages → Source** must be set to **GitHub Actions**.

`public/404.html` plus a small script in `index.html` implement the SPA fallback so deep links (e.g. `/projects/nirobot`) work on GitHub Pages.

---

# Content Management Guide

**All website content lives in plain text files. You never edit code to add or update content.**

The site reads Markdown files with YAML frontmatter from the `content/` folder at build time. To add or change anything on the site:

1. **Get the template** for the content type (see `public/templates/` - also listed below).
2. **Fill it in** using any text editor (Notepad, VS Code, TextEdit…).
3. **Place the file** in the correct folder (and the image at the exact path the file references).
4. **Commit & push** (or send it to the site coordinator) - the site rebuilds and the new content appears automatically.

If a file has an error, it is **skipped with a named warning** - it can never break the site.

## Folder Structure

```
content/
├── people/                   one .md per member          e.g. dr-shahnewaz-siddique.md
├── projects/                 one FOLDER per project      e.g. nirobot/nirobot.md
├── publications/             one .md per publication     e.g. 2022-alpha-n-delivery-robot.md
│                             (optional sibling .bib file for BibTeX citation)
├── news/                     one .md per post            e.g. 2025-07-10-bear-summit-championship.md
├── gallery/                  one .md per photo           e.g. 2025-03-20-workshop-hands-on.md
├── achievements/             one .md per award           e.g. 2025-bear-summit-championship.md
└── site.yml                  global settings (lab name, tagline, email, stats, socials, nav)

public/
├── assets/
│   ├── people/               member photos        {slug}.jpg        400×400
│   ├── projects/             project images       {slug}-hero.jpg   1600×900
│   ├── news/                 news images          {slug}.jpg        1200×675
│   ├── gallery/              gallery photos       {slug}.jpg        1200×900
│   └── placeholders/         automatic fallbacks - do not edit
└── templates/                blank fill-in templates for every content type
```

## Naming Conventions

- All file names are **kebab-case** (lowercase, hyphens): `firstname-lastname.md`
- **People:** `content/people/{firstname-lastname}.md`
- **Projects:** `content/projects/{slug}/{slug}.md` - the project gets its own folder (extra files like `results.md` can live beside it)
- **News:** `content/news/{YYYY-MM-DD-slug}.md` - the date in the filename must match the `date` field and drives ordering automatically
- **Publications / Gallery / Achievements:** `content/{type}/{slug}.md`
- **Images:** placed at the exact path written in the file's `image:` field

## Images & Placeholders

- Every image slot has a designed placeholder. If the image file does not exist yet, the placeholder is shown automatically - the layout never breaks.
- **To swap in a real photo:** save it at the exact path in the file's `image:` field (e.g. `public/assets/people/shahnewaz-siddique.jpg`). Nothing else changes.
- Recommended sizes: person **400×400** (square), project hero **1600×900**, news **1200×675**, gallery **1200×900**, achievement **800×600**. JPG/PNG, ideally under ~500 KB.

## Content Type Reference

### Person - `content/people/{slug}.md`

```yaml
---
name: "Dr. Jane Doe"                    # required
role: "Assistant Professor"             # required
category: affiliated_faculty            # required: founding_faculty | affiliated_faculty | ra | student | alumni
order: 1                                # optional - sort order within the category
email: jane.doe@northsouth.edu          # optional
phone: "+88 02 55668200 Ext - 6000"     # optional
office: "SAC 1000"                      # optional
image: /assets/people/jane-doe.jpg      # optional - placeholder shown if missing
website: https://…                      # optional
scholar: https://…                      # optional (Google Scholar)
linkedin: https://…                     # optional
research_interests: "Robotics, AI"      # optional, comma-separated
---

Free markdown biography: education, research focus, teaching, experience…
```

### Project - `content/projects/{slug}/{slug}.md`

```yaml
---
title: "NIRO Educational Bot"           # required
description: "One-line summary for cards (max 200 chars)"   # required
status: Active                          # Active | Completed | Concept
featured: false                         # true → appears in the homepage featured band
order: 1                                # optional
image: /assets/projects/niro-edu-bot-hero.jpg
duration: "October 2024 - Present"
funding: "University Research Grant"    # optional
areas: ["AI-driven robotics"]           # must match the lab's research areas
team: ["Dr. Shahnewaz Siddique"]        # exact names auto-link to People profiles
links: { github: "…", demo: "…", paper: "…" }   # all optional
---

## Overview
## Objectives
## Methodology
## Current Progress
```

### Publication - `content/publications/{slug}.md`

```yaml
---
title: "Paper Title"                    # required
authors: ["Khan, S. A.", "Siddique, S."]   # required
venue: "Conference / Journal Name"      # required
year: 2025                              # required
type: conference                        # journal | conference | workshop | preprint
areas: ["Autonomous robotics"]          # optional
doi: …  pdf: …  code: …                 # optional
abstract: "2-4 sentences"               # optional
---
```

Optional: add a `{slug}.bib` file next to it - the site offers it as a "Cite (BibTeX)" download automatically.

### News - `content/news/{YYYY-MM-DD-slug}.md`

```yaml
---
title: "News Title"                     # required
date: 2025-07-10                        # required - must match the filename date
summary: "One or two sentences for cards."
image: /assets/news/my-event.jpg
tags: ["award", "event"]                # optional
pinned: false                           # true → featured at the top of News
---

Full news article in markdown.
```

### Gallery - `content/gallery/{slug}.md`

```yaml
---
title: "Photo title"                    # required
date: 2025-07-16
category: events                        # lab | events | research | team
image: /assets/gallery/my-photo.jpg     # required for gallery entries
alt: "Description for accessibility"
credit: "Photo by …"                    # optional
---
```

### Achievement - `content/achievements/{slug}.md`

```yaml
---
title: "Championship Award - BEAR Summit 2025"   # required
date: 2025-07-10
rank: "Champion"                        # e.g. Champion | Top 3 | Finalist
event: "BEAR Summit 2025"
project: autonomous-navigation          # optional - links the badge to a project slug
image: /assets/gallery/bear-summit.jpg  # optional
summary: "Short description of the honor."
---
```

Achievements automatically appear in the homepage Honors strip and as badges on the linked project page.

### Global settings - `content/site.yml`

Lab name, short name, tagline, established date, email, address, social links, navbar order, homepage statistics, and section toggles. Edit values directly; no code changes needed.

## Templates

Ready-to-fill templates with instructions and worked examples live in **`public/templates/`**:

| File | For |
|---|---|
| `person-template.md` | Member profiles |
| `project-template.md` | Research projects |
| `publication-template.md` | Publications |
| `news-template.md` | News posts |
| `gallery-template.md` | Gallery photos |
| `achievement-template.md` | Awards & honors |
| `README.md` | Template kit overview |

## Submission Workflow (for contributors without repo access)

1. Fill in the template; prepare images at the recommended sizes.
2. Zip the `.md` file(s) + image(s).
3. Email to **nirolaboratory@gmail.com** with subject:
   `NIRO Website - [Your Name] - [Content Type]`
   (e.g. `NIRO Website - John Doe - Profile`)
4. The coordinator places the files in the folders above and pushes - done.

## Safety Net

- Invalid files are **skipped**, never fatal. During local development, an on-screen badge lists any content file that failed validation and exactly which field is wrong. Production builds log warnings only.
- Required fields are marked in each template. When in doubt, copy an existing file from the same folder and edit it.

---

## Tech Notes

- **Content pipeline:** `src/lib/content/` - file discovery via Vite `import.meta.glob`, frontmatter parsing with `gray-matter`, validation with zod (`src/types/content.ts`), typed collections consumed by pages.
- **Research areas & innovation cycle copy:** `src/lib/lab-data.ts`.
- **Adding a new content type:** add a zod schema in `src/types/content.ts`, a parser in `src/lib/content/`, a folder under `content/`, and a template in `public/templates/`.

## License

All rights reserved. Content belongs to NIRO Lab, North South University.
