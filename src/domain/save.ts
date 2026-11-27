import type { CameraMode, PlayMode } from './types'

export type SaveV1 = {
  version: 1
  modePreference: PlayMode
  cameraPreference: CameraMode
  /** Sites whose mini game is done — each one has given its ship part. */
  checkedInSiteIds: string[]
  /** Street tools picked up. */
  toolIds: string[]
  /** The sloop has been built and launched. */
  finaleRevealed: boolean
  storySeen: boolean
  tutorialDone: boolean
  reducedMotion?: boolean
  /** Site or tool the player chose to route to. */
  navBeaconSiteId?: string | null
}

export const SAVE_KEY = 'pj-go-save-v1'

export function defaultSave(): SaveV1 {
  return {
    version: 1,
    modePreference: 'virtual',
    cameraPreference: 'follow',
    checkedInSiteIds: [],
    toolIds: [],
    finaleRevealed: false,
    storySeen: false,
    tutorialDone: false,
    reducedMotion: false,
    navBeaconSiteId: null,
  }
}

const strings = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

const keep = (ids: string[], valid?: string[]) => [...new Set(valid ? ids.filter((id) => valid.includes(id)) : ids)]

export function migrateSave(raw: unknown, validIds?: string[], validToolIds?: string[]): SaveV1 {
  const d = defaultSave()
  if (!raw || typeof raw !== 'object') return d
  const o = raw as Record<string, unknown>
  if (o.version !== 1) return d
  return {
    version: 1,
    modePreference: o.modePreference === 'live' ? 'live' : 'virtual',
    cameraPreference: o.cameraPreference === 'oblique' ? 'oblique' : 'follow',
    checkedInSiteIds: keep(strings(o.checkedInSiteIds), validIds),
    toolIds: keep(strings(o.toolIds), validToolIds),
    finaleRevealed: Boolean(o.finaleRevealed),
    storySeen: Boolean(o.storySeen),
    tutorialDone: Boolean(o.tutorialDone),
    reducedMotion: Boolean(o.reducedMotion),
    navBeaconSiteId: typeof o.navBeaconSiteId === 'string' ? o.navBeaconSiteId : null,
  }
}

export function loadSave(
  storage: Pick<Storage, 'getItem'>,
  validIds?: string[],
  validToolIds?: string[],
): SaveV1 {
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return defaultSave()
    return migrateSave(JSON.parse(raw), validIds, validToolIds)
  } catch {
    return defaultSave()
  }
}

export function writeSave(save: SaveV1, storage: Pick<Storage, 'setItem'>) {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    // Private mode / quota: progress just won't persist.
  }
}
