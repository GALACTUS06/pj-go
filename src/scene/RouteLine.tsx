import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { nav } from '../state/runtime'
import { buildRouteGeometry } from './geometry'

const HALF_WIDTH_M = 0.9
const LIFT_M = 0.09

/** Glowing street route from the walker to the Next site. */
export function RouteLine({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const seen = useRef(-1)

  useEffect(() => () => mesh.current?.geometry.dispose(), [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    if (seen.current !== nav.version) {
      seen.current = nav.version
      m.geometry.dispose()
      m.geometry = nav.route
        ? buildRouteGeometry(nav.route.points, HALF_WIDTH_M, LIFT_M)
        : new THREE.BufferGeometry()
    }
    if (material.current && !reducedMotion) {
      material.current.opacity = 0.78 + Math.sin(clock.elapsedTime * 3) * 0.14
    }
  })

  return (
    <mesh ref={mesh} renderOrder={2}>
      <bufferGeometry />
      <meshBasicMaterial
        ref={material}
        color="#1a8cff"
        transparent
        opacity={0.85}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}
