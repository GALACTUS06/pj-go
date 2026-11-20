# PJ Go — Phase Plan

Ordered delivery. Do not start Phase N+1 UI polish until Phase N exit criteria pass.

---

## Phase 0 — Repository & spike (0.5–1 day)

**Deliver**

- New GitHub repo `pj-go` (empty or with this docs tree).
- Vite React TS scaffold, base path for Pages, PWA stub.
- **Spike:** OSM bbox → white boxes + grounded avatar move 10 m in Virtual mode (throwaway OK).

**Exit**

- [ ] Spike video/gif or note: avatar moves among ≥3 extruded buildings.
- [ ] Decision recorded: Three.js **or** MapLibre-primary (update ARCHITECTURE.md one line).

---

## Phase 1 — Playable sandbox (2–3 days)

**Deliver**

- Harbor bbox scene load (OSM extract cached as GeoJSON in `public/geo/`).
- Avatar + Virtual joystick + Interact.
- Camera toggle: follow ↔ oblique.
- 9 checkpoint markers + radius debug (optional wire spheres).
- Check-in sheet + local save of `checkedInSiteIds`.
- Puzzle board UI (slots fill; finale placeholder image OK).

**Exit**

- [ ] Virtual completion of all 9 check-ins on desktop and one Android/iOS browser.
- [ ] Reload restores progress.

---

## Phase 2 — Live mode & content (1–2 days)

**Deliver**

- Geolocation permission flow; smoothed GPS → avatar.
- Mode toggle Virtual / Live; Live failure falls back to Virtual without wiping save.
- Real English blurbs/facts for all 9 sites.
- Ferry finale art + credits.
- Home, Settings, attribution footer.

**Exit**

- [ ] Live mode reaches ≥3 real sites in Port Jeff (manual QA) **or** documented simulator path if remote.
- [ ] Virtual still 100% completable with Live denied.

---

## Phase 3 — Harden & ship (1–2 days)

**Deliver**

- Performance pass (draw calls, pixel ratio, bbox trim).
- Walkable constraints (block deep water).
- QA checklist green.
- GitHub Pages deploy workflow.
- README install/run/deploy.

**Exit**

- [ ] Public Pages URL playable.
- [ ] No Google Maps keys in repo.

---

## Phase 4+ (backlog — not MVP)

- Minimap.
- Static tour-guide voice lines / portrait.
- Indoor scenes, hold interactions, jump worlds.
- Refined glTF hero buildings for priority trio.
- Native wrappers.

---

## Suggested calendar

| Phase | Calendar |
|-------|----------|
| 0 | Day 1 |
| 1 | Days 2–4 |
| 2 | Days 5–6 |
| 3 | Days 7–8 |

Adjust for part-time; keep Virtual-complete as the north star.
