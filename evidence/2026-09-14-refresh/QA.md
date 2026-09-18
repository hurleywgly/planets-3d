# Solar System Refresh QA

Date: 2026-09-14

## Baseline

- Live production baseline captured before edits from `https://interactive-planets.vercel.app/`.
- `before-desktop.png`: 1440x960.
- `before-mobile.png`: 390x844.

## Local Runtime

- Preview: `http://localhost:4173/`.
- Desktop: 1440x960, one canvas present, loading overlay removed, fresh browser warnings/errors empty.
- Mobile: 390x844, one canvas present, loading overlay removed, fresh browser warnings/errors empty.
- HTTP checks returned `200 OK` for `/` and `assets/textures/earth.jpg`.
- `node --check main.js`, `node --check server.js`, and `git diff --check` passed.

## Interaction Evidence

- Rail selection focused Saturn and rendered NASA fact-sheet values: 1,432.0 million km, 120,536 km, 10,747 days, 10.7 h, and -140 C.
- Pause changed to Resume and returned to Pause when resumed. The motion slider accepted `2.50x`.
- Reset returned the selected card and active rail item to Sun.
- A direct click on the rendered Sun selected Sun and synchronized the rail state.
- A real browser scroll gesture produced `desktop-zoom.png`; reset then restored the full-system view.
- Mobile rail selection focused Earth and rendered its six physical fields.

## Visual Checks

- Desktop overlay rectangles had zero pairwise overlap: header, body rail, fact card, and orbital-rate control.
- Mobile overlay rectangles had zero pairwise overlap for the same four regions.
- Pixel checks with `ffmpeg` signal statistics: `after-desktop.png` has `YAVG=15.056`, `YMAX=255`; `after-mobile.png` has `YAVG=20.9286`, `YMAX=255`. These confirm nonblank, varied rendered frames.
- `contact-sheet.png` is a labeled 1600x1120 before/after comparison.

## Limits

- This is a local preview only. No commit, push, deployment, external message, or production mutation was performed.
- Astronomy sources and display-scale treatment are documented in `../../SOURCE_NOTES.md`.
