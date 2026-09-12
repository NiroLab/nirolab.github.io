# Contact Page — `/contact`

**Goal:** Make reaching the lab effortless and make collaboration pathways explicit. Identity data from `content/site.yml`.

---

## Section 1 — Page hero (dark, compact)

- Eyebrow `// CONTACT`, H1 "Let's build something intelligent." (word-mask rise)
- Sub: "We welcome inquiries about collaborations, graduate research opportunities, partnerships, and student involvement."

**Animation:** standard hero sequence.

---

## Section 2 — Contact cards + form (light, 5/7 split)

**Left (5):** three stacked info cards (hairline, crosshair corners):
1. **Visit** — pin icon; NIRO Lab, North South University, Bashundhara, Dhaka-1229, Bangladesh; dept. line "Dept. of Electrical & Computer Engineering".
2. **Email** — mail icon; `nirolaboratory@gmail.com` as a mono copy-chip (click → copy + "Copied ✓" tooltip); note "We typically respond within a few days."
3. **Leadership** — users icon; "Dr. Shahnewaz Siddique (Director) · Dr. Lamia Iftekhar (Co-Director)" linking to `/people`.

Below: socials icon row (GitHub, LinkedIn, Facebook, YouTube — from `site.yml`, ghost circular buttons).

**Right (7):** message form card (ice panel):
- Fields: Name, Email, **Topic dropdown** (Collaboration / Join the lab / Project proposal / Media & events / Content submission), Message (textarea, 8 rows).
- Validation: inline, sky focus rings, error `--nsu-error` messages under fields; submit button shows orbit-ring spinner → success state swaps the panel to a check + "Message sent — we'll be in touch." (mailto fallback note since static hosting: form composes a `mailto:` with prefilled subject/body as graceful degradation).
- Honeypot field for spam.

**Animation:** cards stagger `y 32→0` 0.1s; form fields focus: label floats + border draws; button arrow slides on hover.

---

## Section 3 — Map (light, full-width)

**Layout:** `placeholders/map.svg` in a `rounded-3xl` frame with crosshair corners, 16:7 crop; overlay card bottom-left (glass): address + "Get directions →" (Google Maps link). Map placeholder annotated so swapping to an embedded map later requires only replacing the component slot (documented in Contribute FAQ).

**Animation:** map reveals with clip-path on enter; overlay card slides `y 24→0`.

---

## Section 4 — Collaboration pathways (navy, 3 cards)

Dark band, 3 pathway cards (glass, sky hairlines):
1. **For Students** — join as a student researcher; link "See open paths →" (→ /people CTA / mailto with template subject).
2. **For Industry & Government** — partnerships, sponsored projects, demos.
3. **For Academia** — joint research, co-supervision, publications.

Each: icon (line style), 2-line pitch, ghost-sky button. Hover: border brightens, icon translates up 4px.

**Animation:** cards stagger `y 40→0` 0.12s; ambient node-wire SVG in background (very low opacity, static).

---

## Section 5 — Standard footer CTA band suppressed here

(The contact page itself is the CTA — global CTA band is skipped on this page; footer renders directly.)
