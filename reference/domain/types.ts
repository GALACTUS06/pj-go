export type Checkpoint = {
  id: string
  name: string
  lat: number
  lng: number
  radiusM: number
  priority: boolean
  blurb: string
  facts: string[]
  sources?: string[]
  puzzleSlot: number // 0..8 row-major
}

export type Finale = {
  title: string
  subtitle: string
  imageKey: string
  closingLine: string
}

export type MovementConfig = {
  virtualSpeedMps: number
  gpsLerpSeconds: number
  buildingCollision: boolean
  waterCollision: boolean
  spawnCheckpointId: string
}

export type WayfindingConfig = {
  worldLabels: boolean
  nextNearestChip: boolean
  compassArrow: boolean
  collectionOrder: 'free'
}

export type CheckpointsFile = {
  version: number
  origin: { lat: number; lng: number; note?: string }
  finale: Finale
  checkpoints: Checkpoint[]
  movement: MovementConfig
  wayfinding: WayfindingConfig
  playableBounds?: {
    south: number
    west: number
    north: number
    east: number
    paddingM: number
  }
}

export type AvatarState = {
  x: number
  z: number
  yaw: number
  source: 'virtual' | 'gps' | 'spawn'
}
