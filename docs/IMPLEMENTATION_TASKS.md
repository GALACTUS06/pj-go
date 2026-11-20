# PJ Go — Implementation Task Breakdown

Execute in order. Each task is completable in one sitting where possible.

---

## Step 0 — Foundation

| ID | Task | Done when |
|----|------|-----------|
| 0.1 | Create GitHub repo `pj-go` (public or private) | Remote empty repo exists |
| 0.2 | Push this docs tree as initial commit | Docs visible on GitHub |
| 0.3 | Scaffold Vite React TS + Router + Zustand + PWA | `npm run dev` shows blank shell |
| 0.4 | Configure `base: '/pj-go/'` + Pages workflow stub | Workflow file present |
| 0.5 | Geo spike: Overpass → GeoJSON → extrude → WASD avatar | Spike note in ARCHITECTURE |
| 0.6 | Lock Three vs MapLibre in ARCHITECTURE.md | One sentence decision |

---

## Step 1 — Virtual playable

| ID | Task | Done when |
|----|------|-----------|
| 1.1 | `checkpoints.ts` from template JSON | 9 sites typed in app |
| 1.2 | Projection helpers + unit test or storybook assert | Ferry origin at (0,0) |
| 1.3 | PlayScene canvas: ground, buildings, water | Harbor recognizable |
| 1.4 | Avatar + joystick + keyboard | Move freely in bbox |
| 1.5 | Camera follow + oblique toggle | Preference persists |
| 1.6 | Checkpoint markers + radius check | Button enables in range |
| 1.7 | Check-in sheet + grant piece | Save updates |
| 1.8 | Puzzle 3×3 page | Fills with progress |
| 1.9 | Home / Settings / Reset | Round-trip works |
| 1.10 | Virtual full clear QA | 9/9 on phone browser |

---

## Step 2 — Live + content + finale

| ID | Task | Done when |
|----|------|-----------|
| 2.1 | `usePlayerLocation` + permission UX | Deny → Virtual OK |
| 2.2 | GPS → local xz lerp | Avatar tracks outdoors |
| 2.3 | Paste CONTENT_SITES into data | All blurbs/facts live |
| 2.4 | Ferry finale asset + reveal flow | Image shows at 9/9 |
| 2.5 | Credits screen strings | OSM + art credited |
| 2.6 | Field test ≥3 live check-ins | Notes in QA doc |

---

## Step 3 — Ship

| ID | Task | Done when |
|----|------|-----------|
| 3.1 | Perf pass (merge mesh, DPR cap, bbox trim) | Mid phone OK |
| 3.2 | Water collision / soft bounds | Hard to leave map |
| 3.3 | QA checklist all green | File checked |
| 3.4 | Pages deploy live | Public URL |
| 3.5 | README runbook | Clone → play instructions |

---

## Explicitly deferred tickets (do not pull into MVP)

- Indoor scenes, ScanInteract camera match, jump worlds  
- LLM tour guide  
- Minimap  
- Hero glTF for three priority buildings  
- Native store wrappers  
