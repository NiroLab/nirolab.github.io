# NIRO Lab Website — Full Redesign & Rebuild Plan

## Goal
Rebuild https://nirolab.github.io/ from scratch:
- Modern NSU-blue-based theme, professional research-lab look
- File-based CMS: structured content files (YAML front-matter Markdown / JSON) in folders → build script auto-generates data → site renders automatically
- Placeholder images, easily swappable
- Fully responsive; clear docs/templates for non-developers

## Stage 0 — Discovery (Orchestrator)
- Inspect uploaded files in /mnt/agents/temp/ and /mnt/agents/upload/
- Optionally scrape https://nirolab.github.io/ to capture all existing content (people, projects, publications, news, research areas)
- Output: content inventory (content-inventory.md)

## Stage 1 — Architecture & Setup
- Load skill: vibecoding-webapp-swarm (+ webapp-building-swarm for React build)
- Stack decision: React + Vite + TypeScript + Tailwind + shadcn/ui; content as YAML/MD files under `content/<section>/`; a Node build script (gray-matter + js-yaml) scans folders → emits `src/data/content.json` + copies assets → Vite consumes it.
- Placeholder strategy: single `public/assets/placeholders/` dir; content files reference image paths; missing files fall back to placeholders automatically.

## Stage 2 — Design
- Design brief: NSU-inspired blue palette (deep navy #1F4E8C / NSU blue, accents), modern typography, professional lab aesthetic
- Sections: Home (hero, research highlights, stats, news), People, Research/Projects, Publications, News/Activities, Achievements, Join Us/Contact, Docs page (CMS guide)

## Stage 3 — Implementation (sub-agents)
- Agent A: Content pipeline (folder structure, schemas, build script, example files, template files, README/docs)
- Agent B: Frontend app (pages, components, animations, responsive) consuming generated content.json
- Validate: build passes, content add/remove test works by dropping a file

## Stage 4 — Populate & Migrate
- Migrate all existing NIRO Lab content from Stage 0 inventory into structured files

## Stage 5 — QA & Delivery
- Responsive/UX review subagent
- Fix pass
- Deliver: version via mshtools-website_version_manager (static React build) + source under /mnt/agents/output/
