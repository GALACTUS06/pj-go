# PJ Go — Detailed Development Plan

**Product (temporary):** PJ Go  
**Setting:** Port Jefferson Village, New York (harbor / downtown core)  
**Document status:** Locked for MVP implementation  
**Language:** English UI and content  

> **Master index:** For the full end-to-end solution (flows, geo pipeline, tasks, deploy, copy), see **[COMPLETE_SOLUTION.md](./COMPLETE_SOLUTION.md)**.

---

## 1. Vision

PJ Go is a lightweight outdoor exploration game. The player controls (or GPS-follows) an avatar on a **small 3D white-box map** of Port Jefferson’s harbor district, checks in at **nine fixed sites**, collects **one puzzle piece per site**, and assembles a finale image of the **Port Jefferson–Bridgeport ferry** — the village’s signature link between Long Island and Connecticut.

The game teaches place through short historical blurbs at each stop. It does **not** require indoor floor plans, camera scanning, or paid map APIs for MVP.

---

## 2. Goals and non-goals

### Goals (MVP)

- Free map materials only (no Google Maps billing).
- 3D **white-box** buildings extruded from OpenStreetMap (or equivalent) for the harbor corridor.
- Player avatar in the 3D scene.
- **Virtual mode:** stick / D-pad style controls move the avatar; full completion possible.
- **Live mode (optional):** GPS updates avatar position; not required to finish.
- Nine checkpoints; one puzzle piece each; finale = ferry layout / harbor ferry image.
- Switchable camera: **third-person follow** ↔ **oblique top-down** (reduce building occlusion).
- Short English story text at check-in.
- PWA-capable web build; deployable to GitHub Pages (or similar free static host).

### Non-goals (post-MVP)

- Indoor third-person rooms, hold-to-scan camera matching, jump “memory worlds.”
- Free-form LLM tour guide.
- Full-village 3D coverage beyond the harbor / downtown playable box.
- Native App Store / Play Store release (reuse PWA first).
- Multiplayer.

---

## 3. Core gameplay loop

```text
Enter harbor 3D map
    → Move avatar (Virtual controls OR optional GPS)
    → Enter checkpoint radius
    → Check in → read short history → unlock puzzle piece
    → Repeat until 9 / 9
    → Assemble / reveal ferry finale
```

**Check-in rule (both modes):** Euclidean distance between avatar and site center `< radiusM` → “Check in” enabled.  
Virtual and Live share the **same site table** and **same progress flags**.

---

## 4. Play modes

| Mode | Avatar transform | Requirement |
|------|------------------|-------------|
| Virtual | Keyboard / on-screen joystick + Interact | **Must** allow 100% completion |
| Live | Lat/lng → scene XZ via map projection; smoothed | Optional; degrade gracefully if permission denied |

**Live smoothing:** low-pass filter + max step per frame; optional snap-to-walkable when near paths. Show accuracy chip when `accuracyM` is poor; widen radius slightly when noisy rather than blocking check-in forever.

---

## 5. Camera

Two modes, user-toggle, persist preference in save:

1. **Follow (third-person)** — behind / over-shoulder of avatar; collision-aware boom if cheap to add, else fixed offset.
2. **Oblique top-down** — elevated pitch (~45–60°), pulls back to reduce façade occlusion.

Both frame the avatar; neither is “free fly” in MVP.

---

## 6. World and white-box 3D

### Playable bounds (approximate AABB)

Focus on harbor + village center, not entire Brookhaven:

- Lat ≈ `40.9445` … `40.9510`
- Lng ≈ `-73.0740` … `-73.0620`

Tighten after first OSM extract if mesh is heavy.

### White-box pipeline (decided)

1. Extract OSM buildings (+ optional highways) for the bbox via Overpass.
2. Extrude footprints with `building:levels` / `height` when present; default e.g. 3.5 m × levels or 9 m fallback.
3. Prefer **runtime extrusion in MapLibre / Three-layer** *or* one-time export to a compact glTF for the bbox — choose at Phase 1 spike; default lean: **MapLibre GL JS + 3D buildings fill-extrusion** or **Three.js + GeoJSON extrude** if avatar physics are easier in Three.
4. Ground: flat plane or gentle DEM skip for MVP; water as non-walkable collider / blue plane from OSM `natural=water` / harbor polygons.
5. No PBR textures required — unlit / matte white-gray materials + simple fog.

### Free basemap (under or beside 3D)

- Satellite optional: Esri World Imagery (attribution required) as muted underlay, **or**
- Solid / gradient ground + white boxes only if satellite clutters mobile GPUs.

**Decision default:** muted satellite underlay + white extrusions + clear checkpoint markers.

---

## 7. Checkpoints (9) and puzzle economy

**Rule:** 1 site → 1 piece → 9 pieces total.

| # | ID | Name | Role |
|---|----|------|------|
| 1 | `shipbuilders-memorial` | Shipbuilders Memorial (Harborfront Park) | Priority — sculpture / shipbuilding honor |
| 2 | `ferry-terminal` | Ferry Terminal | Priority-adjacent — PJ↔Bridgeport ferry |
| 3 | `bayles-shipyard` | Bayles Shipyard / Village Center waterfront | Priority — NRHP shipyard / Village Center complex |
| 4 | `historical-society` | Port Jefferson Historical Society (Mather House) | Priority — museum complex |
| 5 | `village-center` | Village Center / downtown core | Civic / gathering |
| 6 | `main-street` | Main Street corridor | Commercial village character |
| 7 | `harbourfront-dining` | Harbourfront dining strip | “Famous restaurant” stand-in (e.g. Harbourfront / Danfords waterfront dining zone — tune pin on survey) |
| 8 | `drowned-meadow` | Drowned Meadow Cottage Museum | Local history depth |
| 9 | `harbor-overlook` | Harbor overlook / pier view | Scenic close — ferry sightline |

Seed coordinates and radii: see [CHECKPOINTS.md](./CHECKPOINTS.md). Re-survey on foot; treat listed lat/lng as v0 seeds.

**Finale:** composite “ferry puzzle” art — Port Jefferson–Bridgeport steamboat / ferry as hero. Pieces map to a 3×3 grid overlay on that image.

---

## 8. Content rules

- English only for MVP UI and site copy.
- Each site: `title`, `blurb` (1–2 sentences), `facts[]` (2–4 bullets), optional `sources[]` URLs.
- On check-in: show sheet → confirm → grant piece → toast.
- No camera photo verification in MVP.
- Optional one-line “guide” narrator string per site (static), not a chatbot.

---

## 9. Progress and save

Local-only (`localStorage`):

```ts
{
  version: 1,
  modePreference: 'virtual' | 'live',
  cameraPreference: 'follow' | 'oblique',
  checkedInSiteIds: string[],   // subset of 9
  puzzlePieceIds: string[],     // same as site ids for MVP
  finaleRevealed: boolean,
  tutorialDone: boolean,
  reducedMotion?: boolean,
  navBeaconSiteId?: string | null
}
```

Key: `pj-go-save-v1`. Reset in Settings. No account server.  
Contracts: [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md).

---

## 10. Tech stack (decided)

| Layer | Choice |
|-------|--------|
| App | Vite + React + TypeScript |
| 3D / map | Spike in Phase 0: **Three.js (R3F optional)** *or* **MapLibre + custom avatar layer** — pick one primary; default recommendation **Three.js scene** fed by OSM GeoJSON extrusions for simpler avatar + dual camera |
| State | Zustand |
| Routing | React Router (home, play, puzzle, settings) |
| PWA | vite-plugin-pwa |
| Hosting | New GitHub repo + GitHub Pages |
| CI | GitHub Actions pages deploy |

**Explicitly excluded for MVP:** Google Maps Platform, Mapbox paid tiles (unless free tier carefully capped — prefer Esri/OSM attribution stack).

---

## 11. UX surfaces

1. **Home** — PJ Go title, Start Virtual, optional Enable Live, Puzzle gallery entry, Settings.
2. **Play** — full-viewport 3D, joystick, Interact, camera toggle, piece counter `n/9`, minimap optional later.
3. **Check-in sheet** — title, blurb, facts, Collect piece.
4. **Puzzle board** — 3×3 slots; empty silhouette; filled thumbs; CTA when complete.
5. **Finale** — full ferry image + short closing copy.
6. **Settings** — clear save, mode help, attribution (OSM, Esri, ferry image credit).

---

## 12. Attribution and assets

- © OpenStreetMap contributors (ODbL) for building footprints.
- Esri World Imagery (if used) — follow Esri attribution guidelines.
- Ferry finale image — prefer public-domain / CC still, or original simple illustration if rights unclear; record credit in `CREDITS.md`.
- Do not scrape copyrighted restaurant brand art without license; use location pin + text only.

---

## 13. Repository and naming

- **New GitHub repository** (do not overwrite `GALACTUS06/sb-go`).
- Working title: **PJ Go**.
- Suggested repo id: `pj-go`.
- Package name: `pj-go`.
- Pages URL pattern: `https://<user>.github.io/pj-go/`.

---

## 14. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| GPS drift near harbor | Virtual-first; Live smoothing; generous radii (35–60 m) |
| OSM heights missing | Default extrusion heights; hand-tune 3 priority buildings |
| Mobile GPU load | Small bbox; merge meshes; cap pixel ratio; oblique camera default on low-end |
| Occlusion | Camera toggle; raise oblique height near tall extrusions |
| Wrong restaurant pin | Treat as “waterfront dining zone”; rename after local confirm |

---

## 15. Success criteria (MVP done)

- [ ] Virtual: walk to all 9 sites, collect 9 pieces, reveal ferry finale on phone-sized viewport.
- [ ] Live: with GPS granted, avatar tracks; at least 3 sites check-in verified outdoors (manual QA).
- [ ] Camera toggle works without breaking controls.
- [ ] Cold load usable on mid-range phone over LTE.
- [ ] Attributions visible; no Google Maps key required.
- [ ] Deployed from new repo to GitHub Pages.

---

## 16. Open items (non-blocking)

- Final restaurant checkpoint display name after local preference (zone name **Waterfront Dining** ships).
- Whether minimap ships in phase 2+ (default: **not MVP**).
- On-foot survey of the nine pins (ferry terminal and dining were moved inland of the OSM coastline).

Ferry art, icons, GeoJSON, copy deck, acceptance, and module contracts are **closed**; v0.1.0 is implemented — see [ACCEPTANCE.md](./ACCEPTANCE.md) §7.
