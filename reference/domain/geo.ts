/** Drop-in reference — copy into src/domain/ when scaffolding. */

export const GEO = {
  origin: { lat: 40.94736, lng: -73.06979 },
  bbox: {
    south: 40.9445,
    west: -73.074,
    north: 40.951,
    east: -73.062,
  },
  paddingM: 20,
} as const

const M_PER_DEG_LAT = 110540

function mPerDegLng(lat0: number) {
  return Math.cos((lat0 * Math.PI) / 180) * 111320
}

/** +X east, +Z south */
export function latLngToLocal(
  lat: number,
  lng: number,
  lat0 = GEO.origin.lat,
  lng0 = GEO.origin.lng,
) {
  const x = (lng - lng0) * mPerDegLng(lat0)
  const z = (lat0 - lat) * M_PER_DEG_LAT
  return { x, z }
}

export function localToLatLng(
  x: number,
  z: number,
  lat0 = GEO.origin.lat,
  lng0 = GEO.origin.lng,
) {
  const lat = lat0 - z / M_PER_DEG_LAT
  const lng = lng0 + x / mPerDegLng(lat0)
  return { lat, lng }
}

export function distM(ax: number, az: number, bx: number, bz: number) {
  return Math.hypot(ax - bx, az - bz)
}

export function effectiveRadiusM(radiusM: number, accuracyM?: number) {
  if (accuracyM == null || accuracyM <= 25) return radiusM
  return radiusM + Math.min(30, accuracyM - 25)
}

export function pointInBBox(
  lat: number,
  lng: number,
  bbox = GEO.bbox,
): boolean {
  return (
    lat >= bbox.south &&
    lat <= bbox.north &&
    lng >= bbox.west &&
    lng <= bbox.east
  )
}

export function clampLocalToPlayable(
  x: number,
  z: number,
  lat0 = GEO.origin.lat,
  lng0 = GEO.origin.lng,
) {
  const sw = latLngToLocal(GEO.bbox.south, GEO.bbox.west, lat0, lng0)
  const ne = latLngToLocal(GEO.bbox.north, GEO.bbox.east, lat0, lng0)
  const pad = GEO.paddingM
  const minX = Math.min(sw.x, ne.x) - pad
  const maxX = Math.max(sw.x, ne.x) + pad
  const minZ = Math.min(sw.z, ne.z) - pad
  const maxZ = Math.max(sw.z, ne.z) + pad
  return {
    x: Math.min(maxX, Math.max(minX, x)),
    z: Math.min(maxZ, Math.max(minZ, z)),
  }
}
