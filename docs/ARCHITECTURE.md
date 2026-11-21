# PJ Go — Architecture

## 1. System overview

```text
┌─────────────────────────────────────────────┐
│                 React (Vite)                │
│  Home / Play / Puzzle / Settings            │
├──────────────┬──────────────────────────────┤
│ Zustand save │  PlayScene (3D)              │
│ localStorage │  - OSM white boxes           │
│              │  - Avatar                    │
│              │  - Checkpoint triggers       │
│              │  - Cameras (follow/oblique)  │
├──────────────┴──────────────────────────────┤
│ location/: GPS optional → projected XZ      │
└─────────────────────────────────────────────┘
```

## 2. Recommended stack (default)

Until Phase 0 spike says otherwise:

- **three** (+ `@react-three/fiber` + `@react-three/drei`) for scene, avatar, cameras.
- **GeoJSON** building footprints in `public/geo/port-jefferson-buildings.geojson`.
- ExtrudeBufferGeometry (or similar) from rings; Y-up, XZ ground.
- Project lat/lng ↔ local meters with a fixed origin near harbor (e.g. ferry terminal) using equirectangular or a tiny projection helper (no heavy GIS lib required for village scale).

**Alternative:** MapLibre fill-extrusion + HTML/WebGL overlay avatar — only if spike shows faster path; document switch here.

## 3. Coordinate systems

| Space | Use |
|-------|-----|
| WGS84 lat/lng | Site data, GPS |
| Local scene meters | Avatar, meshes, radii |
| Origin | Fixed `{ lat0, lng0 }` in `src/config/geo.ts` |

`radiusM` compared in local meters after projection.

## 4. Module layout (target)

Algorithms: [MODULE_CONTRACTS.md](./MODULE_CONTRACTS.md), implemented in `src/domain/`.

```text
src/
  app routes & shell
  config/        brand, geo origin, features
  copy/          en.ts
  data/          checkpoints.ts
  domain/        geo, checkIn, save, types
  location/      usePlayerLocation (GPS)
  scene/         Canvas, Buildings, Avatar, Checkpoints, Cameras, Controls
  state/         useGameStore
  storage/       load/save
  pages/         Home, Play, Puzzle, Settings, FallbackSites
public/
  geo/           buildings + water
  finale/        ferry-puzzle.jpg
  icons/
```

**Decision (v0.1.0):** Three.js + React Three Fiber. Buildings are extruded at load time from GeoJSON and merged into one mesh plus one edge-line mesh; water and streets are flat merged meshes. Routing uses `HashRouter` so GitHub Pages never 404s on refresh.

**Camera / controls as built:** both cameras orbit at a player-controlled yaw (drag the view or Q/E); the stick is camera-relative. Follow sits 8 m back / 5 m up; Overview sits 40 m back / 95 m up. Building collision is off, so the avatar carries a depth-test-free pin that stays visible through rooftops.

## 5. Input

- Virtual: `nipplejs` or custom fixed joystick + action button.
- Keyboard WASD/arrows for desktop QA.
- Live: no joystick required; optional recenter button.

## 6. Performance budgets (targets)

- Initial JS + geo < ~2 MB gzipped if feasible; white boxes dominate less than photogrammetry.
- Aim 30 FPS on mid-range phones inside bbox.
- `devicePixelRatio` capped at 2.

## 7. Deploy

- `base: '/pj-go/'` for project Pages.
- `vite-plugin-pwa` with precache of geo + finale stills.
- Workflow: build → upload Pages artifact (same pattern as prior campus prototype).
