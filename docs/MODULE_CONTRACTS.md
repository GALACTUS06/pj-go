# PJ Go — Module Contracts (Implement Exactly)

Algorithms and APIs an engineer must implement so Virtual/Live share one truth.  
Implemented in `src/domain/` and covered by `src/domain/domain.test.ts`.

---

## 1. Geo config

```ts
export const GEO = {
  origin: { lat: 40.94736, lng: -73.06979 },
  bbox: {
    south: 40.9445,
    west: -73.0740,
    north: 40.9510,
    east: -73.0620,
  },
  paddingM: 20,
} as const
```

---

## 2. Projection (equirectangular, village scale)

```ts
const M_PER_DEG_LAT = 110540
const M_PER_DEG_LNG = (lat0: number) =>
  Math.cos((lat0 * Math.PI) / 180) * 111320

/** Local XZ: +X east, +Z south (so Three camera often looks toward -Z = north). */
export function latLngToLocal(lat: number, lng: number, lat0: number, lng0: number) {
  const x = (lng - lng0) * M_PER_DEG_LNG(lat0)
  const z = (lat0 - lat) * M_PER_DEG_LAT
  return { x, z }
}

export function localToLatLng(x: number, z: number, lat0: number, lng0: number) {
  const lat = lat0 - z / M_PER_DEG_LAT
  const lng = lng0 + x / M_PER_DEG_LNG(lat0)
  return { lat, lng }
}
```

**Acceptance:** ferry terminal projects to `(0, 0)` within 0.01 m.

---

## 3. Distance & check-in

```ts
export function distM(ax: number, az: number, bx: number, bz: number) {
  const dx = ax - bx
  const dz = az - bz
  return Math.hypot(dx, dz)
}

/** Live noise: widen effective radius slightly when accuracy is poor. */
export function effectiveRadiusM(radiusM: number, accuracyM?: number) {
  if (accuracyM == null || accuracyM <= 25) return radiusM
  return radiusM + Math.min(30, accuracyM - 25)
}

export function canCheckIn(opts: {
  avatarX: number
  avatarZ: number
  siteX: number
  siteZ: number
  radiusM: number
  accuracyM?: number
  alreadyCollected: boolean
  liveOutsideBox: boolean
}) {
  if (opts.liveOutsideBox) return false
  // Allow reopening sheet when collected; Collect button stays hidden.
  const d = distM(opts.avatarX, opts.avatarZ, opts.siteX, opts.siteZ)
  return d < effectiveRadiusM(opts.radiusM, opts.accuracyM)
}
```

**Grant piece:** append `siteId` to `checkedInSiteIds` and `puzzlePieceIds` if absent. Idempotent.

---

## 4. Movement (Virtual)

| Param | Value |
|-------|-------|
| Speed | `4.5` m/s |
| Joystick deadzone | `0.12` of stick radius |
| Keyboard | WASD / arrows = full stick |
| dt clamp | max `0.05` s per frame |
| Avatar capsule | radius `0.35` m, eye `1.6` m |

Each frame:

1. `vx, vz` from stick × speed  
2. Propose `x' = x + vx*dt`, `z' = z + vz*dt`  
3. If water collision on → reject or slide along edge (try X-only then Z-only)  
4. Clamp to bbox ± `paddingM` (soft push-back)  
5. Buildings: **no collision** in MVP  

Yaw: face movement direction when speed &gt; 0.2 m/s.

---

## 5. Movement (Live)

```ts
watchPosition({ enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 })
```

- Project lat/lng → xz  
- Exponential lerp toward target with τ ≈ `0.3` s:  
  `pos += (target - pos) * (1 - Math.exp(-dt / tau))`  
- If outside bbox: set `liveOutsideBox`, clamp avatar to nearest edge, show banner  
- On deny/error: force Virtual controls; toast `play.gpsDenied`; do not wipe save  

---

## 6. Cameras

| Mode | Offset (local m) | Look |
|------|------------------|------|
| Follow | `(0, 4.5, 7.5)` behind avatar in yaw space | lookAt avatar eye |
| Oblique | `(0, 28, 18)` | lookAt avatar; pitch ~50° |

Lerp camera position with τ ≈ `0.2` s; if `prefers-reduced-motion` or save `reducedMotion`, snap / τ ≈ `0.05`.

---

## 7. Wayfinding

- **World labels:** uncollected sites; opacity fade `1 → 0` from 40 m → 180 m  
- **Next chip:** nearest uncollected by `distM`; show name + rounded meters  
- **Compass:** unit vector from avatar → next site, drawn as HUD arrow (screen space)  
- **Go (list):** sets `navBeaconSiteId` (highlight that marker until reached/cleared)  

---

## 8. Save V1 (final)

```ts
type SaveV1 = {
  version: 1
  modePreference: 'virtual' | 'live'
  cameraPreference: 'follow' | 'oblique'
  checkedInSiteIds: string[]
  puzzlePieceIds: string[]
  finaleRevealed: boolean
  tutorialDone: boolean
  reducedMotion?: boolean
  navBeaconSiteId?: string | null
}
```

Key: `pj-go-save-v1`  
Corrupt / missing → default empty save.  
Unknown future `version` → migrate or reset with toast once.

Default:

```ts
{
  version: 1,
  modePreference: 'virtual',
  cameraPreference: 'follow',
  checkedInSiteIds: [],
  puzzlePieceIds: [],
  finaleRevealed: false,
  tutorialDone: false,
}
```

---

## 9. Puzzle / finale state machine

```text
pieces < 9  → board shows filled slots; Reveal disabled
pieces == 9 → Reveal enabled
Reveal tap  → finaleRevealed = true → Finale screen
```

Finale may open automatically once on first 9/9 if `!finaleRevealed` (optional); still require board CTA for revisit.

Slot → site: `checkpoint.puzzleSlot` (0–8, row-major: 0 top-left … 8 bottom-right).

---

## 10. WebGL fallback

```ts
function canWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}
```

If false **or** R3F context creation throws → mount `FallbackSitesPage` (list + optional Leaflet OSM). Same check-in + puzzle APIs. Virtual “Go” teleports avatar/selection to site for radius check in list mode (treat as at site center).

---

## 11. Asset URL helper

```ts
export function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL // e.g. '/pj-go/'
  return `${base}${path.replace(/^\//, '')}`
}
```

Always use for `geo/`, `finale/`, `icons/`.

---

## 12. Store actions (Zustand)

| Action | Effect |
|--------|--------|
| `setMode(m)` | persist preference |
| `setCamera(c)` | persist |
| `checkIn(siteId)` | idempotent grant piece; maybe set finale flag eligibility |
| `revealFinale()` | `finaleRevealed = true` |
| `completeTutorial()` | `tutorialDone = true` |
| `setBeacon(id\|null)` | nav beacon |
| `reset()` | default save |
| `teleportTo(siteId)` | Virtual only / dev; set xz to site |

---

## 13. Unit tests (Vitest, required)

1. `latLngToLocal(origin) ≈ (0,0)`  
2. Round-trip latlng ↔ local within 0.5 m inside bbox  
3. `canCheckIn` true inside radius, false outside  
4. Second `checkIn` does not duplicate ids  
5. Save load migrate missing `tutorialDone` → `false`  
