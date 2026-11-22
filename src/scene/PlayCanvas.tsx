import { Canvas } from '@react-three/fiber'
import type { CameraMode, PlayMode } from '../domain/types'
import { Checkpoints } from './Checkpoints'
import { Avatar, CameraRig, Controller, HudUpdater } from './Player'
import { RouteLine } from './RouteLine'
import type { HarborGeo } from './useHarborGeo'
import { Buildings, Ground, Roads, Water } from './World'

type Props = {
  geo: HarborGeo
  mode: PlayMode
  camera: CameraMode
  reducedMotion: boolean
}

export function PlayCanvas({ geo, mode, camera, reducedMotion }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 55, near: 0.5, far: 2500, position: [0, 30, 30] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#dfe7ee']} />
      <fog attach="fog" args={['#dfe7ee', 90, 520]} />
      <hemisphereLight args={['#ffffff', '#b9a98a', 0.9]} />
      <directionalLight position={[-120, 200, 80]} intensity={1.6} />
      <Ground />
      <Roads features={geo.roads} />
      <Water rings={geo.waterRings} />
      <RouteLine reducedMotion={reducedMotion} />
      <Buildings features={geo.buildings.features} />
      <Checkpoints />
      <Avatar camera={camera} />
      <Controller mode={mode} walls={geo.walls} />
      <CameraRig mode={camera} reducedMotion={reducedMotion} />
      <HudUpdater mode={mode} graph={geo.graph} walls={geo.walls} />
    </Canvas>
  )
}
