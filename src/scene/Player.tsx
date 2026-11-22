import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { showToast } from '../components/Toast'
import { en } from '../copy/en'
import { MOVEMENT, SITES, siteById } from '../data/checkpoints'
import { siteInRange, nearestSite } from '../domain/checkIn'
import { moveWithObstacles, type Obstacle } from '../domain/collision'
import { clampToPlayable, distM } from '../domain/geo'
import { findRoute, pointAlong, progressAlong, type RoadGraph } from '../domain/route'
import type { CameraMode, PlayMode } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { gps, input, nav, player, setAutoWalk, useHud } from '../state/runtime'

const TURN_SPEED = 1.8 // rad/s for Q/E
const NEAR_LABEL_M = 60
/** Auto-walk steers toward a point this far ahead on the route. */
const AUTO_LOOKAHEAD_M = 2.5
/** Auto-walk gives up after this long without progress. */
const AUTO_STUCK_S = 1.5
/** The Next arrow points at the route this far ahead, so it turns at corners. */
const ARROW_LOOKAHEAD_M = 10
/** Re-plan once the walker has moved this far from the route's start. */
const REPLAN_MOVE_M = 1.5

/** Camera forward on the ground plane for yaw θ (θ=0 → north / −Z). */
export const forwardOf = (yaw: number) => ({ x: -Math.sin(yaw), z: -Math.cos(yaw) })
const rightOf = (yaw: number) => ({ x: Math.cos(yaw), z: -Math.sin(yaw) })

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

/** Moves the player from stick/keyboard or auto-walk (Virtual) or GPS (Live). */
export function Controller({ mode, walls }: { mode: PlayMode; walls: Obstacle[] }) {
  const stuck = useRef(0)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    input.camYaw += input.keyTurn * TURN_SPEED * dt

    const px = player.x
    const pz = player.z
    const step = (dx: number, dz: number) => {
      const next = moveWithObstacles(player.x, player.z, dx, dz, walls)
      const c = clampToPlayable(next.x, next.z)
      player.x = c.x
      player.z = c.z
    }
    if (mode === 'live') {
      if (nav.auto) setAutoWalk(false)
      if (gps.target) {
        const t = clampToPlayable(gps.target.x, gps.target.z)
        const k = 1 - Math.exp(-dt / MOVEMENT.gpsLerpSeconds)
        player.x += (t.x - player.x) * k
        player.z += (t.z - player.z) * k
      }
    } else {
      let ix = input.stickX || input.keyX
      let iy = input.stickY || input.keyY
      const mag = Math.hypot(ix, iy)
      if (mag > 1) {
        ix /= mag
        iy /= mag
      }
      if (mag > 0) {
        if (nav.auto) setAutoWalk(false)
        const f = forwardOf(input.camYaw)
        const r = rightOf(input.camYaw)
        const s = MOVEMENT.virtualSpeedMps * dt
        step((f.x * iy + r.x * ix) * s, (f.z * iy + r.z * ix) * s)
      } else if (nav.auto && nav.route) {
        const pts = nav.route.points
        const aim = pointAlong(pts, progressAlong(pts, player) + AUTO_LOOKAHEAD_M)
        const vx = aim.x - player.x
        const vz = aim.z - player.z
        const len = Math.hypot(vx, vz)
        if (len > 0.05) {
          const s = Math.min(len, MOVEMENT.virtualSpeedMps * dt)
          step((vx / len) * s, (vz / len) * s)
          const d = wrapAngle(Math.atan2(-vx, -vz) - input.camYaw)
          input.camYaw += d * Math.min(1, dt * 2.5)
        }
      }
    }
    if (nav.auto) {
      const progressed = Math.hypot(player.x - px, player.z - pz) > 0.005
      stuck.current = progressed ? 0 : stuck.current + dt
      if (stuck.current > AUTO_STUCK_S) {
        stuck.current = 0
        setAutoWalk(false)
      }
    }
    const moved = Math.hypot(player.x - px, player.z - pz)
    player.speed = dt > 0 ? moved / dt : 0
    if (player.speed > 0.2) {
      const target = Math.atan2(-(player.x - px), -(player.z - pz))
      let d = target - player.yaw
      d = Math.atan2(Math.sin(d), Math.cos(d))
      player.yaw += d * Math.min(1, dt * 12)
    }
  })
  return null
}

export function Avatar({ camera }: { camera: CameraMode }) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    g.position.set(player.x, 0, player.z)
    g.rotation.y = player.yaw
    if (body.current) {
      const bob = player.speed > 0.3 ? Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.12 : 0
      body.current.position.y = bob
    }
  })
  return (
    <group ref={group}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.06}>
        <circleGeometry args={[0.9, 24]} />
        <meshBasicMaterial color="#0b1f33" transparent opacity={0.25} />
      </mesh>
      <group ref={body}>
        <mesh position-y={0.95}>
          <capsuleGeometry args={[0.35, 0.9, 6, 12]} />
          <meshLambertMaterial color="#0b1f33" />
        </mesh>
        <mesh position-y={1.05}>
          <cylinderGeometry args={[0.37, 0.37, 0.16, 16]} />
          <meshLambertMaterial color="#c8102e" />
        </mesh>
        <mesh position-y={1.72}>
          <sphereGeometry args={[0.26, 16, 12]} />
          <meshLambertMaterial color="#f1d3b3" />
        </mesh>
        <mesh position={[0, 1.75, -0.24]}>
          <boxGeometry args={[0.2, 0.08, 0.08]} />
          <meshLambertMaterial color="#0b1f33" />
        </mesh>
      </group>
      {/* Drawn over buildings so the walker is never lost inside a footprint. */}
      <group scale={2.6} visible={camera === 'oblique'}>
        <mesh position-y={3.2} rotation-x={Math.PI} renderOrder={10}>
          <coneGeometry args={[0.7, 1.4, 4]} />
          <meshBasicMaterial color="#c8102e" depthTest={false} transparent />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.1} renderOrder={10}>
          <ringGeometry args={[1.3, 1.7, 32]} />
          <meshBasicMaterial color="#c8102e" depthTest={false} transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  )
}

const CAMERA = {
  follow: { back: 8, up: 5, lookUp: 1.6, fogNear: 90, fogFar: 520 },
  oblique: { back: 40, up: 95, lookUp: 0, fogNear: 220, fogFar: 900 },
}

export function CameraRig({ mode, reducedMotion }: { mode: CameraMode; reducedMotion: boolean }) {
  const { camera, scene } = useThree()
  const look = useRef(new THREE.Vector3(player.x, 1.6, player.z))
  const first = useRef(true)

  useFrame((_, delta) => {
    const c = CAMERA[mode]
    const f = forwardOf(input.camYaw)
    const want = new THREE.Vector3(player.x - f.x * c.back, c.up, player.z - f.z * c.back)
    const wantLook = new THREE.Vector3(player.x, c.lookUp, player.z)
    const tau = reducedMotion ? 0.05 : 0.2
    const k = first.current ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) / tau)
    first.current = false
    camera.position.lerp(want, k)
    look.current.lerp(wantLook, k)
    camera.lookAt(look.current)
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near += (c.fogNear - scene.fog.near) * k
      scene.fog.far += (c.fogFar - scene.fog.far) * k
    }
  })
  return null
}

/**
 * Publishes throttled HUD values (in-range site, Next target, compass
 * bearing) and keeps the street route to Next up to date.
 */
export function HudUpdater({ mode, graph, walls }: { mode: PlayMode; graph: RoadGraph; walls: Obstacle[] }) {
  const acc = useRef(0)
  useFrame((_, delta) => {
    acc.current += delta
    if (acc.current < 0.1) return
    acc.current = 0

    const { checkedInSiteIds, navBeaconSiteId } = useGame.getState()
    const hud = useHud.getState()
    const live = mode === 'live'
    const outside = live && hud.outsideBox
    const accuracy = live ? hud.gpsAccuracy : null
    const waitingGps = live && hud.gpsStatus !== 'ok'

    const inRange = waitingGps ? null : siteInRange(player.x, player.z, SITES, accuracy, outside)
    const near = nearestSite(player.x, player.z, SITES)

    const beacon = siteById(navBeaconSiteId)
    const target =
      beacon && !checkedInSiteIds.includes(beacon.id)
        ? beacon
        : (nearestSite(player.x, player.z, SITES, checkedInSiteIds)?.site ?? null)

    const targetId = target?.id ?? null
    const start = nav.route?.points[0]
    if (
      targetId !== nav.targetId ||
      (target && (!start || distM(start.x, start.z, player.x, player.z) > REPLAN_MOVE_M))
    ) {
      nav.targetId = targetId
      nav.route = target ? findRoute(graph, { x: player.x, z: player.z }, target, walls) : null
      nav.version++
    }

    let nextDist = 0
    let nextBearing = 0
    if (target) {
      let aim: { x: number; z: number } = target
      nextDist = distM(player.x, player.z, target.x, target.z)
      if (nav.route) {
        const pts = nav.route.points
        const along = progressAlong(pts, player)
        nextDist = Math.max(0, nav.route.lengthM - along)
        aim = pointAlong(pts, along + ARROW_LOOKAHEAD_M)
      }
      const vx = aim.x - player.x
      const vz = aim.z - player.z
      const f = forwardOf(input.camYaw)
      const r = rightOf(input.camYaw)
      nextBearing = Math.atan2(vx * r.x + vz * r.z, vx * f.x + vz * f.z)
    }

    if (nav.auto && (!target || (inRange && inRange.id === target.id))) {
      setAutoWalk(false)
      if (target) showToast(en.play.arrived(target.name))
    }

    const patch = {
      inRangeId: inRange?.id ?? null,
      nearId: near && near.distanceM < NEAR_LABEL_M ? near.site.id : null,
      nextId: targetId,
      nextDist: Math.round(nextDist),
      nextBearing: Math.round(nextBearing * 50) / 50,
      hasRoute: nav.route != null,
    }
    if (
      patch.inRangeId !== hud.inRangeId ||
      patch.nearId !== hud.nearId ||
      patch.nextId !== hud.nextId ||
      patch.nextDist !== hud.nextDist ||
      patch.nextBearing !== hud.nextBearing ||
      patch.hasRoute !== hud.hasRoute
    ) {
      useHud.setState(patch)
    }
  })
  return null
}
