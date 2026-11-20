# PJ Go — Checkpoints & Puzzle Mapping

Nine outdoor checkpoints. **One check-in → one puzzle piece.**  
Coordinates are **v0 seeds** (WGS84). Re-survey with phone GPS before lock.

Finale grid: **3×3**, piece `id` = site `id`.

---

## Priority trio (must feel strongest)

### 1. `shipbuilders-memorial`

| Field | Value |
|-------|-------|
| Display name | Shipbuilders Memorial |
| Area | Jeanne Garant Harborfront Park |
| Seed lat/lng | 40.94890, -73.06660 |
| Radius m | 45 |
| Puzzle slot | (1,1) center-top or assign in UI order |
| Blurb hook | Landmark sculpture of shipbuilders carrying a hull frame toward the harbor — honor to Port Jeff’s building yards. |

### 2. `ferry-terminal`

| Field | Value |
|-------|-------|
| Display name | Ferry Terminal |
| Area | Bridgeport & Port Jefferson Steamboat Co. terminal |
| Address hint | 102 W Broadway |
| Seed lat/lng | 40.94736, -73.06979 |
| Radius m | 50 |
| Blurb hook | The village’s living link to Connecticut — ferries across Long Island Sound to Bridgeport. |

### 3. `bayles-shipyard`

| Field | Value |
|-------|-------|
| Display name | Bayles Shipyard |
| Area | Historic shipyard / Village Center waterfront (NRHP) |
| Address hint | 101 E Broadway |
| Seed lat/lng | 40.94833, -73.06806 |
| Radius m | 50 |
| Blurb hook | From wooden shipbuilding to wartime work to today’s civic harbor uses — industrial heart of the waterfront. |

### 4. `historical-society`

| Field | Value |
|-------|-------|
| Display name | Historical Society Museum |
| Area | Mather House Museum complex |
| Address hint | 115 Prospect St |
| Seed lat/lng | 40.94601, -73.06561 |
| Radius m | 40 |
| Blurb hook | Mather family home and museum campus — clocks, tools, sail loft, and village memory. |

---

## Supporting sites (fill to nine)

### 5. `village-center`

| Field | Value |
|-------|-------|
| Display name | Village Center |
| Seed lat/lng | 40.94841, -73.06750 *(tune to plaza / Village Center entrance)* |
| Radius m | 40 |
| Blurb hook | Civic harbor hub in reused shipyard fabric — where industry became public space. |

### 6. `main-street`

| Field | Value |
|-------|-------|
| Display name | Main Street |
| Seed lat/lng | 40.94580, -73.06820 *(tune to E Main St corridor)* |
| Radius m | 40 |
| Blurb hook | Shop streets of the incorporated village — everyday Port Jeff between hill and harbor. |

### 7. `harbourfront-dining`

| Field | Value |
|-------|-------|
| Display name | Waterfront Dining |
| Seed lat/lng | 40.94820, -73.06720 *(Harbourfront / Danfords dining zone — confirm on survey)* |
| Radius m | 40 |
| Blurb hook | Harbor dining culture — visitors and locals sharing the working waterfront. |
| Note | Generic zone name until a single restaurant is officially preferred. |

### 8. `drowned-meadow`

| Field | Value |
|-------|-------|
| Display name | Drowned Meadow Cottage Museum |
| Address hint | 141 W Broadway |
| Seed lat/lng | 40.94553, -73.07200 |
| Radius m | 40 |
| Blurb hook | Early settlement memory near the meadow that became downtown — deeper than the ferry postcard. |

### 9. `harbor-overlook`

| Field | Value |
|-------|-------|
| Display name | Harbor Overlook |
| Seed lat/lng | 40.94910, -73.06780 *(pier / park sightline to Sound)* |
| Radius m | 45 |
| Blurb hook | Look out across the harbor — the same water the ferry still crosses to Bridgeport. |

---

## Puzzle finale

| Field | Value |
|-------|-------|
| Image concept | Port Jefferson–Bridgeport ferry (vessel and/or terminal departure) |
| Layout | 3×3 piece grid |
| Unlock | `checkedInSiteIds.length === 9` |
| Closing line (draft) | “Nine pieces of the harbor — one ferry still ties Long Island to Connecticut.” |

---

## Data file shape

See `data/checkpoints.template.json` for machine-readable seeds.
