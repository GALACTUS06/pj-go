# PJ Go — Developer Gap Analysis

Review date: 2026-11-20  
Reviewer role: implementing engineer reading the solution pack before coding.

## Verdict

The **product + delivery specification is strong enough to start Phase 0**.  
It is **not** “fully build-ready” until the gaps below are closed (some are decisions, some are missing artifacts).

---

## A. Not missing from docs — missing as *deliverables* (expected)

These are in the plan but **not yet produced**:

| Gap | Status |
|-----|--------|
| GitHub repo `pj-go` | Not created |
| Application source code | Not started |
| `public/geo/*.geojson` | Not extracted |
| `public/finale/ferry-puzzle.jpg` | Not downloaded (candidates only) |
| App icons / favicon | Not designed |
| Live field QA on-site | Not done |

→ Spec OK; execution pending.

---

## B. Spec gaps that would slow an engineer (should decide now)

### B1. Virtual wayfinding (HIGH)

**Problem:** No minimap (deferred) + white-box harbor + 9 sparse points → Virtual players **get lost**.

**Decision (locked):**

- Always show **world-space floating labels** on uncollected checkpoints (name, fade with distance).
- HUD **“Next”** chip: nearest uncollected site + distance in meters + optional **compass arrow**.
- Optional list drawer: 9 sites with Collected / Go (sets a nav beacon).

Minimap stays Phase 4+.

### B2. Collection order (MEDIUM)

**Problem:** Free roam vs forced sequence not stated.

**Decision (locked):** **Free order.** Any uncollected site in range can check in. “Next” is advisory only.

### B3. Movement & collision numbers (MEDIUM)

**Problem:** Speeds / bounds only qualitative.

**Decision (locked defaults):**

| Param | Value |
|-------|-------|
| Virtual move speed | 4.5 m/s |
| Sprint (optional) | none in MVP |
| GPS lerp time constant | ~0.25–0.4 s |
| Playable clamp | bbox + 20 m padding; soft push-back |
| Building collision | **Off** for MVP (visual only) |
| Water collision | **On** (block / slide) |
| Avatar height | eye ~1.6 m; capsule r=0.35 m |

### B4. Spawn & Live outside box (MEDIUM)

**Decision (locked):**

- Virtual spawn: ferry terminal origin `(0,0)`.
- Live outside bbox: show banner; avatar clamped to nearest edge; check-in disabled until inside / near a site.
- HTTPS / secure context required for GPS (document in deploy: Pages is fine; `file://` is not).

### B5. First-run tutorial (MEDIUM)

**Problem:** Help mentioned; no steps.

**Decision (locked):** One-time coach marks (3 steps): move stick → walk to glow → Check in. Skip forever after dismiss. Persist `tutorialDone` in save.

### B6. WebGL / low-end failure (MEDIUM)

**Decision (locked):** If WebGL context fails → fallback screen: **2D checkpoint list map** (static schematic or Leaflet OSM) with same check-in + puzzle. Virtual still completable without 3D.

### B7. Brand / UI tokens (LOW–MEDIUM)

**Problem:** No color/type system for PJ Go (only SBU leftovers in history).

**Decision (locked defaults):**

- Primary: harbor navy `#0B1F33`
- Accent: ferry red `#C8102E` (generic, not a company trademark lockup)
- Surface: `#F4F7FA`
- Font: system UI stack for MVP (`system-ui, Segoe UI, sans-serif`) — swap later

### B8. Privacy copy (LOW–MEDIUM)

**Decision (locked):** Settings blurb:

> Live mode uses your device location only on this device to place your avatar. Location is not uploaded to our servers. PJ Go has no accounts.

### B9. `puzzleSlot` in data (LOW)

Template JSON omitted `puzzleSlot` while types require it → **add slots 0–8** in template.

### B10. Debug teleport (LOW)

**Decision:** Settings → Developer (behind long-press version) → teleport to site. Speeds Virtual QA. Strip or hide for “production feel” but keep in build.

### B11. Automated tests (LOW)

**Decision:** MVP: Vitest for projection + check-in distance + save migrate. No E2E required to ship v0.1.

### B12. SEO / share cards (LOW)

**Decision:** Basic `index.html` title/description/og:image (ferry still) when asset exists.

---

## C. Asset gaps (process OK, files missing)

| Item | Doc coverage | File on disk |
|------|--------------|--------------|
| OSM geo | GEO + ASSET | ❌ |
| Ferry finale | ASSET candidates | ❌ |
| Icons | ASSET | ❌ |
| Site photos | Optional | ❌ skip OK |

---

## D. Engineering risks still under-specified (acceptable if spike owns them)

1. Multipolygon / hole buildings in OSM extrusion edge cases.  
2. GPS altitude ignored (2D only) — fine.  
3. PWA stale cache — document clear-cache (from prior project lesson).  
4. Esri tile ToS if underlay enabled — re-read at implement time.  
5. CC BY-SA finale forces share-alike on *adapted* puzzle crops — prefer BY/CC0 if possible; if BY-SA, credit + share-alike note in CREDITS.

---

## E. What is *not* a gap

- Core loop, modes, cameras, 9 sites, ferry finale intent  
- Phase plan / tasks / deploy / QA skeleton  
- English content drafts  
- Explicit non-goals (indoor/camera/LLM)

---

## F. Action list before/at coding start

1. Apply B1–B12 locks into COMPLETE_SOLUTION (done via this doc + patches).  
2. Add `puzzleSlot` to `checkpoints.template.json`.  
3. Create `pj-go` remote + scaffold.  
4. Run OSM extract → commit GeoJSON.  
5. Download one CC ferry still → CREDITS.  
6. Make simple icons.  

After (3)–(6), the project is **implementation-complete-ready**, not just spec-complete.
