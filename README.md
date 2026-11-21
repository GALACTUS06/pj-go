# PJ Go

A location-based exploration game for **Port Jefferson, NY**.

Walk a 3D white-box model of the harbor (built from OpenStreetMap), check in at **9 real places**, collect a puzzle piece at each, and reveal the **Port Jefferson ↔ Bridgeport ferry** finale.

**Play:** https://galactus06.github.io/pj-go/

| Mode | How the walker moves | Needed to finish? |
|------|----------------------|-------------------|
| **Virtual** | On-screen stick (or WASD) | Yes — the whole game works from anywhere |
| **Live** | Your phone's GPS | No — optional, best on-site |

---

## How to play

1. **Start Virtual Walk** on the home screen.
2. Drag the stick to walk; drag anywhere else on the view to turn. On a keyboard: WASD / arrows to move, Q/E to turn, C to switch camera, Enter to check in.
3. Follow the **Next** chip and its arrow to the nearest glowing marker. **Sites** lists all 9 — tap **Go** to point the arrow at one.
4. Inside a marker's ring, tap **Check in**, read the story, and **Collect puzzle piece**.
5. With all 9 pieces, open **Puzzle** → **Reveal the ferry**.

**Overview** camera lifts the view above the rooftops. Progress is saved in the browser; **Settings → Reset all progress** starts over.

If 3D can't start (no WebGL), the game switches to a site list that still lets you collect all 9 pieces.

---

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/pj-go/
npm test           # domain + data tests (Vitest)
npm run build      # type-check + production build to dist/
npm run preview
```

Data refresh (optional):

```bash
node scripts/fetch-osm.mjs          # buildings (+ streets) from Overpass
python scripts/build-water.py       # harbor water from the OSM coastline
npm run icons                       # rasterize public/icons/icon.svg
```

Deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy-pages.yml`).  
If a phone keeps showing an old build, open `/pj-go/clear-cache.html`.

### Layout

| Path | What |
|------|------|
| `data/checkpoints.template.json` | The 9 sites: coordinates, radius, copy, puzzle slot |
| `src/domain/` | Projection, check-in, save, water collision (unit-tested) |
| `src/scene/` | Three.js / R3F scene: buildings, water, avatar, markers, cameras |
| `src/pages/` | Home, Play, Puzzle, Finale, Settings, 2D fallback |
| `src/copy/en.ts` | Every UI string |
| `public/geo/` | OSM-derived GeoJSON |
| `docs/` | Product spec, acceptance criteria, QA checklist |

---

## Credits

- Buildings and coastline © OpenStreetMap contributors (ODbL)
- Ferry photo: “Port Jefferson ferry” — Finavon / Wikimedia Commons, CC BY-SA 3.0
- Not affiliated with the Bridgeport & Port Jefferson Steamboat Company

Full list: [docs/CREDITS.md](docs/CREDITS.md). Earlier Stony Brook prototype: [`GALACTUS06/sb-go`](https://github.com/GALACTUS06/sb-go) (tag `sbu-archive-v0.1.5`).
