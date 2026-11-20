/**
 * Fetch Port Jefferson harbor buildings + water from Overpass → GeoJSON.
 * Usage: node scripts/fetch-osm.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'geo')

const BBOX = '40.9445,-73.0740,40.9510,-73.0620' // S,W,N,E
const OVERPASS = 'https://overpass-api.de/api/interpreter'

const queries = {
  buildings: `
[out:json][timeout:90];
(
  way["building"](${BBOX});
  relation["building"](${BBOX});
);
out body;
>;
out skel qt;
`,
  water: `
[out:json][timeout:90];
(
  way["natural"="water"](${BBOX});
  relation["natural"="water"](${BBOX});
  way["waterway"="riverbank"](${BBOX});
  relation["waterway"="riverbank"](${BBOX});
  way["natural"="bay"](${BBOX});
  relation["natural"="bay"](${BBOX});
  way["water"](${BBOX});
  relation["water"](${BBOX});
  way["harbour"](${BBOX});
  way["seamark:type"="harbour"](${BBOX});
);
out body;
>;
out skel qt;
`,
}

function osmToGeoJSON(osm) {
  const nodes = new Map()
  for (const el of osm.elements || []) {
    if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat])
  }

  const features = []
  for (const el of osm.elements || []) {
    if (el.type !== 'way' || !el.nodes?.length) continue
    const ring = el.nodes.map((id) => nodes.get(id)).filter(Boolean)
    if (ring.length < 3) continue
    if (
      ring[0][0] !== ring[ring.length - 1][0] ||
      ring[0][1] !== ring[ring.length - 1][1]
    ) {
      ring.push(ring[0])
    }
    features.push({
      type: 'Feature',
      properties: {
        id: el.id,
        ...Object.fromEntries(
          Object.entries(el.tags || {}).filter(([k]) =>
            ['building', 'name', 'height', 'building:levels', 'natural', 'waterway', 'water'].includes(k),
          ),
        ),
      },
      geometry: { type: 'Polygon', coordinates: [ring] },
    })
  }

  return {
    type: 'FeatureCollection',
    features,
    properties: {
      source: 'OpenStreetMap via Overpass',
      bbox: BBOX,
      generatedAt: new Date().toISOString(),
    },
  }
}

async function fetchOsm(query) {
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'PJ-Go/0.1 (local build; harbor white-box extract)',
      Accept: 'application/json',
    },
    body: `data=${encodeURIComponent(query)}`,
  })
  if (!res.ok) throw new Error(`Overpass ${res.status}: ${await res.text()}`)
  return res.json()
}

await mkdir(outDir, { recursive: true })

for (const [name, query] of Object.entries(queries)) {
  process.stdout.write(`Fetching ${name}… `)
  const osm = await fetchOsm(query)
  const gj = osmToGeoJSON(osm)
  const path = join(outDir, `port-jefferson-${name}.geojson`)
  await writeFile(path, JSON.stringify(gj))
  console.log(`${gj.features.length} features → ${path}`)
}

console.log('Done. © OpenStreetMap contributors (ODbL).')
