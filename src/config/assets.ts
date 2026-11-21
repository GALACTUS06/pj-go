export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export const ASSETS = {
  buildings: assetUrl('geo/port-jefferson-buildings.geojson'),
  water: assetUrl('geo/port-jefferson-water.geojson'),
  roads: assetUrl('geo/port-jefferson-roads.geojson'),
  finale: assetUrl('finale/ferry-puzzle.jpg'),
  clearCache: assetUrl('clear-cache.html'),
}

export const APP_VERSION = __APP_VERSION__
