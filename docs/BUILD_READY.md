# PJ Go — Build-Ready Verdict

**Date:** 2026-11-20  

## Can a developer deliver the MVP from this pack?

**Yes.** Product decisions, algorithms, copy, acceptance gates, scaffold, and required assets are present. Remaining work is **implementation coding + repo create + deploy** — not further product discovery.

---

## What you have now

| Layer | Status |
|-------|--------|
| Product / MVP boundary | Locked |
| Playability rules (wayfinding, speed, collisions, tutorial, fallback) | Locked |
| Acceptance criteria | [ACCEPTANCE.md](./ACCEPTANCE.md) |
| Module algorithms | [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md) + [`reference/domain/`](../reference/domain/) |
| Full UI copy | [COPY_DECK.md](./COPY_DECK.md) + `reference/copy/en.ts` |
| Brand tokens | [BRAND_TOKENS.md](./BRAND_TOKENS.md) + `reference/styles/tokens.css` |
| 9 sites + puzzleSlot + full blurbs | `data/checkpoints.template.json` |
| OSM buildings GeoJSON | `public/geo/port-jefferson-buildings.geojson` (381 features) |
| Water collider | `public/geo/port-jefferson-water.geojson` (playable harbor polys) |
| Ferry finale still + credits | `public/finale/ferry-puzzle.jpg` + [CREDITS.md](./CREDITS.md) |
| Icons / favicon | `public/icons/icon.svg`, `public/favicon.svg` |
| Scaffold / deps / PWA | [SCAFFOLD.md](./SCAFFOLD.md) |
| OSM fetch script | `scripts/fetch-osm.mjs` |
| Clear-cache helper | `public/clear-cache.html` |

---

## What you still execute (not “missing specs”)

1. Create GitHub repo `pj-go` (do not overwrite `sb-go`).  
2. Delete Stony Brook leftover app code in this folder when scaffolding.  
3. Scaffold Vite app per SCAFFOLD; copy `reference/` → `src/`.  
4. Implement screens/scene per IMPLEMENTATION_TASKS.  
5. Deploy Pages; run ACCEPTANCE matrix; tag `v0.1.0`.

---

## Known engineering caveats (documented, not blockers)

- OSM **relation** multipolygons are simplified in the fetch script (ways-first); 381 building ways are enough for white-box MVP.  
- Water uses a **hand-authored** harbor basin because OSM water tags in-bbox were sparse — tune on first playtest.  
- Finale image is **CC BY-SA 3.0** — credit + share-alike for adaptations.  
- Export raster 192/512 PNG from `icon.svg` if a store/PWA installer rejects SVG-only icons.

---

## Definition of done pointer

Ship when [ACCEPTANCE.md](./ACCEPTANCE.md) §2 is green on the public URL.
