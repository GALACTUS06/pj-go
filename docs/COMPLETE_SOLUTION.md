# PJ Go — Complete Solution

**Single source of truth** for building, shipping, and operating the Port Jefferson MVP.

| Field | Value |
|-------|-------|
| Product | PJ Go (temporary name) |
| Setting | Port Jefferson, NY — harbor / downtown playable box |
| Client | Web + PWA (mobile-first) |
| Maps | Free only (OSM white-box + optional Esri underlay) — **no Google Maps** |
| Completion | **Virtual mode required**; Live GPS optional |
| Win state | Win a mini game at each of **9 sites** (one ship part each) + pick up **3 street tools** → build the sloop at Hal's Shipyard → sail out past the PJ↔Bridgeport ferry |

> **v0.3.0 change:** the 3×3 ferry puzzle was replaced by the storyline (newcomer misses the last ferry; Hal the shipwright helps build a sloop), 9 Port Jeff mini games, 3 street tools and the Shipyard page. Sections below that mention puzzle pieces describe the v0.1–v0.2 MVP; see README and ARCHITECTURE §4 for the current flow.

Related docs (detail packs):

| Doc | Role |
|-----|------|
| [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Product lock & principles |
| [PHASE_PLAN.md](./PHASE_PLAN.md) | Calendar phases & exit gates |
| [CHECKPOINTS.md](./CHECKPOINTS.md) | Site seeds |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Modules & stack |
| [UI_FLOWS.md](./UI_FLOWS.md) | Screens & interactions |
| [GEO_PIPELINE.md](./GEO_PIPELINE.md) | OSM → white-box steps |
| [CONTENT_SITES.md](./CONTENT_SITES.md) | Full English copy for 9 sites |
| [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) | Ticket-level work breakdown |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Repo, Pages, PWA |
| [QA_CHECKLIST.md](./QA_CHECKLIST.md) | Acceptance tests |
| [ASSET_PIPELINE.md](./ASSET_PIPELINE.md) | **Find & license all materials** (OSM, ferry art, icons) |
| [ACCEPTANCE.md](./ACCEPTANCE.md) | **Delivery gate** — when MVP is done |
| [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md) | Exact algorithms & APIs |
| [COPY_DECK.md](./COPY_DECK.md) | Every English UI string |
| [BRAND_TOKENS.md](./BRAND_TOKENS.md) | Colors, type, motion |
| [CREDITS.md](./CREDITS.md) | Attribution log |
| [`../data/checkpoints.template.json`](../data/checkpoints.template.json) | Machine-readable seeds |

---

## A. Problem we solve

Visitors and students need a **simple, playable way** to walk Port Jefferson’s harbor story without a guided tour bus. PJ Go turns nine real outdoor places into a **check-in → learn → puzzle** loop ending on the village’s most iconic connector: the **ferry to Bridgeport, CT**.

---

## B. Solution overview (one page)

```text
┌──────────────────────────────────────────────────────────┐
│ HOME                                                     │
│  Start Virtual | Enable Live (optional) | Puzzle | Help  │
└────────────────────────────┬─────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────┐
│ PLAY SCENE (3D)                                          │
│  • OSM white-box buildings (small harbor bbox)           │
│  • Avatar                                                │
│  • Virtual joystick  OR  GPS-driven position             │
│  • Camera: Follow  ↔  Oblique top-down                   │
│  • 9 glowing checkpoints                                 │
└───────────────┬───────────────────────────┬──────────────┘
                │ enter radius              │
                ▼                           │
┌───────────────────────────┐               │
│ CHECK-IN SHEET            │               │
│ history blurb + Collect   │───────────────┘
└───────────────┬───────────┘
                ▼ grant piece
┌──────────────────────────────────────────────────────────┐
│ PUZZLE 3×3  →  9/9  →  FERRY FINALE IMAGE + closing line │
└──────────────────────────────────────────────────────────┘
```

**Nothing else is required for MVP** (no indoor maps, no camera scan, no LLM guide).

### B+ Locked playability rules (from engineer gap review)

| Topic | Decision |
|-------|----------|
| Collection order | **Free** — any uncollected site |
| Virtual wayfinding | World labels + **Next nearest** chip + compass arrow (no minimap in MVP) |
| Move speed | 4.5 m/s Virtual; GPS lerp ~0.3 s |
| Collisions | Water **on**; buildings **visual only** |
| Spawn | Ferry terminal |
| First run | 3-step coach marks once |
| WebGL fail | Fallback 2D site list — still completable |
| Privacy | Location on-device only; no accounts; Settings blurb |

Exact numbers and algorithms: [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md).

---

## C. End-to-end player journey

### C1. First launch

1. Open Pages URL (or installed PWA).
2. See title **PJ Go**, one-sentence pitch, attribution strip.
3. Tap **Start Virtual Walk** (primary).
4. Optional: **Use Live Location** — if denied/unavailable, stay Virtual; show toast, do not block.

### C2. Explore

1. Avatar appears near ferry terminal origin (or map center).
2. Move with on-screen stick (Virtual) or walk in the real village (Live).
3. Toggle camera if buildings occlude.
4. HUD shows `Pieces n/9` and nearest site name when close.

### C3. Check-in

1. Enter `radiusM` of a site → Interact / Check in enabled.
2. Sheet opens: name, blurb, 2–4 facts.
3. Tap **Collect puzzle piece** → piece id saved; marker turns “done”.
4. Close sheet; continue.

### C4. Finale

1. Open Puzzle from HUD or Home.
2. When `n === 9`, **Reveal ferry** unlocks.
3. Full-bleed finale image + closing line.
4. Offer Replay (keeps lore) or Reset in Settings.

### C5. Return visit

- Progress in `localStorage`.
- Already-collected sites show “Collected” and still allow re-reading copy.

---

## D. Functional requirements (complete MVP)

| ID | Requirement |
|----|-------------|
| F1 | Render harbor bbox white-box 3D from OSM-derived data |
| F2 | Avatar present and controllable in Virtual mode |
| F3 | Optional GPS → avatar in Live mode with smoothing |
| F4 | Dual camera modes with persisted preference |
| F5 | Nine checkpoints with lat/lng/radius from data file |
| F6 | Distance-based check-in shared by both modes |
| F7 | Check-in grants unique puzzle piece; idempotent |
| F8 | Puzzle board 3×3 reflects save state |
| F9 | Finale reveal only at 9/9 |
| F10 | Settings: reset progress, mode help, credits |
| F11 | PWA installability + offline shell for app chrome (geo may need network first load) |
| F12 | English UI only |
| F13 | No Google Maps API keys |
| F14 | Virtual wayfinding: world labels + Next chip + compass |
| F15 | One-time tutorial coach marks |
| F16 | WebGL failure → 2D site list still completable |
| F17 | Water and building collision on (walker slides along walls; Live GPS is never blocked) |
| F18 | Street navigation: blue route line to Next along OSM streets, walking distance in the chip, optional **Walk route** auto-walk |
| F19 | Unlock reveal: site photo (Wikimedia Commons, credited) + new puzzle piece on every check-in |

---

## E. Non-functional requirements

| ID | Requirement |
|----|-------------|
| N1 | Mid-range phone: playable ~30 FPS in bbox |
| N2 | Cold start usable under 5s on LTE after cache warm |
| N3 | Accessibility: large hit targets; reduce-motion softens camera lerp |
| N4 | Privacy: no account; location used only on-device for Live |
| N5 | License-safe OSM / imagery / finale art credits on screen |

---

## F. Data model (complete)

### F1. Checkpoint

```ts
type Checkpoint = {
  id: string
  name: string
  lat: number
  lng: number
  radiusM: number
  priority: boolean
  blurb: string
  facts: string[]
  sources?: string[]
  puzzleSlot: number // 0..8 for 3×3
}
```

### F2. Save

```ts
type SaveV1 = {
  version: 1
  modePreference: 'virtual' | 'live'
  cameraPreference: 'follow' | 'oblique'
  checkedInSiteIds: string[]
  puzzlePieceIds: string[] // MVP: same as site ids
  finaleRevealed: boolean
  tutorialDone: boolean
  reducedMotion?: boolean
  navBeaconSiteId?: string | null
}
```

Storage key: `pj-go-save-v1`. Full contracts: [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md).

### F3. Runtime avatar

```ts
type AvatarState = {
  x: number // meters local
  z: number
  yaw: number
  source: 'virtual' | 'gps' | 'spawn'
}
```

---

## G. Technical solution (complete path)

### G1. Stack

- Vite + React + TypeScript  
- Zustand + localStorage  
- React Router  
- three + @react-three/fiber + drei (default; confirm in Phase 0 spike)  
- vite-plugin-pwa  
- GitHub repo `pj-go` + Pages  

### G2. Geo

1. Overpass extract buildings (+ water) for bbox → GeoJSON.  
2. Store `public/geo/port-jefferson-buildings.geojson`.  
3. Extrude in Three; origin at ferry terminal.  
4. Project GPS ↔ local meters (equirectangular village-scale).  

Full command recipe: [GEO_PIPELINE.md](./GEO_PIPELINE.md).

### G3. Modes

| Mode | Position update |
|------|-----------------|
| Virtual | Joystick velocity × dt; simple collision vs water AABB / building capsules (optional MVP: buildings visual-only, clamp to playable rectangle) |
| Live | `watchPosition` → lat/lng → local xz → lerp |

### G4. Cameras

- Follow: offset behind avatar, lookAt avatar.  
- Oblique: higher Y, pitch down, larger distance.  
- Toggle button top-right; save preference.

### G5. Puzzle

- Slot index from `puzzleSlot`.  
- Visual: grey cell → filled color/number → at 9 show finale image (CSS grid overlay or single image with clip paths; MVP = icon fill then swap to full art).

---

## H. Content & asset solution

- Nine sites with full English copy: [CONTENT_SITES.md](./CONTENT_SITES.md).  
- **How to obtain every material** (OSM extract, CC ferry photos with Commons links, icons, optional site stills): [ASSET_PIPELINE.md](./ASSET_PIPELINE.md).  
- Finale art: ferry hero still (rights-cleared) or simple original illustration — candidates listed in ASSET_PIPELINE §3.  
- Restaurant site uses zone name **Waterfront Dining** until a single venue is branded.  
- Log every downloaded still in [CREDITS.md](./CREDITS.md).

---

## I. Delivery steps (0 → shipped)

See also [PHASE_PLAN.md](./PHASE_PLAN.md) and [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md).

| Step | Name | Output |
|------|------|--------|
| 0 | Repo + spike | `pj-go` on GitHub; 3D avatar moves in white boxes |
| 1 | Sandbox | 9 check-ins + save + puzzle UI (Virtual) |
| 2 | Live + content | GPS path; full copy; ferry art |
| 3 | Harden + deploy | Perf, QA green, Pages live URL |

**Definition of Done (product):** Virtual player can finish 9/9 and see ferry finale on a phone browser via the public URL, with Live optional and documented.

---

## J. Operations

- Updates: push `main` → Actions → Pages.  
- Hotfix content: edit `checkpoints` JSON/TS + redeploy.  
- Incident: GPS broken → instruct Virtual; clear site data / unregister SW if stale PWA.  
- Analytics: none in MVP (privacy-simple).

---

## K. Out of scope (explicit)

Indoor third-person, camera photo matching, jump worlds, multiplayer, paid Google Maps, full-town 3D, App Store native, AI tour guide chat.

---

## L. Completeness checklist (this solution pack)

- [x] Product vision & MVP boundary  
- [x] Gameplay loop & modes  
- [x] 9 checkpoints + puzzle + ferry finale  
- [x] Tech stack & architecture  
- [x] Geo / white-box pipeline  
- [x] UI flows + tutorial + fallback  
- [x] Full site copy + UI copy deck  
- [x] Module contracts  
- [x] Acceptance / delivery gate  
- [x] Brand tokens  
- [x] Phased delivery + task breakdown  
- [x] Deploy & QA  
- [x] Credits / licensing notes  
- [x] Non-goals  
- [x] Asset acquisition pipeline  
- [x] **Implemented:** v0.1.0 app in `src/`, deployed via GitHub Pages  

Implementation status against the gate: [ACCEPTANCE.md](./ACCEPTANCE.md) §7.
