import { pointInRing, ringsFromGeoJSON, type Ring } from './water'

export type Obstacle = { ring: Ring; minX: number; maxX: number; minZ: number; maxZ: number }

/** Body radius probed ahead of the walker so it stops at a wall, not inside it. */
const PROBE_M = 0.4
/** Matches the smallest footprint the scene extrudes. */
export const MIN_BUILDING_AREA_M2 = 15

export function toObstacles(rings: Ring[]): Obstacle[] {
  return rings
    .filter((r) => r.length >= 3)
    .map((ring) => {
      let minX = Infinity
      let maxX = -Infinity
      let minZ = Infinity
      let maxZ = -Infinity
      for (const p of ring) {
        minX = Math.min(minX, p.x)
        maxX = Math.max(maxX, p.x)
        minZ = Math.min(minZ, p.z)
        maxZ = Math.max(maxZ, p.z)
      }
      return { ring, minX, maxX, minZ, maxZ }
    })
}

export function ringArea(ring: Ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j].x + ring[i].x) * (ring[j].z - ring[i].z)
  }
  return Math.abs(a / 2)
}

export function buildingObstacles(fc: Parameters<typeof ringsFromGeoJSON>[0]) {
  return toObstacles(ringsFromGeoJSON(fc).filter((r) => ringArea(r) >= MIN_BUILDING_AREA_M2))
}

export function blockedAt(x: number, z: number, obstacles: Obstacle[]) {
  for (const o of obstacles) {
    if (x < o.minX || x > o.maxX || z < o.minZ || z > o.maxZ) continue
    if (pointInRing(x, z, o.ring)) return true
  }
  return false
}

function segmentsCross(
  ax: number, az: number, bx: number, bz: number,
  cx: number, cz: number, dx: number, dz: number,
) {
  const d1 = (dx - cx) * (az - cz) - (dz - cz) * (ax - cx)
  const d2 = (dx - cx) * (bz - cz) - (dz - cz) * (bx - cx)
  const d3 = (bx - ax) * (cz - az) - (bz - az) * (cx - ax)
  const d4 = (bx - ax) * (dz - az) - (bz - az) * (dx - ax)
  return d1 * d2 < 0 && d3 * d4 < 0
}

/** True when the straight segment a→b passes through any obstacle. */
export function segmentBlocked(ax: number, az: number, bx: number, bz: number, obstacles: Obstacle[]) {
  const minX = Math.min(ax, bx)
  const maxX = Math.max(ax, bx)
  const minZ = Math.min(az, bz)
  const maxZ = Math.max(az, bz)
  for (const o of obstacles) {
    if (maxX < o.minX || minX > o.maxX || maxZ < o.minZ || minZ > o.maxZ) continue
    const r = o.ring
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if (segmentsCross(ax, az, bx, bz, r[j].x, r[j].z, r[i].x, r[i].z)) return true
    }
    if (pointInRing(ax, az, r) || pointInRing(bx, bz, r)) return true
  }
  return false
}

/**
 * Try to move from (x,z) by (dx,dz); slide along walls and shores by trying
 * each axis alone when the full step is blocked. A walker already inside an
 * obstacle (e.g. left there by a GPS fix) moves freely so it can get out.
 */
export function moveWithObstacles(
  x: number,
  z: number,
  dx: number,
  dz: number,
  obstacles: Obstacle[],
): { x: number; z: number } {
  if (!obstacles.length || blockedAt(x, z, obstacles)) return { x: x + dx, z: z + dz }
  const free = (sx: number, sz: number) => {
    const len = Math.hypot(sx, sz)
    if (len === 0) return true
    const nx = x + sx
    const nz = z + sz
    return (
      !blockedAt(nx, nz, obstacles) &&
      !blockedAt(nx + (sx / len) * PROBE_M, nz + (sz / len) * PROBE_M, obstacles)
    )
  }
  if (free(dx, dz)) return { x: x + dx, z: z + dz }
  if (dx !== 0 && free(dx, 0)) return { x: x + dx, z }
  if (dz !== 0 && free(0, dz)) return { x, z: z + dz }
  return { x, z }
}
