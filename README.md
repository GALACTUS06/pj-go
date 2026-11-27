# PJ Go

A location-based exploration game for **Port Jefferson, NY**.

You step off the Bridgeport ferry and miss the last boat back. Hal, an old shipwright, says you could build your own sloop — if the village helps. Walk a 3D white-box model of the harbor (built from OpenStreetMap), play a short **Port Jeff mini game at 9 real places** to earn a ship part at each, pick up **3 tools** lying on the streets, then build the boat at **Hal's Shipyard** and sail out past the ferry.

**Play:** https://galactus06.github.io/pj-go/

| Mode | How the walker moves | Needed to finish? |
|------|----------------------|-------------------|
| **Virtual** | On-screen stick (or WASD) | Yes — the whole game works from anywhere |
| **Live** | Your phone's GPS | No — optional, best on-site |

---

## How to play

1. **Start Virtual Walk** on the home screen.
2. Drag the stick to walk; drag anywhere else on the view to turn. On a keyboard: WASD / arrows to move, Q/E to turn, C to switch camera, Enter to check in.
3. Follow the **blue line**: it routes along the streets to the nearest stop or tool you still need (the chip shows the walking distance). Tap **Walk route** to let the walker follow it on its own; touching the stick takes back control. **Sites** lists every stop and tool — tap **Go** to route to one.
4. Buildings and the harbor are solid — walk around them. Inside a marker's ring, tap **Check in**, read about the place, then **Help out** with its mini game to earn a ship part. Lose once and you can try again or skip and take the part anyway.
5. Tools (mallet, saw, caulking iron) are picked up automatically when you walk over their teal markers.
6. With 9 parts and 3 tools, open **Shipyard** → **Build the sloop** → **Launch her**.

| Stop | Mini game | Part |
|------|-----------|------|
| Ferry Terminal | Dock the Ferry — throw the lines when she's in the slip | Anchor |
| Shipbuilders Memorial | Carry the Frame — keep the rib level down to the water | Frames |
| Bayles Shipyard | Steam-Bend the Planks — hold the steam box in the green band | Hull planks |
| Village Center | Knot Drill — repeat the bosun's knot sequence | Mast & rigging |
| Historical Society Museum | Harbor History Quiz | Rudder |
| Main Street | Sailmaker's Match — memory pairs | Sail |
| Waterfront Dining | Catch the Provisions | Provisions |
| Drowned Meadow Cottage Museum | Meadow Timeline — put the village's history in order | Keel |
| Harbor Overlook | Red Right Returning — pass the channel buoys correctly | Compass |

Hal and the people at each stop are fictional; the places and the history in the games are real. **Story** on the home screen replays the intro.

**Overview** camera lifts the view above the rooftops. Progress is saved in the browser; **Settings → Reset all progress** starts over.

If 3D can't start (no WebGL), the game switches to a 2D list with the same stops, mini games and tools.

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
python scripts/fetch-site-photos.py # unlock photos + credits from Wikimedia Commons
```

Deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy-pages.yml`).  
If a phone keeps showing an old build, open `/pj-go/clear-cache.html`.

### Layout

| Path | What |
|------|------|
| `data/checkpoints.template.json` | The 9 sites: coordinates, radius, copy, list order |
| `src/data/story.ts` | Storyline, Hal's lines, part and game per site, street tool positions |
| `src/games/` | The 9 mini games |
| `data/site-photos.json` | Unlock photo per site with author, license, source |
| `src/domain/` | Projection, check-in, save, wall/water collision, street routing (unit-tested) |
| `src/scene/` | Three.js / R3F scene: buildings, water, avatar, markers, cameras |
| `src/pages/` | Home, Play, Shipyard, Finale, Settings, 2D fallback |
| `src/copy/en.ts` | Every UI string |
| `public/geo/` | OSM-derived GeoJSON |
| `docs/` | Product spec, acceptance criteria, QA checklist |

---

## Credits

- Buildings, streets and coastline © OpenStreetMap contributors (ODbL)
- Ferry photo: “Port Jefferson ferry” — Finavon / Wikimedia Commons, CC BY-SA 3.0
- Site photos: Wikimedia Commons contributors (John Feinberg, Andre Carrotflower, Doug Kerr, Iracaz, Wusel007, Mike Peel) — CC BY / CC BY-SA / public domain; each credited in-game
- Not affiliated with the Bridgeport & Port Jefferson Steamboat Company

Full list: [docs/CREDITS.md](docs/CREDITS.md). Earlier Stony Brook prototype: [`GALACTUS06/sb-go`](https://github.com/GALACTUS06/sb-go) (tag `sbu-archive-v0.1.5`).
