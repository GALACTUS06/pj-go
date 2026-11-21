import type { CameraMode, PlayMode } from './types'

export type SaveV1 = {
  version: 1
  modePreference: PlayMode
  cameraPreference: CameraMode
  checkedInSiteIds: string[]
  puzzlePieceIds: string[]
  finaleRevealed: boolean
  tutorialDone: boolean
  reducedMotion?: boolean
  navBeaconSiteId?: string | null
}

export const SAVE_KEY = 'pj-go-save-v1'

export function defaultSave(): SaveV1 {
  return {
    version: 1,
    modePreference: 'virtual',
    cameraPreference: 'follow',
    checkedInSiteIds: [],
    puzzlePieceIds: [],
    finaleRevealed: false,
    tutorialDone: false,
    reducedMotion: false,
    navBeaconSiteId: null,
  }
}

const strings = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

export function migrateSave(raw: unknown, validIds?: string[]): SaveV1 {
  const d = defaultSave()
  if (!raw || typeof raw !== 'object') return d
  const o = raw as Record<string, unknown>
  if (o.version !== 1) return d
  const keep = (ids: string[]) =>
    [...new Set(validIds ? ids.filter((id) => validIds.includes(id)) : ids)]
  return {
    version: 1,
    modePreference: o.modePreference === 'live' ? 'live' : 'virtual',
    cameraPreference: o.cameraPreference === 'oblique' ? 'oblique' : 'follow',
    checkedInSiteIds: keep(strings(o.checkedInSiteIds)),
    puzzlePieceIds: keep(strings(o.puzzlePieceIds)),
    finaleRevealed: Boolean(o.finaleRevealed),
    tutorialDone: Boolean(o.tutorialDone),
    reducedMotion: Boolean(o.reducedMotion),
    navBeaconSiteId: typeof o.navBeaconSiteId === 'string' ? o.navBeaconSiteId : null,
  }
}

export function loadSave(storage: Pick<Storage, 'getItem'>, validIds?: string[]): SaveV1 {
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return defaultSave()
    return migrateSave(JSON.parse(raw), validIds)
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
