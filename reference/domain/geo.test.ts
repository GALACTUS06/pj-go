/** Vitest cases — move to src/domain/*.test.ts when scaffolding. */
import { describe, expect, it } from 'vitest'
import { canCheckIn, grantPiece } from './checkIn'
import { GEO, distM, latLngToLocal, localToLatLng } from './geo'

describe('projection', () => {
  it('maps origin to ~0,0', () => {
    const p = latLngToLocal(GEO.origin.lat, GEO.origin.lng)
    expect(Math.abs(p.x)).toBeLessThan(0.01)
    expect(Math.abs(p.z)).toBeLessThan(0.01)
  })

  it('round-trips inside bbox', () => {
    const lat = 40.948
    const lng = -73.068
    const { x, z } = latLngToLocal(lat, lng)
    const back = localToLatLng(x, z)
    expect(Math.abs(back.lat - lat)).toBeLessThan(1e-6)
    expect(Math.abs(back.lng - lng)).toBeLessThan(1e-6)
  })
})

describe('check-in', () => {
  it('true inside radius', () => {
    expect(
      canCheckIn({
        avatarX: 0,
        avatarZ: 0,
        siteX: 10,
        siteZ: 0,
        radiusM: 50,
        liveOutsideBox: false,
      }),
    ).toBe(true)
  })

  it('false outside radius', () => {
    expect(
      canCheckIn({
        avatarX: 0,
        avatarZ: 0,
        siteX: 80,
        siteZ: 0,
        radiusM: 50,
        liveOutsideBox: false,
      }),
    ).toBe(false)
  })

  it('grant is idempotent', () => {
    const a = grantPiece([], [], 'ferry-terminal')
    expect(a.granted).toBe(true)
    const b = grantPiece(a.checkedInSiteIds, a.puzzlePieceIds, 'ferry-terminal')
    expect(b.granted).toBe(false)
    expect(b.checkedInSiteIds).toHaveLength(1)
  })
})

describe('dist', () => {
  it('hypot', () => {
    expect(distM(0, 0, 3, 4)).toBe(5)
  })
})
