# PJ Go — Asset Acquisition Pipeline (找素材)

**Status:** This was only sketched in CREDITS before; this doc is the **complete materials plan**.

Covers **what** to obtain, **where** to look (free/legal), **how** to process, and **where** files live in the repo.

---

## 1. Asset inventory (MVP)

| ID | Asset | Required? | Source class | Target path |
|----|--------|-----------|--------------|-------------|
| A1 | Building footprints GeoJSON | **Yes** | OSM / Overpass | `public/geo/port-jefferson-buildings.geojson` |
| A2 | Water polygons GeoJSON | **Yes** | OSM / Overpass | `public/geo/port-jefferson-water.geojson` |
| A3 | Ferry finale still (hero) | **Yes** | CC / PD photo or original art | `public/finale/ferry-puzzle.jpg` |
| A4 | Optional 9 piece thumbnails | No (can use solid tiles) | Crop from A3 or flat colors | `public/finale/pieces/0..8.jpg` |
| A5 | App icons 192 / 512 | **Yes** | Original simple mark | `public/icons/icon-192.png`, `icon-512.png` |
| A6 | Favicon | **Yes** | Same mark | `public/favicon.svg` |
| A7 | Satellite underlay | Optional | Esri World Imagery (runtime tiles) | *no file* — attribution only |
| A8 | Checkpoint marker meshes/textures | No | Code-generated (drei helpers) | none |
| A9 | Avatar mesh | No | Primitive capsule/box or free CC0 humanoid | `public/models/avatar.glb` optional |
| A10 | UI sounds | No | Skip MVP | — |
| A11 | Site reference photos (optional sheet art) | No | CC only if shown | `public/places/{id}.jpg` |

**MVP minimum to ship:** A1 + A2 + A3 + A5 + A6.

---

## 2. Map / 3D geometry (A1, A2)

### Where

1. [Overpass Turbo](https://overpass-turbo.eu/)
2. Or Overpass API HTTPS

### How

Follow [GEO_PIPELINE.md](./GEO_PIPELINE.md) queries for the harbor bbox.

### Convert

```bash
# example tooling (install when implementing)
npx --yes osmtogeojson buildings.osm > public/geo/port-jefferson-buildings.geojson
```

### License

© OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright).  
Show credit in Settings + Home footer.

### Acceptance

- File loads in PlayScene.
- ≥20 building footprints visible in bbox.
- Water distinguishable for collision / tint.

---

## 3. Ferry finale image (A3) — critical

### Goal

One strong still of the **Port Jefferson ↔ Bridgeport ferry** (vessel and/or terminal with boat), suitable as 3×3 puzzle hero (~1600px+ wide).

### Where to search (free / rights-aware)

| Source | How to search | Notes |
|--------|---------------|-------|
| [Openverse](https://openverse.org/) | `Port Jefferson ferry`, `Bridgeport Port Jefferson steamboat` | Filter license: CC0 / BY / BY-SA; avoid NC if you need commercial flexibility |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Category / search: Port Jefferson, Bridgeport ferry | Prefer CC BY-SA / CC0; download “Original file” |
| Flickr (via Openverse) | Same queries | Check each license badge before download |
| Original | Shoot at terminal / simple vector illustration | Cleanest rights |

### Concrete Commons starting points (verify license on download day)

| Candidate | Commons page |
|-----------|----------------|
| Category: Bridgeport and Port Jefferson Ferry | https://commons.wikimedia.org/wiki/Category:Bridgeport_and_Port_Jefferson_Ferry |
| `Port Jefferson ferry.JPG` | https://commons.wikimedia.org/wiki/File:Port_Jefferson_ferry.JPG |
| Ferry terminal west side (CC BY-SA 4.0, DanTD) | https://commons.wikimedia.org/wiki/File:Port_Jefferson-Bridgeport_Ferry_Terminal;_West_Side.jpg |
| Harbor stills | https://commons.wikimedia.org/wiki/Category:Port_Jefferson_Harbor |
| Ships: Park City / P.T. Barnum / Grand Republic | Subcats under the ferry category above |

### Do **not** use without rights

- Random Google Images / Instagram / ferry company promo PDFs unless license is clear.
- Getty / tourism stock marked All Rights Reserved.

### Process

1. Download highest resolution allowed.
2. Crop to landscape 3:2 or 1:1 for puzzle board.
3. Export JPEG quality ~85, long edge 1920px → `public/finale/ferry-puzzle.jpg`.
4. Record in [CREDITS.md](./CREDITS.md): title, author, license, URL, date retrieved.

### Optional puzzle pieces (A4)

- Slice finale into 3×3 with a script (ImageMagick / Pillow), **or**
- MVP: colored cells + numbers; swap to full image on reveal only (less asset work).

### Acceptance

- Finale screen shows recognizable ferry.
- CREDITS entry filled (not TBD).

---

## 4. Optional site photos (A11)

Only if Check-in sheet should show a photo above the blurb.

| Site | Search terms |
|------|----------------|
| Shipbuilders Memorial | `Port Jefferson shipbuilders sculpture Harborfront` |
| Ferry terminal | `Port Jefferson ferry terminal` |
| Bayles | `Bayles Shipyard Port Jefferson` |
| Historical Society | `Mather House Museum Port Jefferson` |
| Others | Site name + `Port Jefferson NY` |

Same license rules as §3. If no clean CC hit → **text-only sheet** (allowed).

---

## 5. Brand / icons (A5, A6)

### Decision (default)

Original flat icon: ferry silhouette + “PJ” monogram on solid harbor blue/red — **no trademarked ferry-company logo**.

### Tools

- Figma / Affinity / Inkscape → export PNG 192 & 512.
- Or generate simple SVG favicon by hand in repo.

### Acceptance

- PWA manifest icons resolve under `/pj-go/`.
- Home “Add to Home Screen” shows custom icon.

---

## 6. Avatar (A9)

**Default MVP:** code-only capsule / low poly (no download).  
**Optional later:** CC0 glTF from [Quaternius](https://quaternius.com/), [Kenney](https://kenney.nl/), Poly Pizza — keep under `public/models/` + credit.

---

## 7. Satellite underlay (A7)

- **Not a downloaded asset file** for MVP if using XYZ tiles.
- Provider default: Esri World Imagery (check current attribution string).
- Alternative: omit underlay; white-box + flat ground only.

---

## 8. Folder layout when assets land

```text
public/
  geo/
    port-jefferson-buildings.geojson
    port-jefferson-water.geojson
  finale/
    ferry-puzzle.jpg
    pieces/          # optional
  icons/
    icon-192.png
    icon-512.png
  favicon.svg
  places/            # optional site stills
  models/            # optional avatar.glb
docs/
  CREDITS.md         # must list every external still
```

---

## 9. Acquisition checklist (do in Step 2 before ship)

- [ ] A1 buildings GeoJSON committed  
- [ ] A2 water GeoJSON committed  
- [ ] A3 ferry finale downloaded **with license logged in CREDITS**  
- [ ] A5/A6 icons created  
- [ ] Optional A11 skipped or CC-cleared  
- [ ] No All-Rights-Reserved images in `public/`  

---

## 10. Scripting (when implementing)

Suggested helpers (create during Phase 1–2):

| Script | Purpose |
|--------|---------|
| `scripts/fetch-osm.mjs` | Overpass pull + write GeoJSON |
| `scripts/slice-finale.py` | Optional 3×3 piece export |
| `scripts/verify-credits.mjs` | Fail CI if `public/**/*.{jpg,png}` lacks CREDITS mention (nice-to-have) |

---

## 11. Relation to other docs

| Need | Doc |
|------|-----|
| OSM commands / bbox | [GEO_PIPELINE.md](./GEO_PIPELINE.md) |
| License text on screen | [CREDITS.md](./CREDITS.md) |
| When assets appear in schedule | [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) Step 0.5, 2.4 |
| Master index | [COMPLETE_SOLUTION.md](./COMPLETE_SOLUTION.md) |
