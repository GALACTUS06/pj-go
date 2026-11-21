import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { SITES } from '../data/checkpoints'
import { distM } from '../domain/geo'
import type { Site } from '../domain/types'
import { player } from '../state/runtime'
import { useGame } from '../state/useGameStore'

const LABEL_FULL_M = 40
const LABEL_HIDE_M = 260

function Marker({ site, collected, beacon }: { site: Site; collected: boolean; beacon: boolean }) {
  const beam = useRef<THREE.Mesh>(null)
  const label = useRef<HTMLDivElement>(null)
  const color = collected ? '#5b8c5a' : '#f0b429'
  const height = collected ? 5 : beacon ? 40 : 24

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (beam.current && !collected) {
      const m = beam.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.45 + Math.sin(t * 2.4 + site.puzzleSlot) * 0.15
    }
    if (label.current) {
      const d = distM(player.x, player.z, site.x, site.z)
      const o = beacon
        ? 1
        : 1 - Math.min(1, Math.max(0, (d - LABEL_FULL_M) / (LABEL_HIDE_M - LABEL_FULL_M)))
      label.current.style.opacity = String(collected ? Math.min(o, 0.55) : o)
      label.current.style.display = o < 0.03 ? 'none' : ''
    }
  })

  return (
    <group position={[site.x, 0, site.z]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.08}>
        <ringGeometry args={[site.radiusM - 0.8, site.radiusM, 64]} />
        <meshBasicMaterial color={color} transparent opacity={collected ? 0.35 : 0.7} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.07}>
        <circleGeometry args={[site.radiusM, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh ref={beam} position-y={height / 2}>
        <cylinderGeometry args={[1.1, 1.6, height, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position-y={height + 1.2}>
        <octahedronGeometry args={[1.4]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Html position={[0, height + 4, 0]} center zIndexRange={[10, 0]} pointerEvents="none">
        <div ref={label} className={`world-label${collected ? ' is-done' : ''}${beacon ? ' is-beacon' : ''}`}>
          {collected ? '✓ ' : ''}
          {site.name}
        </div>
      </Html>
    </group>
  )
}

export function Checkpoints() {
  const collected = useGame((s) => s.checkedInSiteIds)
  const beacon = useGame((s) => s.navBeaconSiteId)
  return (
    <>
      {SITES.map((s) => (
        <Marker key={s.id} site={s} collected={collected.includes(s.id)} beacon={beacon === s.id} />
      ))}
    </>
  )
}
