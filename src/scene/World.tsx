import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { ASSETS } from '../config/assets'
import { playableRect } from '../domain/geo'
import type { Ring } from '../domain/water'
import {
  buildBuildingsGeometry,
  buildFlatGeometry,
  buildRoadsGeometry,
  type RoadFeature,
} from './geometry'
import type { BuildingFeature } from './useHarborGeo'

export function Ground() {
  const r = playableRect()
  const w = r.maxX - r.minX + 1200
  const d = r.maxZ - r.minZ + 1200
  return (
    <mesh rotation-x={-Math.PI / 2} position={[(r.minX + r.maxX) / 2, 0, (r.minZ + r.maxZ) / 2]}>
      <planeGeometry args={[w, d]} />
      <meshLambertMaterial color="#cdbf9f" />
    </mesh>
  )
}

export function Buildings({ features }: { features: BuildingFeature[] }) {
  const { geom, edges } = useMemo(() => {
    const geom = buildBuildingsGeometry(features)
    return { geom, edges: new THREE.EdgesGeometry(geom, 25) }
  }, [features])
  useEffect(
    () => () => {
      geom.dispose()
      edges.dispose()
    },
    [geom, edges],
  )
  return (
    <group>
      <mesh geometry={geom}>
        <meshLambertMaterial color="#e3e8ee" />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#8d99a6" />
      </lineSegments>
    </group>
  )
}

export function Water({ rings }: { rings: Ring[] }) {
  const geom = useMemo(() => buildFlatGeometry(rings, 0.05), [rings])
  useEffect(() => () => geom.dispose(), [geom])
  return (
    <mesh geometry={geom}>
      <meshLambertMaterial color="#2f6f8f" />
    </mesh>
  )
}

/** Streets are optional orientation aids; the scene works without them. */
export function Roads() {
  const [features, setFeatures] = useState<RoadFeature[] | null>(null)
  useEffect(() => {
    let alive = true
    fetch(ASSETS.roads)
      .then((r) => (r.ok ? r.json() : null))
      .then((fc) => alive && fc && setFeatures(fc.features))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  const geom = useMemo(() => (features ? buildRoadsGeometry(features, 0.03) : null), [features])
  useEffect(() => () => geom?.dispose(), [geom])
  if (!geom) return null
  return (
    <mesh geometry={geom}>
      <meshLambertMaterial color="#8a857c" />
    </mesh>
  )
}
