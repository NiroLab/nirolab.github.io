# Gallery Page — `/gallery`

**Goal:** A visual archive of lab life that looks intentional whether it holds 0 photos (today) or 200 (future). Driven by `content/gallery/*.md` + images in `/assets/gallery/`.

---

## Section 1 — Page hero (dark, compact)

- Eyebrow `// GALLERY`, H1 "Inside the lab." (word-mask rise)
- Sub: "Workshops, demos, builds, and the people behind them."
- Live chips: `{n} PHOTOS` · `{n} ALBUMS` (hidden at 0).

**Animation:** standard hero sequence.

---

## Section 2 — Category filter (sticky, light glass)

Pills: **All · Lab · Events · Research · Team** (auto-derived from `category` fields, counts badged). Animated active pill (`layoutId`). Right: view toggle — Masonry / Grid (even rows) — icons switch with a rotate micro-animation.

---

## Section 3 — Masonry wall (light)

**Layout:** CSS-columns masonry (4 cols xl / 3 lg / 2 sm / 1 mobile), varied aspect crops from natural image sizes (placeholders ship in mixed 4:3 / 1:1 / 16:10 so the wall looks designed even before real photos).

**GalleryTile:**
- Image (placeholder `placeholders/gallery.svg` hue varies by category: lab = navy, events = blue, research = sky-tinted, team = deep navy), `rounded-xl`, crosshair corners on hover.
- Hover: image scale 1.05 (0.5s), gradient scrim rises, caption bar slides up: title (Sora 600 small) + date mono + category chip + expand icon.
- Click → Lightbox.

**Animation:** tiles reveal with stagger 0.05s + `scale 0.95→1`; masonry reflow on filter animates with `layout` (0.4s).

---

## Section 4 — Lightbox

**Layout:** ink scrim 92% + blur; image centered (max 86vh), enters by scaling from the clicked tile (`layoutId`, 0.4s). Caption bar bottom: title, date, category, credit (if present), counter `3 / 12`. Prev/Next chevrons (keyboard ←/→, swipe on touch), ESC/scrim close. Thumbnail filmstrip (80px) along bottom on desktop, active thumb outlined sky.

**Animation:** image cross-fade 0.3s on navigate with 16px directional slide; caption re-staggers per image.

---

## Section 5 — Empty state (current live behavior — gallery = 0)

Same family as Publications empty state: orbit-aperture animated SVG, H3 "The lab album is just getting started.", copy explaining the file-based system (`content/gallery/` + `/assets/gallery/`), buttons: primary "How to submit photos →" (→ `/contribute#gallery`), ghost "Download the template".

Plus a **preview strip** of 6 designed placeholder tiles (dimmed, labeled "PREVIEW") so the page demonstrates its future grid — clicking one opens the Contribute anchor instead of a lightbox.

**Animation:** tiles drift in with slow stagger; on hover they brighten (inviting contribution).

---

## Section 6 — Submission note (light end)

Ice strip: "NIRO members: your photos belong here — submit via the Contribute guide. Image spec: 1200×900 JPG, named to match your entry file." + mailto chip.
