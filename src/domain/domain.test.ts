import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import data from '../../data/checkpoints.template.json'
import { canCheckIn, grantPiece, siteInRange } from './checkIn'
import { GEO, distM, latLngToLocal, localToLatLng, pointInBBox } from './geo'
import { migrateSave } from './save'
import { inWater, moveWithWater, ringsFromGeoJSON } from './water'

const water = ringsFromGeoJSON(
  JSON.parse(readFileSync(join(__dirname, '../../public/geo/port-jefferson-water.geojson'), 'utf8')),
)
const sites = data.checkpoints.map((c) => ({ ...c, ...latLngToLocal(c.lat, c.lng) }))

describe('projection', () => {
  it('maps the origin to ~(0,0)', () => {
    const p = latLngToLocal(GEO.origin.lat, GEO.origin.lng)
    expect(Math.abs(p.x)).toBeLessThan(0.01)
    expect(Math.abs(p.z)).toBeLessThan(0.01)
  })

  it('round-trips inside the bbox within 0.5 m', () => {
    const { x, z } = latLngToLocal(40.948, -73.068)
    const back = localToLatLng(x, z)
    const again = latLngToLocal(back.lat, back.lng)
    expect(distM(x, z, again.x, again.z)).toBeLessThan(0.5)
  })

  it('puts north at −Z and east at +X', () => {
    expect(latLngToLocal(GEO.origin.lat + 0.001, GEO.origin.lng).z).toBeLessThan(0)
    expect(latLngToLocal(GEO.origin.lat, GEO.origin.lng + 0.001).x).toBeGreaterThan(0)
  })
})

describe('check-in', () => {
  const base = { avatarX: 0, avatarZ: 0, siteZ: 0, radiusM: 50, liveOutsideBox: false }

  it('is allowed inside the radius', () => {
    expect(canCheckIn({ ...base, siteX: 10 })).toBe(true)
  })

  it('is refused outside the radius', () => {
    expect(canCheckIn({ ...base, siteX: 80 })).toBe(false)
  })

  it('widens with poor GPS accuracy', () => {
    expect(canCheckIn({ ...base, siteX: 60, accuracyM: 45 })).toBe(true)
  })

  it('is refused when Live is outside the box', () => {
    expect(canCheckIn({ ...base, siteX: 0, liveOutsideBox: true })).toBe(false)
  })

  it('grants each piece once', () => {
    const a = grantPiece([], [], 'ferry-terminal')
    expect(a.granted).toBe(true)
    const b = grantPiece(a.checkedInSiteIds, a.puzzlePieceIds, 'ferry-terminal')
    expect(b.granted).toBe(false)
    expect(b.checkedInSiteIds).toEqual(['ferry-terminal'])
  })

  it('picks the nearest site when radii overlap', () => {
    const s = sites.find((x) => x.id === 'bayles-shipyard')!
    expect(siteInRange(s.x, s.z, sites, null, false)?.id).toBe('bayles-shipyard')
  })
})

describe('save', () => {
  it('fills tutorialDone for older saves', () => {
    const s = migrateSave({ version: 1, checkedInSiteIds: ['ferry-terminal'] })
    expect(s.tutorialDone).toBe(false)
    expect(s.checkedInSiteIds).toEqual(['ferry-terminal'])
  })

  it('drops unknown site ids and duplicates', () => {
    const s = migrateSave({ version: 1, checkedInSiteIds: ['a', 'ferry-terminal', 'ferry-terminal'] }, [
      'ferry-terminal',
    ])
    expect(s.checkedInSiteIds).toEqual(['ferry-terminal'])
  })

  it('resets unknown versions', () => {
    expect(migrateSave({ version: 9, checkedInSiteIds: ['x'] }).checkedInSiteIds).toEqual([])
  })
})

describe('content data', () => {
  it('has 9 sites with unique ids and puzzle slots 0..8', () => {
    expect(sites).toHaveLength(9)
    expect(new Set(sites.map((s) => s.id)).size).toBe(9)
    expect(sites.map((s) => s.puzzleSlot).sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('keeps every site on land inside the playable box with copy', () => {
    for (const s of sites) {
      expect(pointInBBox(s.lat, s.lng), s.id).toBe(true)
      expect(inWater(s.x, s.z, water), s.id).toBe(false)
      expect(s.blurb.length, s.id).toBeGreaterThan(20)
      expect(s.facts.length, s.id).toBeGreaterThan(0)
    }
  })
})

describe('water', () => {
  it('has a harbor polygon', () => {
    expect(water.length).toBeGreaterThan(0)
  })

  it('blocks walking straight into the harbor', () => {
    const start = latLngToLocal(40.9471, -73.0696)
    let p = { ...start }
    for (let i = 0; i < 400; i++) p = moveWithWater(p.x, p.z, 0, -1, water)
    expect(inWater(p.x, p.z, water)).toBe(false)
  })

  it('lets a walker stranded in the water move out', () => {
    const wet = latLngToLocal(40.9500, -73.0720)
    expect(inWater(wet.x, wet.z, water)).toBe(true)
    const p = moveWithWater(wet.x, wet.z, 1, 1, water)
    expect(p).toEqual({ x: wet.x + 1, z: wet.z + 1 })
  })
})
