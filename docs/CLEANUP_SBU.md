# Wipe Stony Brook leftovers before scaffolding PJ Go

This working folder may still contain **sb-go** app code (`src/`, `public/maps/`, old docs).  
PJ Go delivery uses the packs and assets below — delete the rest when starting Phase 0.

## Keep

```text
README.md
docs/          (all PJ Go docs)
data/checkpoints.template.json
reference/
scripts/fetch-osm.mjs
public/geo/
public/finale/
public/icons/
public/favicon.svg
public/manifest.webmanifest
public/clear-cache.html
.git/          (then point remote to pj-go — never push to sb-go)
```

## Delete (examples)

```text
src/                 (old SBU React app)
public/maps/
data/melville.template.json
data/wang.template.json
data/campusSites.template.json
docs/BRANCH_*.md
docs/DATA_CAMPUS_SITES.md
docs/GEOLOCATION_SPEC.md
docs/CONTENT_PIPELINE.md
docs/DEVELOPMENT_GUIDE.md
docs/DEPLOYMENT_PWA.md
docs/MAPS_AND_COST.md
docs/BRAND_AND_UI.md
docs/FUTURE_NATIVE.md
docs/RENAMING.md
scripts/download_real_photos.py
scripts/make_story_plates.py
.github/workflows/   (replace with pj-go Pages workflow)
```

After cleanup, follow [SCAFFOLD.md](./SCAFFOLD.md).
