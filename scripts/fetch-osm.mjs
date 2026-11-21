/**
 * Fetch Port Jefferson harbor buildings + streets from Overpass → GeoJSON.
 * Water comes from the coastline: `python scripts/build-water.py`.
 * Usage: node scripts/fetch-osm.mjs [buildings|roads]
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'geo')

const BBOX = '40.9445,-73.0740,40.9510,-73.0620' // S,W,N,E
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const LAYERS = {
  buildings: {
    query: `[out:json][timeout:90];
(way["building"](${BBOX}););
out body; >; out skel qt;`,
    closed: true,
    keep: ['building', 'name', 'height', 'building:levels'],
  },
  roads: {
    query: `[out:json][timeout:90];
(way["highway"~"^(primary|secondary|tertiary|residential|unclassified|service|pedestrian|footway|path|steps|living_street)$"](${BBOX}););
out body; >; out skel qt;`,
    closed: false,
    keep: ['highway', 'name'],
  },
}

function toGeoJSON(osm, { closed, keep }) {
  const nodes = new Map()
  for (const el of osm.elements ?? []) {
    if (el.type === 'node') nodes.set(el.id, [+el.lon.toFixed(6), +el.lat.toFixed(6)])
  }
  const features = []
  for (const el of osm.elements ?? []) {
    if (el.type !== 'way' || !el.nodes?.length) continue
    const pts = el.nodes.map((id) => nodes.get(id)).filter(Boolean)
    if (pts.length < (closed ? 3 : 2)) continue
    if (closed) {
      const [a, b] = [pts[0], pts[pts.length - 1]]
      if (a[0] !== b[0] || a[1] !== b[1]) pts.push(a)
    }
    features.push({
      type: 'Feature',
      properties: {
        id: el.id,
        ...Object.fromEntries(Object.entries(el.tags ?? {}).filter(([k]) => keep.includes(k))),
      },
      geometry: closed
        ? { type: 'Polygon', coordinates: [pts] }
        : { type: 'LineString', coordinates: pts },
    })
  }
  return {
    type: 'FeatureCollection',
    properties: { source: 'OpenStreetMap via Overpass (ODbL)', bbox: BBOX },
    features,
  }
}

async function fetchOsm(query) {
  let last
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of ENDPOINTS) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'PJ-Go/0.1 (harbor white-box extract)',
            Accept: 'application/json',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: AbortSignal.timeout(120_000),
        })
        if (res.ok) return await res.json()
        last = new Error(`${url} ${res.status}`)
      } catch (e) {
        last = e
      }
      console.warn(String(last))
    }
    await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)))
  }
  throw last
}

await mkdir(outDir, { recursive: true })
const only = process.argv[2]
for (const [name, layer] of Object.entries(LAYERS)) {
  if (only && only !== name) continue
  process.stdout.write(`Fetching ${name}… `)
  const gj = toGeoJSON(await fetchOsm(layer.query), layer)
  const path = join(outDir, `port-jefferson-${name}.geojson`)
  await writeFile(path, JSON.stringify(gj))
  console.log(`${gj.features.length} features → ${path}`)
}
console.log('Done. © OpenStreetMap contributors (ODbL).')
