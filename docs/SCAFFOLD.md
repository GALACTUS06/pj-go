# PJ Go — App Scaffold Spec (copy verbatim at Phase 0)

When wiping SBU leftovers and starting the real app, create this tree and dependency set.  
Domain algorithms already exist in [`../reference/`](../reference/) — copy them into `src/`.

---

## 1. package.json (locked versions band)

```json
{
  "name": "pj-go",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "fetch-osm": "node scripts/fetch-osm.mjs"
  },
  "dependencies": {
    "@react-three/drei": "^9.117.0",
    "@react-three/fiber": "^8.17.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "three": "^0.170.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "^5.6.3",
    "vite": "^5.4.10",
    "vite-plugin-pwa": "^0.20.5",
    "vitest": "^2.1.4"
  }
}
```

Optional Live 2D fallback map: `leaflet` + `@types/leaflet` (only if WebGL fallback needs a map pane).

---

## 2. Target file tree

```text
pj-go/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  public/
    favicon.svg
    icons/icon.svg          # also export 192/512 PNG at ship
    geo/port-jefferson-buildings.geojson
    geo/port-jefferson-water.geojson
    finale/ferry-puzzle.jpg
    clear-cache.html
  scripts/fetch-osm.mjs
  data/checkpoints.template.json
  src/
    main.tsx
    App.tsx
    vite-env.d.ts
    pwa.ts
    copy/en.ts
    config/geo.ts           # from reference/domain/geo GEO export
    config/brand.ts
    data/checkpoints.ts     # import JSON
    domain/geo.ts
    domain/checkIn.ts
    domain/save.ts
    domain/types.ts
    state/useGameStore.ts
    storage/save.ts
    location/usePlayerLocation.ts
    scene/
      PlayCanvas.tsx
      Buildings.tsx
      Water.tsx
      Avatar.tsx
      Checkpoints.tsx
      Cameras.tsx
      Joystick.tsx
    pages/
      HomePage.tsx
      PlayPage.tsx
      PuzzlePage.tsx
      SettingsPage.tsx
      FallbackSitesPage.tsx
    components/
      CheckInSheet.tsx
      TutorialCoach.tsx
      NextChip.tsx
      FinaleReveal.tsx
      Toast.tsx
    styles/tokens.css
    styles/global.css
  docs/…                    # this solution pack
```

---

## 3. vite.config.ts essentials

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/pj-go/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon.svg', 'finale/ferry-puzzle.jpg'],
      manifest: {
        name: 'PJ Go',
        short_name: 'PJ Go',
        description: 'Explore Port Jefferson harbor — collect 9 pieces, reveal the ferry.',
        theme_color: '#0B1F33',
        background_color: '#F4F7FA',
        display: 'standalone',
        start_url: '/pj-go/',
        scope: '/pj-go/',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg,png,geojson}'],
      },
    }),
  ],
})
```

---

## 4. index.html meta

```html
<title>PJ Go — Port Jefferson Harbor</title>
<meta name="description" content="Walk Port Jefferson’s harbor, collect 9 puzzle pieces, reveal the ferry to Bridgeport." />
<meta property="og:title" content="PJ Go" />
<meta property="og:description" content="Explore Port Jefferson’s harbor — collect 9 pieces, reveal the ferry." />
<meta property="og:image" content="/pj-go/finale/ferry-puzzle.jpg" />
<meta name="theme-color" content="#0B1F33" />
```

---

## 5. Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/play` | Play (3D or fallback) |
| `/puzzle` | Puzzle board |
| `/settings` | Settings |

---

## 6. Clean-slate rule

This workspace may still contain **Stony Brook (sb-go) leftovers** under `src/` / `public/maps/`.  
For the real `pj-go` app: **delete SBU app code**, keep `docs/`, `data/checkpoints.template.json`, `reference/`, `scripts/fetch-osm.mjs`, `public/geo/`, `public/finale/`, `public/icons/`, `public/favicon.svg`.

Do **not** push to `GALACTUS06/sb-go`.
