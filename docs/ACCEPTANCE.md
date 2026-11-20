# PJ Go — Acceptance Criteria (Delivery Gate)

This is the **contract** for “MVP delivered.”  
If every item below is true on the public Pages URL, the product ships.

---

## 1. Product definition of done

A first-time player on a **phone browser** (portrait), using **Virtual mode only**, can:

1. Open the public URL without 404s on JS/CSS/geo/finale.
2. Tap **Start Virtual Walk** and see the harbor white-box scene (or 2D fallback).
3. Find and check in at **all 9** sites without external help (labels + Next + compass).
4. Collect **9 unique** puzzle pieces (idempotent; no duplicates).
5. Open Puzzle → **Reveal the ferry** → see finale image + closing line.
6. Reload mid-run and keep progress; Reset in Settings clears it.

Live GPS is optional and must not block any of the above.

---

## 2. Must-pass acceptance matrix

| ID | Criterion | How to verify |
|----|-----------|---------------|
| A1 | Virtual full clear 9/9 + finale | Manual QA on phone |
| A2 | Progress survives reload | Collect 2 → refresh → still 2 |
| A3 | Reset clears progress | Settings → confirm → 0/9 |
| A4 | Live deny still completable | Deny GPS → Virtual controls work |
| A5 | Live grant moves avatar | Field or mock GPS; avatar tracks |
| A6 | Camera toggle mid-play | Follow ↔ Oblique, preference persists |
| A7 | English UI only | Spot-check all screens |
| A8 | No Google Maps keys / calls | Network tab + repo grep |
| A9 | OSM + finale credits visible | Home footer + Settings |
| A10 | Wayfinding usable | Blind Virtual: find 3 distant sites via Next |
| A11 | Tutorial once | Fresh save → 3 coach steps → never again |
| A12 | WebGL fail path | Force fail / stub → 2D list still clears |
| A13 | Water blocks Virtual | Try walk into harbor water → blocked/slide |
| A14 | Outside Live box | Banner shown; check-in disabled until near sites |
| A15 | Pages `base` correct | Hard refresh on `/pj-go/` assets load |
| A16 | PWA shell | Installable; icons resolve; clear-cache documented |

---

## 3. Performance gates (soft but ship-blocking if unusable)

| ID | Gate |
|----|------|
| P1 | Mid-range phone: navigable scene ≥ ~25–30 FPS inside bbox |
| P2 | Cold start usable &lt; 5 s on LTE after first warm cache |
| P3 | `devicePixelRatio` capped at 2 |

---

## 4. Content gates

| ID | Gate |
|----|------|
| C1 | All 9 sites: name + blurb + ≥1 fact from data file |
| C2 | Finale image present at `public/finale/ferry-puzzle.jpg` |
| C3 | `CREDITS.md` lists OSM + finale author/license/URL/date |
| C4 | Restaurant site uses zone name **Waterfront Dining** (no trademark logo) |

---

## 5. Explicit non-blocking (may ship without)

- Site sheet photos  
- Minimap  
- Satellite underlay  
- Live field test of all 9 (need ≥3 if tester is on-site; else document GPS mock)  
- Automated E2E  

---

## 6. Sign-off

| Role | Sign when |
|------|-----------|
| Implementer | A1–A16 + C1–C4 green on Pages URL |
| Reviewer (optional) | Blind Virtual clear under 20 minutes |

Tag: `v0.1.0` after sign-off.
