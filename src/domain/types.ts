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
  /** 0..8, row-major on the 3×3 board */
  puzzleSlot: number
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

export type CheckpointsFile = {
  version: number
  origin: { lat: number; lng: number; note?: string }
  finale: Finale
  checkpoints: Checkpoint[]
  movement: MovementConfig
  playableBounds: {
    south: number
    west: number
    north: number
    east: number
    paddingM: number
  }
}

/** Checkpoint with its position in local scene meters. */
export type Site = Checkpoint & { x: number; z: number }

export type PlayMode = 'virtual' | 'live'
export type CameraMode = 'follow' | 'oblique'
