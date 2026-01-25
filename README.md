# NIRO Lab Website

Official website for the NSU Intelligent Robotics Lab (NIRO Lab).

**Live site**: https://nirolab.github.io

## Quick Start

### Local Development

```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# Visit http://localhost:4000
```

## Content Management Guide

### Adding a New Person

1. Create a file in `_people/` folder
2. Use this template:

```markdown
---
name: Full Name
role: Research Assistant  # or Faculty, Student Researcher
category: ra  # faculty, ra, student, alumni
order: 1  # for sorting within category
email: email@northsouth.edu
image: /assets/images/people/filename.jpg
research_interests: Topic 1, Topic 2, Topic 3
website: https://personal-website.com  # optional
scholar: https://scholar.google.com/...  # optional
---

Bio text goes here. Write 2-3 sentences about the person.
```

3. Add photo to `assets/images/people/`
4. Push to GitHub

### Adding a New Project

1. Create a file in `_projects/` folder
2. Use this template:

```markdown
---
title: Project Title
description: One-line description for the card view
status: Active  # or Completed
featured: true  # shows on homepage
order: 1
image: /assets/images/projects/filename.jpg
duration: 2024 - Present
funding: Funding Source
team:
  - Team Member One
  - Team Member Two
---

Full project description in markdown format.
```

3. Add image to `assets/images/projects/`
4. Push to GitHub

### Adding a News Post

1. Create a file in `_posts/` folder
2. Name format: `YYYY-MM-DD-title-slug.md`
3. Use this template:

```markdown
---
layout: post
title: "News Title"
date: 2025-01-25
---

News content in markdown format.
```

### Adding a Publication

1. Edit `_data/publications.yml`
2. Add entry at the top of the relevant year:

```yaml
- title: "Paper Title"
  authors: "Author One, Author Two"
  venue: "Conference/Journal Name, Year"
  year: 2025
  pdf: "https://link-to-pdf"  # optional
  doi: "https://doi.org/..."  # optional
  code: "https://github.com/..."  # optional
```

## File Structure

```
nirolab.github.io/
├── _config.yml          # Site configuration
├── _data/
│   ├── navigation.yml   # Menu links
│   └── publications.yml # Publication entries
├── _includes/           # Reusable components
├── _layouts/            # Page templates
├── _people/             # Team member profiles
├── _posts/              # News/blog posts
├── _projects/           # Project pages
├── assets/
│   ├── css/main.css    # Stylesheet
│   └── images/         # All images
├── index.html          # Homepage
├── about.md            # About page
├── people.md           # People listing
├── projects.md         # Projects listing
├── publications.md     # Publications page
└── news.md             # News archive
```

## Customization

### Colors
Edit CSS variables in `assets/css/main.css`:

```css
:root {
  --color-primary: #1a365d;
  --color-accent: #0d9488;
  /* ... */
}
```

### Logo
Replace `assets/images/logo.png` with your logo.

### Contact Info
Edit `_config.yml` and `_includes/footer.html`.

## Deployment

Push to `main` branch - GitHub Pages builds automatically.

## License

All rights reserved. Content belongs to NIRO Lab, NSU.
