# PJ Go (temporary name)

Location-based exploration game for **Port Jefferson, NY**.

Walk a compact **3D white-box harbor map**, visit **9 checkpoints**, collect puzzle pieces, and reveal the **Port Jefferson ↔ Bridgeport ferry** finale.

| Mode | Avatar control | Required to finish? |
|------|----------------|---------------------|
| **Virtual** | On-screen joystick | **Yes** — full clear |
| **Live** | Device GPS | No — optional |

Stony Brook prototype archive: [`GALACTUS06/sb-go`](https://github.com/GALACTUS06/sb-go) tag `sbu-archive-v0.1.5`.

---

## Build-ready pack

**Yes — a developer can implement and ship the MVP from this tree.**  
Verdict: [docs/BUILD_READY.md](docs/BUILD_READY.md) · Delivery gate: [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md)

Master index: **[docs/COMPLETE_SOLUTION.md](docs/COMPLETE_SOLUTION.md)**

### Detail packs

| Doc | Contents |
|-----|----------|
| [COMPLETE_SOLUTION.md](docs/COMPLETE_SOLUTION.md) | Master solution |
| [ACCEPTANCE.md](docs/ACCEPTANCE.md) | When MVP is delivered |
| [BUILD_READY.md](docs/BUILD_READY.md) | What’s on disk vs left to code |
| [MODULE_CONTRACTS.md](docs/MODULE_CONTRACTS.md) | Algorithms & APIs |
| [COPY_DECK.md](docs/COPY_DECK.md) | Every UI string |
| [BRAND_TOKENS.md](docs/BRAND_TOKENS.md) | Visual tokens |
| [SCAFFOLD.md](docs/SCAFFOLD.md) | App tree + dependencies |
| [DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) | Locked product decisions |
| [PHASE_PLAN.md](docs/PHASE_PLAN.md) | Phases 0–3 |
| [IMPLEMENTATION_TASKS.md](docs/IMPLEMENTATION_TASKS.md) | Ticket checklist |
| [UI_FLOWS.md](docs/UI_FLOWS.md) | Screens & HUD |
| [GEO_PIPELINE.md](docs/GEO_PIPELINE.md) | OSM → white-box |
| [CHECKPOINTS.md](docs/CHECKPOINTS.md) | 9 sites |
| [CONTENT_SITES.md](docs/CONTENT_SITES.md) | Site copy |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack & modules |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Repo + Pages |
| [QA_CHECKLIST.md](docs/QA_CHECKLIST.md) | Manual tests |
| [ASSET_PIPELINE.md](docs/ASSET_PIPELINE.md) | Materials plan |
| [GAP_ANALYSIS.md](docs/GAP_ANALYSIS.md) | Engineer review |
| [CREDITS.md](docs/CREDITS.md) | Licenses |

### Machine-readable / assets

| Path | Role |
|------|------|
| [data/checkpoints.template.json](data/checkpoints.template.json) | 9 sites + movement + wayfinding |
| [reference/](reference/) | Drop-in domain TS + copy + CSS tokens |
| [public/geo/](public/geo/) | Buildings + water GeoJSON |
| [public/finale/ferry-puzzle.jpg](public/finale/ferry-puzzle.jpg) | Finale still |
| [public/icons/](public/icons/) · [public/favicon.svg](public/favicon.svg) | App mark |
| [scripts/fetch-osm.mjs](scripts/fetch-osm.mjs) | Re-pull OSM |

---

## Status

| Layer | State |
|-------|--------|
| Solution / docs / contracts / copy | **Complete** |
| Required MVP assets (geo, ferry, icons) | **On disk** |
| Application code (`pj-go` scaffold) | Not started — wipe SBU leftovers first |
| GitHub `pj-go` remote | Not created yet |

Next: create `pj-go` + scaffold per `docs/SCAFFOLD.md` and `docs/IMPLEMENTATION_TASKS.md`.
