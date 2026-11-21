import { create } from 'zustand'
import { SITE_IDS } from '../data/checkpoints'
import { grantPiece } from '../domain/checkIn'
import { defaultSave, loadSave, writeSave, type SaveV1 } from '../domain/save'
import type { CameraMode, PlayMode } from '../domain/types'

type Actions = {
  setMode: (m: PlayMode) => void
  setCamera: (c: CameraMode) => void
  toggleCamera: () => void
  setReducedMotion: (v: boolean) => void
  /** Returns true when a new piece was granted. */
  checkIn: (siteId: string) => boolean
  revealFinale: () => void
  completeTutorial: () => void
  setBeacon: (id: string | null) => void
  reset: () => void
}

const storage = typeof localStorage !== 'undefined' ? localStorage : null

export const useGame = create<SaveV1 & Actions>()((set, get) => ({
  ...(storage ? loadSave(storage, SITE_IDS) : defaultSave()),
  setMode: (modePreference) => set({ modePreference }),
  setCamera: (cameraPreference) => set({ cameraPreference }),
  toggleCamera: () =>
    set({ cameraPreference: get().cameraPreference === 'follow' ? 'oblique' : 'follow' }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  checkIn: (siteId) => {
    const s = get()
    const r = grantPiece(s.checkedInSiteIds, s.puzzlePieceIds, siteId)
    if (!r.granted) return false
    set({
      checkedInSiteIds: r.checkedInSiteIds,
      puzzlePieceIds: r.puzzlePieceIds,
      navBeaconSiteId: s.navBeaconSiteId === siteId ? null : s.navBeaconSiteId,
    })
    return true
  },
  revealFinale: () => set({ finaleRevealed: true }),
  completeTutorial: () => set({ tutorialDone: true }),
  setBeacon: (navBeaconSiteId) => set({ navBeaconSiteId }),
  reset: () => {
    const { modePreference, cameraPreference, reducedMotion } = get()
    set({ ...defaultSave(), modePreference, cameraPreference, reducedMotion })
  },
}))

if (storage) {
  useGame.subscribe((s) => {
    const save: SaveV1 = {
      version: 1,
      modePreference: s.modePreference,
      cameraPreference: s.cameraPreference,
      checkedInSiteIds: s.checkedInSiteIds,
      puzzlePieceIds: s.puzzlePieceIds,
      finaleRevealed: s.finaleRevealed,
      tutorialDone: s.tutorialDone,
      reducedMotion: s.reducedMotion,
      navBeaconSiteId: s.navBeaconSiteId,
    }
    writeSave(save, storage)
  })
}
