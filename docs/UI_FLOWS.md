# PJ Go — UI Flows & Screen Spec

Mobile-first. English. Safe-area padding for notches.

---

## 1. Screen map

```text
Home
 ├─ PlayScene          (primary)
 ├─ PuzzleBoard
 ├─ Settings
 └─ (modal) CheckInSheet   from Play
 └─ (modal) FinaleReveal   from Puzzle when 9/9
```

---

## 2. Home

**Elements**

- Title: `PJ Go`
- Subtitle: `Explore Port Jefferson’s harbor — collect 9 pieces, reveal the ferry.`
- Primary CTA: `Start Virtual Walk`
- Secondary: `Use Live Location` (toggles preference; does not start until Virtual/Live start)
- Links: `Puzzle` · `Settings`
- Footer: version + `Map data © OpenStreetMap`

**Behavior**

- Start always enters Play in last mode preference (default Virtual).
- If Live selected and permission missing, prompt on Play enter.

---

## 3. PlayScene (HUD)

**Chrome**

- Top-left: `Pieces n/9` (opens Puzzle)
- Top-right: `Camera` toggle (Follow / Overview)
- Top-right secondary: `Exit`
- Bottom: virtual joystick (hidden in Live if desired) + `Check in` button
- Chip when near site: `Near: {siteName}`
- Live accuracy chip when GPS noisy

**Check in button**

- Disabled grey when out of range
- Enabled when `distance < radiusM` and site not yet collected (or allow re-open sheet if collected)

---

## 4. Check-in sheet

- Drag handle / Close
- Site name (H1)
- Blurb paragraph
- Facts as bullets
- Primary: `Collect puzzle piece` (hidden if already collected → show `Collected`)
- Secondary: `Close`

On collect: toast `Piece unlocked ({n}/9)` → close or keep open one beat.

---

## 5. Puzzle board

- Title: `Harbor Puzzle`
- 3×3 grid; empty cells show slot number; filled show solid tile / mini icon
- Progress text `n/9`
- When 9/9: primary `Reveal the ferry`
- Link back to Play

---

## 6. Finale reveal

- Full-bleed ferry image
- Closing line from data
- Buttons: `Back to puzzle` · `Keep exploring`

---

## 7. Settings

- Mode preference: Virtual / Live  
- Camera preference  
- `Reset all progress` (confirm)  
- Credits / licenses text  
- Build version  

---

## 8. Empty / error states

| State | UI |
|-------|-----|
| GPS denied | Toast + force Virtual controls visible |
| GeoJSON missing | Full-screen error `Harbor map failed to load` + retry |
| Outside playable box (Live) | Banner `Head toward the harbor district` |
