# PJ Go — Credits & Licenses

Keep this file in sync with every external file under `public/`.

---

## Map data

| Asset | Credit | License | Path |
|-------|--------|---------|------|
| Building footprints | © OpenStreetMap contributors | [ODbL](https://www.openstreetmap.org/copyright) | `public/geo/port-jefferson-buildings.geojson` |
| Harbor water | Derived from OSM `natural=coastline` (`scripts/build-water.py`) | ODbL | `public/geo/port-jefferson-water.geojson` |
| Streets (render + walking routes) | © OpenStreetMap contributors | ODbL | `public/geo/port-jefferson-roads.geojson` |

**On-screen:** Home footer + Settings — `Map data © OpenStreetMap`

---

## Finale art

| Field | Value |
|-------|-------|
| File | `public/finale/ferry-puzzle.jpg` |
| Commons title | Port Jefferson ferry.JPG |
| Author | Finavon (original upload credited via Commons / Iracaz lineage on wiki) |
| License | **CC BY-SA 3.0** |
| Source | https://commons.wikimedia.org/wiki/File:Port_Jefferson_ferry.JPG |
| Retrieved | 2026-11-20 (via images.weserv.nl resize proxy) |
| Share-alike note | Adapted puzzle crops of this image remain under CC BY-SA 3.0; credit this entry. |

**On-screen Settings credits line:**

> Ferry photo: “Port Jefferson ferry” — Finavon / Wikimedia Commons, CC BY-SA 3.0.

---

## Site unlock photos

Shown when a piece is unlocked and in the site sheet afterwards. Files: `public/sites/<id>.jpg` (resized to 960 px), metadata in `data/site-photos.json`, fetched by `scripts/fetch-site-photos.py` on 2026-11-21. Each photo carries its own credit line in-game. Commons has no free photo of the Mather House or the Drowned Meadow Cottage, so those two sites show the nearest identified streetscape, captioned as such.

| Site | Commons file | Author | License |
|------|--------------|--------|---------|
| Ferry Terminal | [Port Jefferson x DJI Mavic Pro.jpg](https://commons.wikimedia.org/wiki/File:Port_Jefferson_x_DJI_Mavic_Pro.jpg) | John Feinberg | CC BY 2.0 |
| Shipbuilders Memorial | [Harborfront Park, Port Jefferson, New York - 20221124.jpg](https://commons.wikimedia.org/wiki/File:Harborfront_Park,_Port_Jefferson,_New_York_-_20221124.jpg) | Andre Carrotflower | CC BY-SA 4.0 |
| Bayles Shipyard | [Bayles Shipyard 1917 Machine Shop and Mould Loft Dec 07.jpg](https://commons.wikimedia.org/wiki/File:Bayles_Shipyard_1917_Machine_Shop_and_Mould_Loft_Dec_07.jpg) | Doug Kerr | CC BY-SA 2.0 |
| Village Center | [Port Jefferson Village Center2.jpg](https://commons.wikimedia.org/wiki/File:Port_Jefferson_Village_Center2.jpg) | Iracaz | Public domain |
| Historical Society Museum | [East Main Street decorated for the holidays…](https://commons.wikimedia.org/wiki/File:East_Main_Street_decorated_for_the_holidays,_Port_Jefferson,_New_York_-_20221124.jpg) | Andre Carrotflower | CC BY-SA 4.0 |
| Main Street | [Port Jefferson Main Street 2010.jpg](https://commons.wikimedia.org/wiki/File:Port_Jefferson_Main_Street_2010.jpg) | Wusel007 | CC BY-SA 3.0 |
| Waterfront Dining | [At Long Island 2023 072.jpg](https://commons.wikimedia.org/wiki/File:At_Long_Island_2023_072.jpg) | Mike Peel | CC BY-SA 4.0 |
| Drowned Meadow Cottage | [At Long Island 2023 096.jpg](https://commons.wikimedia.org/wiki/File:At_Long_Island_2023_096.jpg) | Mike Peel | CC BY-SA 4.0 |
| Harbor Overlook | [Harbor view, Port Jefferson, New York - 20221124.jpg](https://commons.wikimedia.org/wiki/File:Harbor_view,_Port_Jefferson,_New_York_-_20221124.jpg) | Andre Carrotflower | CC BY-SA 4.0 |

Resized copies of CC BY-SA photos remain under their original license.

---

## Icons / brand mark

| Asset | Credit | License |
|-------|--------|---------|
| `public/favicon.svg`, `public/icons/icon.svg`, `icon-192.png`, `icon-512.png` | Original PJ Go mark (ferry silhouette + PJ) | Original |

Not affiliated with Bridgeport & Port Jefferson Steamboat Company trademarks.

---

## Imagery (optional underlay)

If Esri World Imagery is enabled at runtime:

> Tiles © Esri — follow current Esri attribution string in the HUD/Settings.

---

## Historical copy research

Public web summaries consulted for blurbs (not reproduced wholesale):

- Historical Society of Greater Port Jefferson / Mather House Museum  
- Bayles Shipyard NRHP public descriptions  
- Harborfront Park / shipbuilders sculpture local reporting  
- Public ferry terminal listings  

---

## Stony Brook archive

Prior campus prototype archived at [`GALACTUS06/sb-go`](https://github.com/GALACTUS06/sb-go) tag `sbu-archive-v0.1.5` — not shipped in PJ Go.
