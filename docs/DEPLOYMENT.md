# PJ Go — Deployment & Repo Runbook

---

## 1. Create the GitHub repository

```bash
# from project root (after local docs exist)
gh repo create pj-go --public --source=. --remote=origin --push
```

Do **not** push to `GALACTUS06/sb-go`. That repo remains the Stony Brook archive (`sbu-archive-v0.1.5`).

Suggested Pages site: `https://galactus06.github.io/pj-go/`

---

## 2. Local develop

```bash
npm install
npm run dev
```

Phone on same LAN: use Vite `--host` and device IP, or deploy a preview branch.

---

## 3. Production build

```bash
npm run build
npm run preview
```

Ensure `vite.config.ts` has:

```ts
base: '/pj-go/'
```

Asset helper must prefix `import.meta.env.BASE_URL` for geo and finale images.

---

## 4. GitHub Actions (Pages)

Mirror the proven pattern:

1. `on: push` to `main`
2. `npm ci` && `npm run build`
3. `actions/upload-pages-artifact` path `dist`
4. `actions/deploy-pages`

Permissions: `pages: write`, `id-token: write`.

---

## 5. PWA notes

- `registerType: 'autoUpdate'`
- Precache `geo/*.geojson`, finale image, icons
- Provide a **Clear cache** link or Settings action if players report stale builds (lesson from prior campus PWA)

---

## 6. Environment

No `.env` Google keys.  
If any future tile token is required, use GitHub Actions secrets — never commit secrets.

---

## 7. Release checklist

1. QA checklist green  
2. Tag `v0.1.0`  
3. Confirm Pages URL  
4. Smoke: Virtual 2 check-ins + puzzle page on a phone  

---

## 8. Rollback

- Re-deploy previous known-good commit to `main`  
- Or Pages → previous deployment (if retained)  
- Players: clear site data / unregister service worker  
