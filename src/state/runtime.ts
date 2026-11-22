import { create } from 'zustand'
import { SPAWN } from '../data/checkpoints'
import type { Route } from '../domain/route'

/**
 * Per-frame mutable state. The scene reads and writes these every frame;
 * React never re-renders from them directly.
 */
export const player = {
  x: SPAWN.x,
  z: SPAWN.z,
  yaw: 0,
  speed: 0,
}

export const input = {
  /** Joystick / keyboard vector, screen-relative, each axis -1..1 (y up = forward). */
  stickX: 0,
  stickY: 0,
  keyX: 0,
  keyY: 0,
  /** Q/E turn, -1..1 */
  keyTurn: 0,
  /** Camera yaw in radians; 0 looks north (−Z). */
  camYaw: 0,
}

export const gps = {
  /** Latest projected GPS target, or null before the first fix. */
  target: null as { x: number; z: number } | null,
}

export const nav = {
  /** Street route from the walker to the Next site; points[0] is where it was computed. */
  route: null as Route | null,
  /** Bumped whenever `route` changes so the scene can rebuild the line. */
  version: 0,
  targetId: null as string | null,
  /** Auto-walk: the walker follows `route` on its own (Virtual mode). */
  auto: false,
}

if (import.meta.env.DEV) {
  Object.assign(window, { __pj: { player, input, gps, nav } })
}

export function setAutoWalk(on: boolean) {
  nav.auto = on
  useHud.setState({ autoWalk: on })
}

export function teleport(x: number, z: number) {
  player.x = x
  player.z = z
  player.speed = 0
  nav.route = null
  nav.version++
}

export function resetPlayer() {
  teleport(SPAWN.x, SPAWN.z)
  input.camYaw = 0
  setAutoWalk(false)
}

/** Throttled HUD view of the per-frame state (updated ~10×/s). */
export type HudState = {
  inRangeId: string | null
  nearId: string | null
  nextId: string | null
  nextDist: number
  /** Bearing to the next site relative to the camera, radians (0 = straight ahead). */
  nextBearing: number
  gpsAccuracy: number | null
  gpsStatus: 'off' | 'waiting' | 'ok' | 'denied'
  outsideBox: boolean
  /** True while the street route to Next is known. */
  hasRoute: boolean
  autoWalk: boolean
}

export const useHud = create<HudState>()(() => ({
  inRangeId: null,
  nearId: null,
  nextId: null,
  nextDist: 0,
  nextBearing: 0,
  gpsAccuracy: null,
  gpsStatus: 'off',
  outsideBox: false,
  hasRoute: false,
  autoWalk: false,
}))
