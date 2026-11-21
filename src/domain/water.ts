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

/**
 * Try to move from (x,z) by (dx,dz); slide along the shore by trying each
 * axis alone when the full step would enter water. A walker already in the
 * water (e.g. left there by a GPS fix) moves freely so it can get out.
 */
export function moveWithWater(
  x: number,
  z: number,
  dx: number,
  dz: number,
  rings: Ring[],
): { x: number; z: number } {
  if (!rings.length || inWater(x, z, rings)) return { x: x + dx, z: z + dz }
  if (!inWater(x + dx, z + dz, rings)) return { x: x + dx, z: z + dz }
  if (dx !== 0 && !inWater(x + dx, z, rings)) return { x: x + dx, z }
  if (dz !== 0 && !inWater(x, z + dz, rings)) return { x, z: z + dz }
  return { x, z }
}
