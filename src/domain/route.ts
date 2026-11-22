import { blockedAt, segmentBlocked, type Obstacle } from './collision'
import { latLngToLocal } from './geo'

export type Pt = { x: number; z: number }

export type RoadFeature = {
  properties: { highway?: string }
  geometry: { type: string; coordinates: number[][] }
}

export type RoadGraph = {
  nodes: Pt[]
  adj: { to: number; w: number }[][]
  /** Undirected edges as node index pairs (for snapping onto the network). */
  edges: [number, number][]
}

export type Route = { points: Pt[]; lengthM: number }

/** How many nearby edges are tried when looking for a clear way onto the road. */
const SNAP_CANDIDATES = 24

/**
 * Street centerlines → graph. OSM ways that share a node share an exact
 * coordinate, which becomes one graph node. Only the largest connected
 * component is kept so every snapped route can reach every other.
 * Segments that pass through an obstacle (service passages under buildings)
 * are dropped so routes stay walkable.
 */
export function buildRoadGraph(features: RoadFeature[], obstacles: Obstacle[] = []): RoadGraph {
  const index = new Map<string, number>()
  const nodes: Pt[] = []
  const pairs: [number, number][] = []
  const nodeOf = ([lng, lat]: number[]) => {
    const key = `${lng.toFixed(7)},${lat.toFixed(7)}`
    let i = index.get(key)
    if (i === undefined) {
      i = nodes.length
      index.set(key, i)
      nodes.push(latLngToLocal(lat, lng))
    }
    return i
  }
  for (const f of features) {
    if (f.geometry?.type !== 'LineString') continue
    const ids = f.geometry.coordinates.map(nodeOf)
    for (let i = 0; i < ids.length - 1; i++) {
      const a = nodes[ids[i]]
      const b = nodes[ids[i + 1]]
      if (ids[i] === ids[i + 1] || segmentBlocked(a.x, a.z, b.x, b.z, obstacles)) continue
      pairs.push([ids[i], ids[i + 1]])
    }
  }

  const parent = nodes.map((_, i) => i)
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  for (const [a, b] of pairs) parent[find(a)] = find(b)
  const size = new Map<number, number>()
  for (let i = 0; i < nodes.length; i++) size.set(find(i), (size.get(find(i)) ?? 0) + 1)
  let main = -1
  let best = 0
  for (const [root, n] of size) if (n > best) [main, best] = [root, n]

  const remap = new Map<number, number>()
  const kept: Pt[] = []
  nodes.forEach((p, i) => {
    if (find(i) !== main) return
    remap.set(i, kept.length)
    kept.push(p)
  })
  const adj: RoadGraph['adj'] = kept.map(() => [])
  const edges: [number, number][] = []
  for (const [a0, b0] of pairs) {
    const a = remap.get(a0)
    const b = remap.get(b0)
    if (a === undefined || b === undefined) continue
    const w = Math.hypot(kept[a].x - kept[b].x, kept[a].z - kept[b].z)
    adj[a].push({ to: b, w })
    adj[b].push({ to: a, w })
    edges.push([a, b])
  }
  return { nodes: kept, adj, edges }
}

type Snap = { edge: number; p: Pt; dist: number }

function project(g: RoadGraph, e: number, x: number, z: number): Snap {
  const a = g.nodes[g.edges[e][0]]
  const b = g.nodes[g.edges[e][1]]
  const vx = b.x - a.x
  const vz = b.z - a.z
  const len2 = vx * vx + vz * vz
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((x - a.x) * vx + (z - a.z) * vz) / len2)) : 0
  const p = { x: a.x + vx * t, z: a.z + vz * t }
  return { edge: e, p, dist: Math.hypot(x - p.x, z - p.z) }
}

/**
 * Nearest point on the network. With obstacles, prefer one on open ground,
 * and (when `clearLine`) one reachable from (x,z) in a straight, clear line.
 */
export function snapToRoad(
  g: RoadGraph,
  x: number,
  z: number,
  obstacles: Obstacle[] = [],
  clearLine = true,
): Snap | null {
  if (!g.edges.length) return null
  const all = g.edges.map((_, e) => project(g, e, x, z)).sort((a, b) => a.dist - b.dist)
  if (obstacles.length) {
    for (const s of all.slice(0, SNAP_CANDIDATES)) {
      const ok = clearLine
        ? !segmentBlocked(x, z, s.p.x, s.p.z, obstacles)
        : !blockedAt(s.p.x, s.p.z, obstacles)
      if (ok) return s
    }
  }
  return all[0]
}

class MinHeap {
  private items: [number, number][] = []
  get size() {
    return this.items.length
  }
  push(node: number, f: number) {
    const a = this.items
    a.push([node, f])
    let i = a.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (a[p][1] <= a[i][1]) break
      ;[a[p], a[i]] = [a[i], a[p]]
      i = p
    }
  }
  pop(): number {
    const a = this.items
    const top = a[0][0]
    const last = a.pop()!
    if (a.length) {
      a[0] = last
      let i = 0
      for (;;) {
        const l = i * 2 + 1
        const r = l + 1
        let m = i
        if (l < a.length && a[l][1] < a[m][1]) m = l
        if (r < a.length && a[r][1] < a[m][1]) m = r
        if (m === i) break
        ;[a[m], a[i]] = [a[i], a[m]]
        i = m
      }
    }
    return top
  }
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.z - b.z)

/**
 * Walking route from `from` to `to` along the street network: a clear
 * straight hop onto the nearest road, A* over the graph, then a final hop to
 * the target when that hop does not cut through a building.
 */
export function findRoute(g: RoadGraph, from: Pt, to: Pt, obstacles: Obstacle[] = []): Route | null {
  const s = snapToRoad(g, from.x, from.z, obstacles)
  const e = snapToRoad(g, to.x, to.z, obstacles, false)
  if (!s || !e) return null

  let middle: Pt[]
  if (s.edge === e.edge) {
    middle = [s.p, e.p]
  } else {
    const N = g.nodes.length
    const START = N
    const END = N + 1
    const [sa, sb] = g.edges[s.edge]
    const [ea, eb] = g.edges[e.edge]
    const extra = new Map<number, { to: number; w: number }[]>()
    const link = (from: number, to: number, w: number) => {
      const list = extra.get(from) ?? []
      list.push({ to, w })
      extra.set(from, list)
    }
    link(START, sa, dist(s.p, g.nodes[sa]))
    link(START, sb, dist(s.p, g.nodes[sb]))
    link(ea, END, dist(e.p, g.nodes[ea]))
    link(eb, END, dist(e.p, g.nodes[eb]))

    const pos = (n: number) => (n === START ? s.p : n === END ? e.p : g.nodes[n])
    const gScore = new Map<number, number>([[START, 0]])
    const prev = new Map<number, number>()
    const closed = new Set<number>()
    const open = new MinHeap()
    open.push(START, dist(s.p, e.p))
    while (open.size) {
      const n = open.pop()
      if (n === END) break
      if (closed.has(n)) continue
      closed.add(n)
      const neighbors = [...(n < N ? g.adj[n] : []), ...(extra.get(n) ?? [])]
      for (const { to: m, w } of neighbors) {
        const cand = gScore.get(n)! + w
        if (cand < (gScore.get(m) ?? Infinity)) {
          gScore.set(m, cand)
          prev.set(m, n)
          open.push(m, cand + dist(pos(m), e.p))
        }
      }
    }
    if (!prev.has(END)) return null
    middle = []
    for (let n: number | undefined = END; n !== undefined; n = prev.get(n)) middle.push(pos(n))
    middle.reverse()
  }

  const points: Pt[] = [from, ...middle]
  if (!segmentBlocked(e.p.x, e.p.z, to.x, to.z, obstacles)) points.push(to)
  const clean = points.filter((p, i) => i === 0 || dist(p, points[i - 1]) > 0.05)
  let lengthM = 0
  for (let i = 1; i < clean.length; i++) lengthM += dist(clean[i - 1], clean[i])
  return { points: clean, lengthM }
}

/** Distance along the polyline of the point on it closest to `p`. */
export function progressAlong(points: Pt[], p: Pt): number {
  let best = Infinity
  let bestAt = 0
  let acc = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const vx = b.x - a.x
    const vz = b.z - a.z
    const len2 = vx * vx + vz * vz
    const seg = Math.sqrt(len2)
    const t = len2 > 0 ? Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.z - a.z) * vz) / len2)) : 0
    const d = Math.hypot(p.x - (a.x + vx * t), p.z - (a.z + vz * t))
    if (d < best) {
      best = d
      bestAt = acc + seg * t
    }
    acc += seg
  }
  return bestAt
}

/** Point `d` meters along a polyline (clamped to its ends). */
export function pointAlong(points: Pt[], d: number): Pt {
  if (!points.length) return { x: 0, z: 0 }
  let left = Math.max(0, d)
  for (let i = 1; i < points.length; i++) {
    const seg = dist(points[i - 1], points[i])
    if (left <= seg && seg > 0) {
      const t = left / seg
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        z: points[i - 1].z + (points[i].z - points[i - 1].z) * t,
      }
    }
    left -= seg
  }
  return points[points.length - 1]
}
