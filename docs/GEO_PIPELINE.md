# PJ Go — Geo & White-Box Pipeline

Complete steps from OpenStreetMap to in-game meshes.

---

## 1. Playable bounding box

```text
south: 40.9445
west:  -73.0740
north: 40.9510
east:  -73.0620
```

Adjust after first extract if file too large or coverage thin.

---

## 2. Overpass extract (buildings)

Example query (Overpass Turbo / HTTP API):

```overpass
[out:json][timeout:60];
(
  way["building"](40.9445,-73.0740,40.9510,-73.0620);
  relation["building"](40.9445,-73.0740,40.9510,-73.0620);
);
out body;
>;
out skel qt;
```

Also extract water for non-walkable:

```overpass
[out:json][timeout:60];
(
  way["natural"="water"](40.9445,-73.0740,40.9510,-73.0620);
  relation["natural"="water"](40.9445,-73.0740,40.9510,-73.0620);
  way["waterway"="riverbank"](40.9445,-73.0740,40.9510,-73.0620);
);
out body;
>;
out skel qt;
```

Convert OSM JSON → GeoJSON (e.g. `osmtogeojson` CLI or script).

**Commit artifacts**

- `public/geo/port-jefferson-buildings.geojson`
- `public/geo/port-jefferson-water.geojson`

---

## 3. Local projection

Origin (ferry terminal seed):

```text
lat0 = 40.94736
lng0 = -73.06979
```

Village-scale equirectangular:

```text
x = (lng - lng0) * cos(lat0_rad) * 111320
z = (lat0 - lat) * 110540          // choose sign so +Z is south or north consistently
```

Use the same helpers for checkpoints and GPS.

---

## 4. Extrusion rules

For each building polygon:

1. Skip if area &lt; 15 m² (noise).
2. Height:
   - `height` tag (meters) if present
   - else `building:levels` × 3.2 m
   - else default **9 m**
3. Material: matte light gray; priority sites optional soft tint.
4. Merge geometries by material where possible (perf).

---

## 5. Runtime load (Three / R3F)

1. `fetch` GeoJSON once; cache in memory.
2. Build `THREE.Group` of extruded meshes.
3. Add ground plane under bbox.
4. Add water meshes (blue, `receiveShadow` optional) + block Virtual movement when avatar AABB overlaps water (simple).
5. Place checkpoint markers (cylinder / pin) at projected site coords.

---

## 6. Optional satellite underlay

- Esri World Imagery tiles as a grounded plane via texture or separate MapLibre layer.
- MVP default: **solid ground + white boxes** first; add underlay if orientation is hard.
- Always show attribution if tiles used.

---

## 7. Refresh cadence

- Re-pull OSM when buildings look wrong (quarterly or pre-release).
- Keep previous GeoJSON in git for reproducible builds.

---

## 8. Phase 0 spike script (acceptance)

Script or scene must demonstrate:

1. ≥20 extruded buildings visible  
2. Avatar translates with WASD  
3. One checkpoint sphere at ferry terminal projection  
4. Runs in Chrome desktop  

Document spike choice (Three vs MapLibre) in ARCHITECTURE.md.
