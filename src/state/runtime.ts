import { create } from 'zustand'
import { SPAWN } from '../data/checkpoints'

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

if (import.meta.env.DEV) {
  Object.assign(window, { __pj: { player, input, gps } })
}

export function teleport(x: number, z: number) {
  player.x = x
  player.z = z
  player.speed = 0
}

export function resetPlayer() {
  teleport(SPAWN.x, SPAWN.z)
  input.camYaw = 0
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
}))
