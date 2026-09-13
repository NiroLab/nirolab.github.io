# NIRO Lab Website - Contributor Template Kit

Everything you need to submit content for the NIRO Lab website
(NSU Intelligent Robotics Lab, North South University). No web
experience required: you fill in a plain-text file, attach an image,
and email it to us - the web team publishes it.

## Templates included

| Template | Use it for | Download |
|----------|------------|----------|
| `person-template.md` | Your member profile (faculty, RA, student, alumni) | [/templates/person-template.md](/templates/person-template.md) |
| `project-template.md` | A research project page | [/templates/project-template.md](/templates/project-template.md) |
| `publication-template.md` | A paper or publication entry | [/templates/publication-template.md](/templates/publication-template.md) |
| `news-template.md` | News, awards, events, announcements | [/templates/news-template.md](/templates/news-template.md) |
| `gallery-template.md` | Photos for the gallery | [/templates/gallery-template.md](/templates/gallery-template.md) |
| `achievement-template.md` | Competition results and honors | [/templates/achievement-template.md](/templates/achievement-template.md) |

## How to fill in a template

1. **Download** the template you need (links above).
2. **Open it in any text editor** - Notepad, TextEdit, VS Code, etc.
3. **Read the INSTRUCTIONS block** at the top (inside `<!-- ... -->`).
   It explains every field, which fields are required, allowed values
   (e.g. category and status keywords), and the file naming rules.
4. **Fill in the blank version** below the instructions. A filled
   example is included at the bottom of the instructions block for
   reference.
5. **Delete the instructions block** and any optional fields you did
   not use - never leave placeholders or empty fields in the file.
6. **Save with the exact file name** given in the template
   (naming conventions below).

## File naming conventions

| Content type | File name format | Example |
|--------------|------------------|---------|
| Person | `<slug>.md` | `jane-doe.md` |
| Project | `<project-slug>/<project-slug>.md` | `swarm-drone/swarm-drone.md` |
| Publication | `<year>-<slug>.md` (+ optional `.bib` twin) | `2025-swarm-formation-control.md` |
| News | `<YYYY-MM-DD>-<slug>.md` | `2025-07-10-bear-summit-award.md` |
| Gallery | `<YYYY-MM-DD>-<slug>.md` | `2025-07-16-bear-summit-team.md` |
| Achievement | `<YYYY>-<slug>.md` | `2025-bear-summit-championship.md` |

A **slug** is a short lowercase identifier: letters and numbers only,
words joined by hyphens (no spaces, no capitals, no titles like "Dr.").

## Image requirements

| Content type | Dimensions (pixels) | Format | File name |
|--------------|--------------------:|--------|-----------|
| Person (profile photo) | 400 × 400 (square) | JPG | `<slug>.jpg` |
| Project (hero image) | 1600 × 900 (landscape) | JPG / PNG / GIF | `<project-slug>.jpg` (or `.gif` for animation) |
| News (cover image) | 1200 × 675 (landscape) | JPG | `<slug>.jpg` |
| Gallery (photo) | 1200 × 900 (landscape) | JPG | `<slug>.jpg` |
| Achievement | 1200 × 675 (landscape) | JPG | `<slug>.jpg` |

- The image file name **must match** the `image:` field in your `.md`
  file - the templates are pre-filled with the correct pattern.
- If you skip an optional image, the site shows a designed
  placeholder automatically.
- Extra photos inside a news story or project page are welcome; use
  the same naming style and include them in your submission.

## Where files go (for the web team)

Submissions are placed into the site like this - you don't need to do
this yourself, but it explains the naming rules:

```
content/people/<slug>.md                     +  public/pictures/people/members/<slug>.jpg
                                                   (faculty: public/pictures/people/faculty/<slug>.jpg)
content/projects/<slug>/<slug>.md            +  public/pictures/projects/<slug>.jpg
content/publications/<year>-<slug>.md|.bib
content/news/<YYYY-MM-DD>-<slug>.md          +  public/pictures/news/<slug>.jpg
content/gallery/<YYYY-MM-DD>-<slug>.md       +  public/pictures/gallery/<slug>.jpg
content/achievements/<YYYY>-<slug>.md        +  public/pictures/achievements/<slug>.jpg
```

Every file is validated automatically at build time; a file with a
missing required field or an invalid value is skipped, so please
follow the template instructions exactly.

## How to submit

1. **Create a ZIP file** containing:
   - your completed `.md` file(s), and
   - your image file(s), prepared to the specs above.
2. **Email it to:** niro.laboratory@gmail.com
3. **Subject line format:**

   ```
   NIRO Website - [Your Name] - [Content Type]
   ```

   Examples:
   - `NIRO Website - Jane Doe - Profile`
   - `NIRO Website - Jane Doe - Project`
   - `NIRO Website - Jane Doe - News`
   - `NIRO Website - Jane Doe - Gallery`

   Sending several content types at once? List them, e.g.
   `NIRO Website - Jane Doe - Profile & News`.

## Questions?

Email **niro.laboratory@gmail.com** - the web team is happy to help
you fill in a template or prepare images.
