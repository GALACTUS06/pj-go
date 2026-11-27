import { create } from 'zustand'
import { SITE_IDS } from '../data/checkpoints'
import { TOOL_IDS } from '../data/story'
import { grantOnce } from '../domain/checkIn'
import { defaultSave, loadSave, writeSave, type SaveV1 } from '../domain/save'
import type { CameraMode, PlayMode } from '../domain/types'

type Actions = {
  setMode: (m: PlayMode) => void
  setCamera: (c: CameraMode) => void
  toggleCamera: () => void
  setReducedMotion: (v: boolean) => void
  /** Marks a site's mini game done. Returns true when its part is newly granted. */
  checkIn: (siteId: string) => boolean
  /** Returns true when the tool is newly picked up. */
  pickUpTool: (toolId: string) => boolean
  revealFinale: () => void
  completeTutorial: () => void
  setStorySeen: () => void
  setBeacon: (id: string | null) => void
  reset: () => void
}

const storage = typeof localStorage !== 'undefined' ? localStorage : null

export const useGame = create<SaveV1 & Actions>()((set, get) => ({
  ...(storage ? loadSave(storage, SITE_IDS, TOOL_IDS) : defaultSave()),
  setMode: (modePreference) => set({ modePreference }),
  setCamera: (cameraPreference) => set({ cameraPreference }),
  toggleCamera: () =>
    set({ cameraPreference: get().cameraPreference === 'follow' ? 'oblique' : 'follow' }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  checkIn: (siteId) => {
    const s = get()
    const r = grantOnce(s.checkedInSiteIds, siteId)
    if (!r.granted) return false
    set({
      checkedInSiteIds: r.ids,
      navBeaconSiteId: s.navBeaconSiteId === siteId ? null : s.navBeaconSiteId,
    })
    return true
  },
  pickUpTool: (toolId) => {
    const s = get()
    const r = grantOnce(s.toolIds, toolId)
    if (!r.granted) return false
    set({ toolIds: r.ids, navBeaconSiteId: s.navBeaconSiteId === toolId ? null : s.navBeaconSiteId })
    return true
  },
  revealFinale: () => set({ finaleRevealed: true }),
  completeTutorial: () => set({ tutorialDone: true }),
  setStorySeen: () => set({ storySeen: true }),
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
      toolIds: s.toolIds,
      finaleRevealed: s.finaleRevealed,
      storySeen: s.storySeen,
      tutorialDone: s.tutorialDone,
      reducedMotion: s.reducedMotion,
      navBeaconSiteId: s.navBeaconSiteId,
    }
    writeSave(save, storage)
  })
}
