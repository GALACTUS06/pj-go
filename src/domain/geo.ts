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

/** Local scene meters: +X east, +Z south. */
export function latLngToLocal(
  lat: number,
  lng: number,
  lat0: number = GEO.origin.lat,
  lng0: number = GEO.origin.lng,
) {
  return {
    x: (lng - lng0) * mPerDegLng(lat0),
    z: (lat0 - lat) * M_PER_DEG_LAT,
  }
}

export function localToLatLng(
  x: number,
  z: number,
  lat0: number = GEO.origin.lat,
  lng0: number = GEO.origin.lng,
) {
  return {
    lat: lat0 - z / M_PER_DEG_LAT,
    lng: lng0 + x / mPerDegLng(lat0),
  }
}

export function distM(ax: number, az: number, bx: number, bz: number) {
  return Math.hypot(ax - bx, az - bz)
}

/** Widen the check-in radius a little when GPS accuracy is poor. */
export function effectiveRadiusM(radiusM: number, accuracyM?: number | null) {
  if (accuracyM == null || accuracyM <= 25) return radiusM
  return radiusM + Math.min(30, accuracyM - 25)
}

export function pointInBBox(lat: number, lng: number, bbox = GEO.bbox) {
  return lat >= bbox.south && lat <= bbox.north && lng >= bbox.west && lng <= bbox.east
}

export function playableRect() {
  const sw = latLngToLocal(GEO.bbox.south, GEO.bbox.west)
  const ne = latLngToLocal(GEO.bbox.north, GEO.bbox.east)
  return {
    minX: Math.min(sw.x, ne.x),
    maxX: Math.max(sw.x, ne.x),
    minZ: Math.min(sw.z, ne.z),
    maxZ: Math.max(sw.z, ne.z),
  }
}

export function clampToPlayable(x: number, z: number, pad: number = GEO.paddingM) {
  const r = playableRect()
  return {
    x: Math.min(r.maxX + pad, Math.max(r.minX - pad, x)),
    z: Math.min(r.maxZ + pad, Math.max(r.minZ - pad, z)),
  }
}
