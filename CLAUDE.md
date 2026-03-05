# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NIRO Lab website - a Jekyll-based static site for NSU Intelligent Robotics Lab, deployed via GitHub Pages to https://nirolab.github.io.

## Development Commands

```bash
bundle install                  # Install dependencies
bundle exec jekyll serve        # Local dev server at http://localhost:4000
bundle exec jekyll build        # Production build (output in _site/)
```

## Architecture

### Layout Chain

`default.html` is the base layout (HTML head, header/footer includes, `{{ content }}`). All other layouts either extend `default` or are used directly:
- `page.html` - Generic pages (about, people listing, etc.)
- `person.html` - Individual team member profiles
- `project.html` - Individual project pages
- `post.html` - News posts

Page-level templates like `people.md`, `projects.md`, and `index.html` use `layout: default` directly and contain their own Liquid logic for querying collections.

### Collections and Content

**People** (`_people/`): Files named by role prefix (`faculty-1.md`, `ra-2.md`, `student-5.md`, `alumni-1.md`, `affiliated-3.md`). The `category` front matter field determines grouping on the people page. Valid categories: `founding_faculty`, `affiliated_faculty`, `ra`, `student`, `alumni`. The `order` field controls sort order within each category.

**Projects** (`_projects/`): Named by slug. The `featured: true` front matter flag makes them appear on the homepage (up to 3).

**Posts** (`_posts/`): Standard Jekyll naming `YYYY-MM-DD-title-slug.md`. Layout auto-assigned via `_config.yml` defaults.

### Data Files (`_data/`)

- `publications.yml` - Publication entries (currently empty, page shows "under development")
- `navigation.yml` - Top nav menu items (title + url pairs)
- `hero_slides.yml` - Homepage carousel slides (title, subtitle, image, optional bg_size/bg_position)
- `gallery.yml` - Gallery data (page currently under development)

### Content Templates

`templates/` directory contains submission templates for non-technical contributors (person, project, news, gallery, publication). These are not part of the Jekyll build.

### Styling

Single CSS file at `assets/css/main.css` using CSS custom properties (`:root` variables) for theming. Fonts: Inter (sans-serif) and Merriweather (serif) loaded from Google Fonts.

### Homepage (`index.html`)

Contains inline JavaScript for the hero carousel (auto-advance, keyboard nav, dot indicators). Featured projects are pulled via `site.projects | where: "featured", true`. Recent news shows the latest 4 posts.

## Deployment

Push to `main` triggers GitHub Actions (`.github/workflows/jekyll.yml`): builds with Ruby 3.2 and deploys to GitHub Pages. No manual build step needed.

## Key Conventions

- All image assets go in `assets/images/` organized by type (`people/`, `projects/`)
- Image specs: profile photos 400x400px square JPG, project images 800x500px landscape JPG
- URLs use trailing slashes (configured in `_config.yml` permalinks)
- Plugins: `jekyll-feed` (RSS) and `jekyll-seo-tag` (SEO meta tags)
