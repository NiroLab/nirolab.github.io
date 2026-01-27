# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NIRO Lab website - a Jekyll-based static site for NSU Intelligent Robotics Lab, deployed via GitHub Pages to https://nirolab.github.io.

## Development Commands

```bash
# Install dependencies
bundle install

# Run local development server (visit http://localhost:4000)
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

## Architecture

**Jekyll Collections** (configured in `_config.yml`):
- `_people/` - Team member profiles (uses `person` layout)
- `_projects/` - Research projects (uses `project` layout)
- `_posts/` - News posts (uses `post` layout, named `YYYY-MM-DD-title-slug.md`)

**Data Files** (`_data/`):
- `publications.yml` - Publication entries by year
- `navigation.yml` - Site navigation menu
- `hero_slides.yml` - Homepage hero carousel
- `gallery.yml` - Image gallery data

**Layouts** (`_layouts/`):
- `default.html` - Base layout with header/footer
- `page.html`, `person.html`, `project.html`, `post.html` - Content-specific layouts

**Styling**: Single CSS file at `assets/css/main.css` with CSS custom properties for theming.

## Deployment

Push to `main` branch triggers automatic GitHub Actions deployment (`.github/workflows/jekyll.yml`).
