/**
 * Data model for the Contribute page — the in-site CMS handbook.
 * Every field documented here mirrors the zod schemas in
 * src/types/content.ts exactly (the "contract" of each content type).
 */
import type { LucideIcon } from "lucide-react";
import {
  Users,
  Bot,
  BookOpen,
  Newspaper,
  Images,
  Trophy,
} from "lucide-react";

// ---------------------------------------------------------------- types

export type ContentTypeId =
  | "people"
  | "projects"
  | "publications"
  | "news"
  | "gallery"
  | "achievements";

export type CountMap = Record<ContentTypeId, number>;

export interface FieldDoc {
  /** frontmatter field name (mono) */
  name: string;
  /** human type label, e.g. "string", "enum", "string[]" */
  type: string;
  required: boolean;
  description: string;
  /** allowed values for enums / recommended vocabularies */
  allowed?: string[];
  /** points at the 8 official research-area names */
  areasRef?: boolean;
  /** mono example value */
  example: string;
}

export interface NamingRule {
  label: string;
  path: string;
  note?: string;
}

export interface ContentTypeDoc {
  id: ContentTypeId;
  name: string;
  icon: LucideIcon;
  folder: string;
  blurb: string;
  templateFile: string;
  fields: FieldDoc[];
  bodyNote: string;
  blankTemplate: string;
  filledExample: string;
  filledCaption: string;
  naming: NamingRule[];
  showsUp: string[];
  footnote?: string;
}

// ------------------------------------------------------- blank templates

const PERSON_BLANK = `---
# PERSON TEMPLATE — NIRO Lab website
# 1. Fill in every required field below.
# 2. Delete this instructions block.
# 3. Save as: content/people/firstname-lastname.md   (kebab-case)
# 4. Photo (optional): public/assets/people/firstname-lastname.jpg · 400x400 JPG
# ------------------------------------------------------------------
name: ""                       # required — full name, with title
role: ""                       # required — e.g. "Research Assistant"
category: student              # required — founding_faculty | affiliated_faculty | ra | student | alumni
order: 99                      # optional — lower shows first within the category
email: ""                      # optional
phone: ""                      # optional
office: ""                     # optional
image: /assets/people/firstname-lastname.jpg   # optional — placeholder appears if missing
website: ""                    # optional
scholar: ""                    # optional — Google Scholar URL
linkedin: ""                   # optional
research_interests: ""         # optional — comma-separated
---

Short bio in plain markdown — background, education, research focus.
This body appears on the person's detail view.`;

const PERSON_FILLED = `---
name: "Dr. Shahnewaz Siddique"
role: "Associate Professor & Lab Director"
category: founding_faculty
order: 1
email: shahnewaz.siddique@northsouth.edu
office: "SAC 1019"
image: /assets/people/shahnewaz-siddique.jpg
research_interests: "Controls, Robotics, Intelligent Systems, AI, Modeling and Simulation"
---

Dr. Shahnewaz Siddique is an Associate Professor in the Department of
Electrical and Computer Engineering at North South University and the
founding director of the NSU Intelligent Robotics Lab (NIRO Lab).

His research spans control systems, robotics, intelligent systems, and
modeling & simulation, with a focus on turning rigorous theory into
machines that work in the real world.`;

const PROJECT_BLANK = `---
# PROJECT TEMPLATE — NIRO Lab website
# 1. Create a folder:  content/projects/my-project/
# 2. Save this file inside it as:  my-project.md  (same name as the folder)
# 3. Hero image (optional): public/assets/projects/my-project-hero.jpg · 1600x900
# 4. Fill every required field, then delete this instructions block.
# ------------------------------------------------------------------
title: ""                 # required
description: ""           # required — one-liner for cards, max 200 characters
status: Active            # Active | Completed | Concept
featured: false           # true → appears in the home page featured band
order: 99                 # optional — lower shows first
image: /assets/projects/my-project-hero.jpg   # optional — placeholder if missing
duration: ""              # optional — e.g. "October 2024 - Present"
funding: ""               # optional
areas: ["AI-driven robotics"]   # pick from the 8 official research areas
team: [""]                # exact names from people files → auto-linked profiles
links:                    # all optional — delete the lines you don't need
  github: ""
  demo: ""
  paper: ""
---

## Overview

What the project is and why it matters.

## Objectives

- Goal one
- Goal two

## Methodology

How the team approaches it.

## Current Progress

Where things stand today.`;

const PROJECT_FILLED = `---
title: "NIRO Educational Bot"
description: "A low-cost, modular differential-drive robot built for robotics education and autonomous-navigation research."
status: Active
featured: true
order: 1
image: /assets/projects/nirobot-hero.jpg
duration: "October 2024 - Present"
funding: "University Research Grant"
areas: ["AI-driven robotics", "Autonomous & context-aware systems"]
team: ["Dr. Shahnewaz Siddique", "Dr. Lamia Iftekhar"]
links:
  github: "https://github.com/nirolab"
---

## Overview

The NIRO Educational Bot (NIRO EDU BOT) is the lab's flagship teaching
platform: a modular, differential-drive mobile robot designed to take
students from first principles of kinematics all the way to autonomous
navigation.

## Objectives

- Provide an affordable, reproducible hardware platform for
  undergraduate robotics courses and workshops.
- Serve as a testbed for lab research in autonomous navigation, sensor
  fusion, and edge AI.

## Current Progress

The second hardware revision is in active testing, and an early
NIRO EDU BOT prototype earned a **Top 3 finish at BEAR Summit 2025**.`;

const PUBLICATION_BLANK = `---
# PUBLICATION TEMPLATE — NIRO Lab website
# 1. Fill in every required field, delete this instructions block.
# 2. Save as: content/publications/my-paper.md   (kebab-case)
# 3. Optional: drop the citation next to it as my-paper.bib — the site
#    auto-detects it and adds a "Cite (BibTeX)" button.
# ------------------------------------------------------------------
title: ""                      # required
authors: ["Last, F."]          # required — one or more, "Surname, Initials."
venue: ""                      # required — journal or conference name
year: 2025                     # required — 1900–2100
type: conference               # journal | conference | workshop | preprint
areas: ["AI-driven robotics"]  # pick from the 8 official research areas
doi: ""                        # optional
pdf: ""                        # optional — URL or /assets path
code: ""                       # optional — repository URL
abstract: ""                   # optional — 2–4 sentences
---

Optional body text in markdown — context, links, notes.`;

const PUBLICATION_FILLED = `---
title: "A Low-Cost Autonomous Delivery Robot for Campus Environments"
authors: ["Siddique, S.", "Iftekhar, L."]
venue: "BEAR Summit 2025"
year: 2025
type: conference
areas: ["Autonomous & context-aware systems"]
abstract: "We present the design and field evaluation of a low-cost autonomous delivery robot built from open hardware. The system combines differential-drive kinematics, fused wheel-odometry and IMU localization, and a reactive planner, achieving reliable navigation in crowded campus environments."
---

Presented alongside the championship-winning robot at BEAR Summit 2025,
this paper describes the complete hardware and software stack of the
NIRO Lab autonomous delivery platform, with an emphasis on
reproducibility for teaching labs.`;

const NEWS_BLANK = `---
# NEWS TEMPLATE — NIRO Lab website
# 1. Fill in every required field, delete this instructions block.
# 2. Save as: content/news/YYYY-MM-DD-my-story.md
#    The date in the filename MUST match the date below — it drives ordering.
# 3. Image (optional): public/assets/news/my-story.jpg · 1200x675
# ------------------------------------------------------------------
title: ""                 # required
date: 2025-01-31          # required — YYYY-MM-DD, must match the filename
summary: ""               # optional — one-liner for cards & previews
image: /assets/news/my-story.jpg   # optional — placeholder if missing
tags: ["event"]           # optional — e.g. ["competition", "award"]
pinned: false             # true → stays at the top of the news page
---

The full story in markdown — paragraphs, links, **bold** highlights.`;

const NEWS_FILLED = `---
title: "NIRO Lab wins Championship Award at BEAR Summit 2025"
date: 2025-07-10
summary: "Our autonomous delivery robot took the top honor at BEAR Summit 2025, with the NIRO EDU BOT also finishing in the Top 3."
image: /assets/news/bear-summit-championship.jpg
tags: ["competition", "award"]
pinned: true
---

NIRO Lab is proud to announce that our **Autonomous Delivery Robot** won
the **Championship Award at BEAR Summit 2025**, competing against
university teams from across the country.

The same weekend, the **NIRO EDU BOT** — our student-built educational
platform — secured a **Top 3 finish**, a remarkable result for a robot
designed primarily as a teaching tool.`;

const GALLERY_BLANK = `---
# GALLERY TEMPLATE — NIRO Lab website
# 1. Fill in every required field, delete this instructions block.
# 2. Save as: content/gallery/YYYY-MM-DD-my-photo.md   (kebab-case)
# 3. Photo (REQUIRED): public/assets/gallery/my-photo.jpg · 1200x900
#    The image path below must point at a real file.
# ------------------------------------------------------------------
title: ""                  # required
date: 2025-01-31           # required — YYYY-MM-DD
category: events           # lab | events | research | team
image: /assets/gallery/my-photo.jpg   # REQUIRED for gallery entries
alt: ""                    # optional — describe the photo for screen readers
credit: ""                 # optional — e.g. "NIRO Lab media team"
---

Optional caption in markdown — shown with the photo.`;

const GALLERY_FILLED = `---
title: "First hands-on workshop: drivetrain build session"
date: 2025-03-20
category: events
image: /assets/gallery/workshop-hands-on.jpg
alt: "Students assembling robot drivetrains during NIRO Lab's first open workshop"
credit: "NIRO Lab media team"
---

Students at NIRO Lab's first open workshop assemble and program
differential-drive drivetrains.`;

const ACHIEVEMENT_BLANK = `---
# ACHIEVEMENT TEMPLATE — NIRO Lab website
# 1. Fill in every required field, delete this instructions block.
# 2. Save as: content/achievements/YYYY-my-award.md   (kebab-case)
# 3. Image (optional): public/assets/achievements/my-award.jpg · 800x600
# ------------------------------------------------------------------
title: ""                # required — e.g. "Championship Award — BEAR Summit 2025"
date: 2025-01-31         # required — YYYY-MM-DD
rank: ""                 # required — e.g. Champion | Top 3 | Finalist
event: ""                # optional — competition / venue name
project: ""              # optional — slug of the related project → badge + link
image: /assets/achievements/my-award.jpg   # optional — placeholder if missing
summary: ""              # optional — one-liner for the honors strip
---

Optional details in markdown — who competed, what was built, results.`;

const ACHIEVEMENT_FILLED = `---
title: "Championship Award — BEAR Summit 2025"
date: 2025-07-10
rank: "Champion"
event: "BEAR Summit 2025"
project: nirobot
image: /assets/achievements/bear-championship.jpg
summary: "First place for the Autonomous Delivery Robot at BEAR Summit 2025, the national robotics competition."
---

The Autonomous Delivery Robot built by NIRO Lab earned the Championship
Award at BEAR Summit 2025 — the lab's first national title, less than a
year after its founding.`;

// ------------------------------------------------------------ the six docs

export function buildContentTypes(): ContentTypeDoc[] {
  return [
    {
      id: "people",
      name: "Person",
      icon: Users,
      folder: "content/people/",
      blurb:
        "Team profiles — faculty, research assistants, students, and alumni. One file per person.",
      templateFile: "person-template.md",
      bodyNote:
        "Everything below the second --- is the bio body — free markdown (background, education, research focus) shown on the person's detail view.",
      fields: [
        { name: "name", type: "string", required: true, description: "Full name, with title.", example: '"Dr. Shahnewaz Siddique"' },
        { name: "role", type: "string", required: true, description: "Position shown under the name.", example: '"Associate Professor & Lab Director"' },
        { name: "category", type: "enum", required: true, description: "Which directory tab the person appears in.", allowed: ["founding_faculty", "affiliated_faculty", "ra", "student", "alumni"], example: "founding_faculty" },
        { name: "order", type: "integer", required: false, description: "Sort position within the category — lower shows first.", example: "1" },
        { name: "email", type: "string", required: false, description: "Contact address, rendered as a mail link.", example: "shahnewaz.siddique@northsouth.edu" },
        { name: "phone", type: "string", required: false, description: "Office phone.", example: '"+88 02 55668200 Ext – 1515"' },
        { name: "office", type: "string", required: false, description: "Room or office number.", example: '"SAC 1019"' },
        { name: "image", type: "string", required: false, description: "Path to a 400×400 JPG. Missing → designed placeholder with initials appears automatically.", example: "/assets/people/shahnewaz-siddique.jpg" },
        { name: "website", type: "string", required: false, description: "Personal or lab page URL.", example: "https://…" },
        { name: "scholar", type: "string", required: false, description: "Google Scholar profile URL.", example: "https://scholar.google.com/…" },
        { name: "linkedin", type: "string", required: false, description: "LinkedIn profile URL.", example: "https://linkedin.com/in/…" },
        { name: "research_interests", type: "string", required: false, description: "Comma-separated list, shown on cards.", example: '"Controls, Robotics, Intelligent Systems, AI"' },
      ],
      blankTemplate: PERSON_BLANK,
      filledExample: PERSON_FILLED,
      filledCaption: "Real file — content/people/dr-shahnewaz-siddique.md",
      naming: [
        { label: "File", path: "content/people/firstname-lastname.md", note: "kebab-case, one file per person" },
        { label: "Photo", path: "public/assets/people/firstname-lastname.jpg", note: "400×400 JPG, square, face centered — optional" },
      ],
      showsUp: ["People directory", "Person detail modal", "Home leadership strip", "Project team lists"],
    },
    {
      id: "projects",
      name: "Project",
      icon: Bot,
      folder: "content/projects/",
      blurb:
        "Research & build projects. One folder per project — the folder keeps the main file plus any extra pages together.",
      templateFile: "project-template.md",
      bodyNote:
        "The body is long-form markdown — use ## Overview / ## Objectives / ## Methodology / ## Current Progress. The project detail page renders it with a table of contents.",
      fields: [
        { name: "title", type: "string", required: true, description: "Project name.", example: '"NIRO Educational Bot"' },
        { name: "description", type: "string", required: true, description: "One-liner for cards — max 200 characters.", example: '"A low-cost, modular differential-drive robot…"' },
        { name: "status", type: "enum", required: false, description: "Defaults to Active. Drives the status chip.", allowed: ["Active", "Completed", "Concept"], example: "Active" },
        { name: "featured", type: "boolean", required: false, description: "true → the project joins the featured band on the home page. Defaults to false.", example: "true" },
        { name: "order", type: "integer", required: false, description: "Sort position — lower shows first.", example: "1" },
        { name: "image", type: "string", required: false, description: "Path to a 1600×900 hero image. Missing → placeholder appears automatically.", example: "/assets/projects/nirobot-hero.jpg" },
        { name: "duration", type: "string", required: false, description: "Free text date range.", example: '"October 2024 - Present"' },
        { name: "funding", type: "string", required: false, description: "Grant or sponsor line.", example: '"University Research Grant"' },
        { name: "areas", type: "string[]", required: false, description: "Research areas — must match the 8 official names exactly so filters always line up.", areasRef: true, example: '["AI-driven robotics", "Edge AI computing"]' },
        { name: "team", type: "string[]", required: false, description: "Exact names from people files — matched automatically and linked to profiles.", example: '["Dr. Shahnewaz Siddique"]' },
        { name: "links", type: "object", required: false, description: "Any of github / demo / paper — all optional.", example: 'github: "https://github.com/nirolab"' },
      ],
      blankTemplate: PROJECT_BLANK,
      filledExample: PROJECT_FILLED,
      filledCaption: "Real file — content/projects/nirobot/nirobot.md",
      naming: [
        { label: "File", path: "content/projects/my-project/my-project.md", note: "folder name = file name (folder-per-project)" },
        { label: "Hero", path: "public/assets/projects/my-project-hero.jpg", note: "1600×900 JPG — optional" },
        { label: "Extras", path: "content/projects/my-project/results.md", note: "optional extra pages live in the same folder" },
      ],
      showsUp: ["Projects grid", "Project detail page", "Home featured band (if featured)", "Achievement badges"],
    },
    {
      id: "publications",
      name: "Publication",
      icon: BookOpen,
      folder: "content/publications/",
      blurb:
        "Papers, articles, and preprints. One file per publication; years become filter facets automatically.",
      templateFile: "publication-template.md",
      bodyNote:
        "The body is optional markdown — context, links, or notes shown with the publication.",
      fields: [
        { name: "title", type: "string", required: true, description: "Full paper title.", example: '"A Low-Cost Autonomous Delivery Robot…"' },
        { name: "authors", type: "string[]", required: true, description: "One or more authors, \"Surname, Initials.\" format.", example: '["Siddique, S.", "Iftekhar, L."]' },
        { name: "venue", type: "string", required: true, description: "Journal or conference name.", example: '"BEAR Summit 2025"' },
        { name: "year", type: "integer", required: true, description: "Publication year, 1900–2100. Drives grouping & the year filter.", example: "2025" },
        { name: "type", type: "enum", required: false, description: "Defaults to conference.", allowed: ["journal", "conference", "workshop", "preprint"], example: "conference" },
        { name: "areas", type: "string[]", required: false, description: "Research areas — must match the 8 official names exactly.", areasRef: true, example: '["Autonomous & context-aware systems"]' },
        { name: "doi", type: "string", required: false, description: "DOI link.", example: "10.1109/…" },
        { name: "pdf", type: "string", required: false, description: "PDF URL or /assets path.", example: "https://…" },
        { name: "code", type: "string", required: false, description: "Code repository URL.", example: "https://github.com/…" },
        { name: "abstract", type: "string", required: false, description: "2–4 sentences, expandable on the list.", example: '"We present the design and field evaluation…"' },
      ],
      blankTemplate: PUBLICATION_BLANK,
      filledExample: PUBLICATION_FILLED,
      filledCaption: "Real file — content/publications/2025-autonomous-delivery-robot.md",
      naming: [
        { label: "File", path: "content/publications/my-paper.md", note: "kebab-case, one file per publication" },
        { label: "Cite", path: "content/publications/my-paper.bib", note: "optional sibling — auto-detected, adds a “Cite (BibTeX)” button" },
      ],
      showsUp: ["Publications list (grouped by year)", "Year / area / type filters", "BibTeX copy button"],
      footnote:
        "A sibling .bib file with the same slug (my-paper.bib) is picked up automatically — no field needed.",
    },
    {
      id: "news",
      name: "News post",
      icon: Newspaper,
      folder: "content/news/",
      blurb:
        "Announcements, events, and milestones. The date in the filename drives ordering — newest first.",
      templateFile: "news-template.md",
      bodyNote:
        "The body is the full article in markdown — paragraphs, links, bold highlights. Reading time is computed automatically.",
      fields: [
        { name: "title", type: "string", required: true, description: "Headline.", example: '"NIRO Lab wins Championship Award at BEAR Summit 2025"' },
        { name: "date", type: "date", required: true, description: "YYYY-MM-DD — must match the date in the filename.", example: "2025-07-10" },
        { name: "summary", type: "string", required: false, description: "One-liner for cards and previews.", example: '"Our autonomous delivery robot took the top honor…"' },
        { name: "image", type: "string", required: false, description: "Path to a 1200×675 image. Missing → placeholder appears automatically.", example: "/assets/news/bear-summit-championship.jpg" },
        { name: "tags", type: "string[]", required: false, description: "Free-form tags shown as chips.", example: '["competition", "award"]' },
        { name: "pinned", type: "boolean", required: false, description: "true → stays at the top of the news page. Defaults to false.", example: "true" },
      ],
      blankTemplate: NEWS_BLANK,
      filledExample: NEWS_FILLED,
      filledCaption: "Real file — content/news/2025-07-10-bear-summit-championship.md",
      naming: [
        { label: "File", path: "content/news/2025-03-20-my-event.md", note: "YYYY-MM-DD-slug.md — date in filename controls ordering" },
        { label: "Image", path: "public/assets/news/my-event.jpg", note: "1200×675 JPG — optional" },
      ],
      showsUp: ["News timeline", "Article page", "Home latest-news strip"],
    },
    {
      id: "gallery",
      name: "Gallery photo",
      icon: Images,
      folder: "content/gallery/",
      blurb:
        "Photos of the lab, events, research, and team. The only content type where the image is required.",
      templateFile: "gallery-template.md",
      bodyNote:
        "The body is an optional markdown caption shown with the photo.",
      fields: [
        { name: "title", type: "string", required: true, description: "Caption title for the tile.", example: '"First hands-on workshop: drivetrain build session"' },
        { name: "date", type: "date", required: true, description: "YYYY-MM-DD — orders the grid, newest first.", example: "2025-03-20" },
        { name: "category", type: "enum", required: false, description: "Defaults to lab. Powers the category filters.", allowed: ["lab", "events", "research", "team"], example: "events" },
        { name: "image", type: "string", required: true, description: "Path to a 1200×900 JPG — required for gallery entries; the path must point at a real file.", example: "/assets/gallery/workshop-hands-on.jpg" },
        { name: "alt", type: "string", required: false, description: "Describe the photo for screen readers.", example: '"Students assembling robot drivetrains…"' },
        { name: "credit", type: "string", required: false, description: "Photo credit line.", example: '"NIRO Lab media team"' },
      ],
      blankTemplate: GALLERY_BLANK,
      filledExample: GALLERY_FILLED,
      filledCaption: "Real file — content/gallery/2025-03-20-workshop-hands-on.md",
      naming: [
        { label: "File", path: "content/gallery/2025-03-20-my-photo.md", note: "kebab-case, one file per photo" },
        { label: "Photo", path: "public/assets/gallery/my-photo.jpg", note: "1200×900 JPG — required" },
      ],
      showsUp: ["Gallery masonry grid", "Category filters", "Lightbox viewer"],
    },
    {
      id: "achievements",
      name: "Achievement",
      icon: Trophy,
      folder: "content/achievements/",
      blurb:
        "Awards and milestones. These power the Honors strip on the home page and badges on matching projects.",
      templateFile: "achievement-template.md",
      bodyNote:
        "The body is optional markdown — who competed, what was built, results.",
      fields: [
        { name: "title", type: "string", required: true, description: "Award title.", example: '"Championship Award — BEAR Summit 2025"' },
        { name: "date", type: "date", required: true, description: "YYYY-MM-DD — orders the list, newest first.", example: "2025-07-10" },
        { name: "rank", type: "string", required: true, description: "Result line — recommended vocabulary:", allowed: ["Champion", "Top 3", "Finalist"], example: '"Champion"' },
        { name: "event", type: "string", required: false, description: "Competition or venue name.", example: '"BEAR Summit 2025"' },
        { name: "project", type: "string", required: false, description: "Slug of the related project — adds a badge and auto-link on that project.", example: "nirobot" },
        { name: "image", type: "string", required: false, description: "Path to an 800×600 image. Missing → placeholder appears automatically.", example: "/assets/achievements/bear-championship.jpg" },
        { name: "summary", type: "string", required: false, description: "One-liner for the honors strip.", example: '"First place for the Autonomous Delivery Robot…"' },
      ],
      blankTemplate: ACHIEVEMENT_BLANK,
      filledExample: ACHIEVEMENT_FILLED,
      filledCaption: "Real file — content/achievements/2025-bear-summit-championship.md",
      naming: [
        { label: "File", path: "content/achievements/2025-my-award.md", note: "kebab-case, one file per award" },
        { label: "Image", path: "public/assets/achievements/my-award.jpg", note: "800×600 JPG — optional" },
      ],
      showsUp: ["Home honors strip", "Matching project badge"],
    },
  ];
}
