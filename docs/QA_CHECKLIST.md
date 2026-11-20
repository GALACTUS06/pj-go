# PJ Go — QA Checklist

Canonical gate: [ACCEPTANCE.md](./ACCEPTANCE.md). This list is the manual runbook.

## Functional

- [ ] Home loads; Start Virtual enters Play.
- [ ] Joystick moves avatar; Check in idle until in radius.
- [ ] Tutorial shows once; Skip/Done persists.
- [ ] Next chip + compass + labels find distant sites.
- [ ] All 9 sites can be checked in (Virtual), free order.
- [ ] Each check-in grants exactly one piece; no duplicates.
- [ ] Puzzle board shows 0→9; finale unlocks only at 9.
- [ ] Reload mid-run restores pieces and check-ins.
- [ ] Settings reset clears progress (incl. tutorialDone).
- [ ] Camera toggle follow ↔ oblique mid-play.
- [ ] Water blocks / slides Virtual movement.
- [ ] Live permission deny → still completable in Virtual.
- [ ] Live permission grant → avatar moves with GPS (field test).
- [ ] Live outside box → banner; check-in disabled.
- [ ] WebGL fail / stub → 2D list still clears 9/9.

## Content

- [ ] English UI only (matches COPY_DECK).
- [ ] Each site has title + blurb + ≥1 fact.
- [ ] OSM + ferry CC BY-SA credits visible in Settings.

## Performance / device

- [ ] Playable on a mid-range phone browser.
- [ ] No Google Maps network calls / API keys.
- [ ] Landscape and portrait both usable (joystick reachable).
- [ ] `prefers-reduced-motion` softens camera.

## Deploy

- [ ] GitHub Pages URL opens without 404 on assets (`base: /pj-go/`).
- [ ] Hard refresh after deploy shows new version (PWA or `clear-cache.html`).
- [ ] ACCEPTANCE A1–A16 signed.
