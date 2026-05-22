Created a dedicated `/presentation/` page for visitor presentations (lab tours, open houses). It is a full-screen slide deck with 11 slides covering Welcome, Mission, Vision, Innovation Cycle graphic, Research Areas, 3 Featured Projects, Project Hexa, BEAR Summit 2025 achievements, and Get Involved.

**Key technical decisions:**
- Uses `_layouts/presentation.html` (minimal layout without site header/footer)
- Auto-advances every 10s with a progress bar at the top
- Space bar toggles play/pause; arrow keys navigate manually
- Hover pauses temporarily without changing play state
- Pulls project data dynamically from `site.projects` via Liquid
- BEAR Summit slide uses actual news photos, not just emoji icons

**Why:** The lab needed a screen-friendly way to introduce themselves to visitors during events. The homepage hero carousel was not sufficient for this use case.

**How to apply:** When adding new featured projects or achievements, update the relevant project markdown files — the presentation pulls data automatically.