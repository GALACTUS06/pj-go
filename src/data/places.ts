import { SITES } from './checkpoints'
import { TOOLS } from './story'

/** Anything the navigator can route to: a site or a street tool. */
export type Place = { id: string; name: string; x: number; z: number; kind: 'site' | 'tool' }

export const PLACES: Place[] = [
  ...SITES.map((s) => ({ id: s.id, name: s.name, x: s.x, z: s.z, kind: 'site' as const })),
  ...TOOLS.map((t) => ({ id: t.id, name: t.name, x: t.x, z: t.z, kind: 'tool' as const })),
]

export const placeById = (id: string | null | undefined) => PLACES.find((p) => p.id === id) ?? null
