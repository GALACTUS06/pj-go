export type SaveV1 = {
  version: 1
  modePreference: 'virtual' | 'live'
  cameraPreference: 'follow' | 'oblique'
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
  }
}

export function migrateSave(raw: unknown): SaveV1 {
  const d = defaultSave()
  if (!raw || typeof raw !== 'object') return d
  const o = raw as Record<string, unknown>
  if (o.version !== 1) return d
  return {
    version: 1,
    modePreference: o.modePreference === 'live' ? 'live' : 'virtual',
    cameraPreference: o.cameraPreference === 'oblique' ? 'oblique' : 'follow',
    checkedInSiteIds: Array.isArray(o.checkedInSiteIds)
      ? o.checkedInSiteIds.filter((x): x is string => typeof x === 'string')
      : [],
    puzzlePieceIds: Array.isArray(o.puzzlePieceIds)
      ? o.puzzlePieceIds.filter((x): x is string => typeof x === 'string')
      : [],
    finaleRevealed: Boolean(o.finaleRevealed),
    tutorialDone: Boolean(o.tutorialDone),
    reducedMotion: Boolean(o.reducedMotion) || undefined,
    navBeaconSiteId:
      typeof o.navBeaconSiteId === 'string' ? o.navBeaconSiteId : null,
  }
}

export function loadSave(storage: Storage = localStorage): SaveV1 {
  try {
    const raw = storage.getItem(SAVE_KEY)
    if (!raw) return defaultSave()
    return migrateSave(JSON.parse(raw))
  } catch {
    return defaultSave()
  }
}

export function writeSave(save: SaveV1, storage: Storage = localStorage) {
  storage.setItem(SAVE_KEY, JSON.stringify(save))
}
