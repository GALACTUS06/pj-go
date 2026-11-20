# PJ Go — QA Checklist

## Functional

- [ ] Home loads; Start Virtual enters Play.
- [ ] Joystick moves avatar; Interact idle until in radius.
- [ ] All 9 sites can be checked in (Virtual).
- [ ] Each check-in grants exactly one piece; no duplicates.
- [ ] Puzzle board shows 0→9; finale unlocks only at 9.
- [ ] Reload mid-run restores pieces and check-ins.
- [ ] Settings reset clears progress.
- [ ] Camera toggle follow ↔ oblique mid-play.
- [ ] Live permission deny → still completable in Virtual.
- [ ] Live permission grant → avatar moves with GPS (field test).

## Content

- [ ] English UI only.
- [ ] Each site has title + blurb + ≥1 fact.
- [ ] OSM / imagery / ferry art attributions visible.

## Performance / device

- [ ] Playable on a mid-range phone browser.
- [ ] No Google Maps network calls / API keys.
- [ ] Landscape and portrait both usable (joystick reachable).

## Deploy

- [ ] GitHub Pages URL opens without 404 on assets.
- [ ] Hard refresh after deploy shows new version (PWA update or clear-cache note).
