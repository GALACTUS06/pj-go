# PJ Go — Complete UI Copy Deck (English)

Source of truth for **every player-facing string**.  
Implement as `src/copy/en.ts` (or inline constants). Do not invent alternate wording in MVP.

---

## Brand

| Key | String |
|-----|--------|
| `brand.name` | PJ Go |
| `brand.tagline` | Explore Port Jefferson’s harbor — collect 9 pieces, reveal the ferry. |

---

## Home

| Key | String |
|-----|--------|
| `home.startVirtual` | Start Virtual Walk |
| `home.useLive` | Use Live Location |
| `home.puzzle` | Puzzle |
| `home.settings` | Settings |
| `home.footer.osm` | Map data © OpenStreetMap |
| `home.footer.version` | v{version} |

---

## Play HUD

| Key | String |
|-----|--------|
| `play.pieces` | Pieces {n}/9 |
| `play.cameraFollow` | Follow |
| `play.cameraOblique` | Overview |
| `play.exit` | Exit (shown as ✕ in the Play HUD, label kept for screen readers) |
| `play.checkIn` | Check in |
| `play.near` | Near: {siteName} |
| `play.next` | Next: {siteName} · {meters} m |
| `play.gpsAccuracy` | GPS ±{meters} m |
| `play.outsideBox` | Head toward the harbor district |
| `play.gpsDenied` | Location unavailable — staying in Virtual |
| `play.geoLoadFail` | Harbor map failed to load |
| `play.retry` | Retry |
| `play.webglFallbackTitle` | 3D unavailable |
| `play.webglFallbackBody` | Continue with the site list — you can still collect all 9 pieces. |
| `play.openList` | Open site list |
| `play.sitesDrawer` | Sites |
| `play.go` | Go |
| `play.collected` | Collected |
| `toast.piece` | Piece unlocked ({n}/9) |

---

## Tutorial (once)

| Step | Title | Body |
|------|-------|------|
| 1 | Move | Drag the stick to walk the harbor. |
| 2 | Find a glow | Follow **Next** or walk to a glowing marker. |
| 3 | Check in | When close enough, tap **Check in** to collect a piece. |

| Key | String |
|-----|--------|
| `tutorial.next` | Next |
| `tutorial.done` | Got it |
| `tutorial.skip` | Skip |

---

## Check-in sheet

| Key | String |
|-----|--------|
| `sheet.collect` | Collect puzzle piece |
| `sheet.collected` | Collected |
| `sheet.close` | Close |

Site `name`, `blurb`, `facts[]` come from data — not this deck.

---

## Puzzle

| Key | String |
|-----|--------|
| `puzzle.title` | Harbor Puzzle |
| `puzzle.progress` | {n}/9 |
| `puzzle.reveal` | Reveal the ferry |
| `puzzle.backPlay` | Back to Play |
| `puzzle.emptySlot` | {slot} |

---

## Finale

| Key | String |
|-----|--------|
| `finale.title` | Port Jefferson Ferry |
| `finale.subtitle` | Long Island Sound crossing to Bridgeport, Connecticut |
| `finale.closing` | Nine pieces of the harbor — one ferry still ties Long Island to Connecticut. |
| `finale.backPuzzle` | Back to puzzle |
| `finale.keepExploring` | Keep exploring |

(`finale.closing` must match `data/checkpoints.template.json` → `finale.closingLine`.)

---

## Settings

| Key | String |
|-----|--------|
| `settings.title` | Settings |
| `settings.mode` | Play mode |
| `settings.mode.virtual` | Virtual |
| `settings.mode.live` | Live |
| `settings.camera` | Camera |
| `settings.camera.follow` | Follow |
| `settings.camera.oblique` | Overview |
| `settings.reset` | Reset all progress |
| `settings.resetConfirm` | Clear all check-ins and puzzle pieces? This cannot be undone. |
| `settings.resetYes` | Reset |
| `settings.resetNo` | Cancel |
| `settings.credits` | Credits |
| `settings.privacyTitle` | Privacy |
| `settings.privacyBody` | Live mode uses your device location only on this device to place your avatar. Location is not uploaded to our servers. PJ Go has no accounts. |
| `settings.clearCache` | Clear cached app data |
| `settings.clearCacheHint` | Use if the app looks stuck on an old version after an update. |
| `settings.version` | Build {version} |
| `settings.devTeleport` | Teleport to site (dev) |

---

## 2D fallback list

| Key | String |
|-----|--------|
| `fallback.title` | Harbor sites |
| `fallback.hint` | Tap a site when you are in range (Virtual teleport via Go, or Live GPS). |
| `fallback.checkIn` | Check in |

---

## Accessibility / system

| Key | String |
|-----|--------|
| `a11y.joystick` | Movement joystick |
| `a11y.checkIn` | Check in at nearby site |
| `a11y.cameraToggle` | Toggle camera mode |
