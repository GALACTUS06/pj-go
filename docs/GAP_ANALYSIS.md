# PJ Go — Developer Gap Analysis

Review date: 2026-11-20 (updated after fill-pass)  
Reviewer role: implementing engineer

## Verdict

**Build-ready.** Specs, algorithms, copy, acceptance, scaffold, and MVP assets are in the pack.  
Remaining work is **coding + GitHub `pj-go` + deploy** — not missing product decisions.

See [BUILD_READY.md](./BUILD_READY.md).

---

## A. Artifacts (now present)

| Item | Status |
|------|--------|
| Buildings GeoJSON | `public/geo/port-jefferson-buildings.geojson` (381) |
| Water collider | `public/geo/port-jefferson-water.geojson` (hand-authored basin) |
| Ferry finale | `public/finale/ferry-puzzle.jpg` + CREDITS |
| Icons / favicon | SVG mark shipped |
| Reference domain / copy / tokens | `reference/` |
| Acceptance + copy deck + contracts + scaffold | `docs/` |

Still not created (execution): GitHub `pj-go`, application source, Live field QA.

---

## B. Playability locks (applied)

B1 wayfinding · B2 free order · B3 speeds/collisions · B4 spawn/Live clamp · B5 tutorial · B6 WebGL fallback · B7 brand tokens · B8 privacy · B9 puzzleSlot · B10 debug teleport · B11 Vitest · B12 OG tags — all locked in COMPLETE_SOLUTION / MODULE_CONTRACTS / COPY_DECK / data JSON.

---

## C. Residual engineering notes (non-blocking)

1. Fetch script is ways-first; relation multipolygons may need a later upgrade.  
2. Tune water polygon on first Virtual playtest.  
3. CC BY-SA finale → credit + share-alike for crops.  
4. Rasterize icons to 192/512 PNG if a device rejects SVG-only PWA icons.  
5. Wipe Stony Brook leftover `src/` / `public/maps/` when scaffolding `pj-go`.

---

## D. Next execution order

1. `gh repo create pj-go` (new remote).  
2. Clean SBU leftovers; scaffold per [SCAFFOLD.md](./SCAFFOLD.md).  
3. Implement per [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md).  
4. Pass [ACCEPTANCE.md](./ACCEPTANCE.md); tag `v0.1.0`.
