import raw from '../../data/checkpoints.template.json'
import { latLngToLocal } from '../domain/geo'
import type { CheckpointsFile, Site } from '../domain/types'

export const DATA = raw as CheckpointsFile

export const SITES: Site[] = DATA.checkpoints.map((c) => ({
  ...c,
  ...latLngToLocal(c.lat, c.lng),
}))

export const SITE_IDS = SITES.map((s) => s.id)

export const TOTAL_PIECES = SITES.length

export const siteById = (id: string | null | undefined) => SITES.find((s) => s.id === id) ?? null

const spawnSite = siteById(DATA.movement.spawnCheckpointId) ?? SITES[0]

/** Just south of the spawn site: inside its check-in radius but clear of the marker beam. */
export const SPAWN = { x: spawnSite.x, z: spawnSite.z + 14 }

export const FINALE = DATA.finale
export const MOVEMENT = DATA.movement
