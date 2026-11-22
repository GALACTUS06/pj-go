import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MIN_BUILDING_AREA_M2 } from '../domain/collision'
import { latLngToLocal } from '../domain/geo'
import type { Pt, RoadFeature } from '../domain/route'
import type { Ring } from '../domain/water'
import type { BuildingFeature } from './useHarborGeo'

const LEVEL_M = 3.2
const DEFAULT_HEIGHT_M = 9
const MIN_AREA_M2 = MIN_BUILDING_AREA_M2

/** Shapes live in XY; after rotateX(-90°) shape (x, -z) lands on world (x, ·, z). */
const toShapePts = (ring: Ring) => ring.map((p) => new THREE.Vector2(p.x, -p.z))

function project(coords: number[][]): Ring {
  return coords.map(([lng, lat]) => latLngToLocal(lat, lng))
}

function heightOf(props: BuildingFeature['properties']) {
  const h = parseFloat(String(props.height ?? ''))
  if (Number.isFinite(h) && h > 2) return Math.min(h, 60)
  const lv = parseFloat(String(props['building:levels'] ?? ''))
  if (Number.isFinite(lv) && lv > 0) return Math.min(lv * LEVEL_M + 1, 60)
  return DEFAULT_HEIGHT_M
}

export function buildBuildingsGeometry(features: BuildingFeature[]) {
  const parts: THREE.BufferGeometry[] = []
  for (const f of features) {
    if (f.geometry?.type !== 'Polygon') continue
    const rings = (f.geometry.coordinates as number[][][]).map(project)
    const shape = new THREE.Shape(toShapePts(rings[0]))
    if (Math.abs(THREE.ShapeUtils.area(shape.getPoints())) < MIN_AREA_M2) continue
    for (const hole of rings.slice(1)) shape.holes.push(new THREE.Path(toShapePts(hole)))
    const g = new THREE.ExtrudeGeometry(shape, { depth: heightOf(f.properties), bevelEnabled: false })
    g.rotateX(-Math.PI / 2)
    parts.push(g.index ? g.toNonIndexed() : g)
  }
  const merged = parts.length ? mergeGeometries(parts, false) : new THREE.BufferGeometry()
  parts.forEach((p) => p.dispose())
  merged.computeBoundingSphere()
  return merged
}

export function buildFlatGeometry(rings: Ring[], y: number) {
  const parts = rings.map((r) => {
    const g = new THREE.ShapeGeometry(new THREE.Shape(toShapePts(r)))
    g.rotateX(-Math.PI / 2)
    g.translate(0, y, 0)
    return g
  })
  const merged = parts.length ? mergeGeometries(parts, false) : new THREE.BufferGeometry()
  parts.forEach((p) => p.dispose())
  return merged
}

const ROAD_WIDTH: Record<string, number> = {
  primary: 9,
  secondary: 8,
  tertiary: 7,
  residential: 6,
  unclassified: 6,
  living_street: 5,
  service: 4,
  pedestrian: 4,
  footway: 2,
  path: 2,
  steps: 2,
}

/** Flat ribbons along each street centerline. */
export function buildRoadsGeometry(features: RoadFeature[], y: number) {
  const pos: number[] = []
  for (const f of features) {
    if (f.geometry?.type !== 'LineString') continue
    const w = (ROAD_WIDTH[f.properties.highway ?? ''] ?? 4) / 2
    pushRibbon(pos, project(f.geometry.coordinates), w, y)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

/** Upward-facing quads of half-width `w` along a polyline. */
function pushRibbon(pos: number[], pts: Pt[], w: number, y: number) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const len = Math.hypot(b.x - a.x, b.z - a.z)
    if (len < 0.01) continue
    const nx = (-(b.z - a.z) / len) * w
    const nz = ((b.x - a.x) / len) * w
    const quad = [
      [a.x + nx, a.z + nz],
      [a.x - nx, a.z - nz],
      [b.x - nx, b.z - nz],
      [b.x + nx, b.z + nz],
    ]
    for (const k of [0, 2, 1, 0, 3, 2]) pos.push(quad[k][0], y, quad[k][1])
  }
}

const JOINT_SEGMENTS = 10

/** Navigation line: a ribbon with round joints so corners have no gaps. */
export function buildRouteGeometry(pts: Pt[], halfWidth: number, y: number) {
  const pos: number[] = []
  pushRibbon(pos, pts, halfWidth, y)
  for (const p of pts.slice(1)) {
    for (let k = 0; k < JOINT_SEGMENTS; k++) {
      const a0 = (k / JOINT_SEGMENTS) * Math.PI * 2
      const a1 = ((k + 1) / JOINT_SEGMENTS) * Math.PI * 2
      pos.push(p.x, y, p.z)
      pos.push(p.x + Math.cos(a1) * halfWidth, y, p.z + Math.sin(a1) * halfWidth)
      pos.push(p.x + Math.cos(a0) * halfWidth, y, p.z + Math.sin(a0) * halfWidth)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return g
}
