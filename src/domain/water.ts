import { latLngToLocal } from './geo'

export type Ring = { x: number; z: number }[]

type PolygonFeature = {
  geometry: { type: string; coordinates: number[][][] | number[][][][] }
}

/** Outer rings of every (Multi)Polygon, projected to local meters. */
export function ringsFromGeoJSON(fc: { features: PolygonFeature[] }): Ring[] {
  const rings: Ring[] = []
  const toRing = (coords: number[][]) => coords.map(([lng, lat]) => latLngToLocal(lat, lng))
  for (const f of fc.features) {
    const g = f.geometry
    if (!g) continue
    if (g.type === 'Polygon') {
      rings.push(toRing((g.coordinates as number[][][])[0]))
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates as number[][][][]) rings.push(toRing(poly[0]))
    }
  }
  return rings
}

export function pointInRing(x: number, z: number, ring: Ring): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]
    const b = ring[j]
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) {
      inside = !inside
    }
  }
  return inside
}

export function inWater(x: number, z: number, rings: Ring[]) {
  return rings.some((r) => pointInRing(x, z, r))
}
