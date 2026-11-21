import { distM, effectiveRadiusM } from './geo'

export function canCheckIn(opts: {
  avatarX: number
  avatarZ: number
  siteX: number
  siteZ: number
  radiusM: number
  accuracyM?: number | null
  liveOutsideBox: boolean
}): boolean {
  if (opts.liveOutsideBox) return false
  const d = distM(opts.avatarX, opts.avatarZ, opts.siteX, opts.siteZ)
  return d < effectiveRadiusM(opts.radiusM, opts.accuracyM)
}

export function grantPiece(
  checkedInSiteIds: string[],
  puzzlePieceIds: string[],
  siteId: string,
): { checkedInSiteIds: string[]; puzzlePieceIds: string[]; granted: boolean } {
  if (checkedInSiteIds.includes(siteId)) {
    return { checkedInSiteIds, puzzlePieceIds, granted: false }
  }
  return {
    checkedInSiteIds: [...checkedInSiteIds, siteId],
    puzzlePieceIds: puzzlePieceIds.includes(siteId) ? puzzlePieceIds : [...puzzlePieceIds, siteId],
    granted: true,
  }
}

type Pt = { id: string; x: number; z: number }

export function nearestSite<T extends Pt>(
  x: number,
  z: number,
  sites: T[],
  exclude: string[] = [],
): { site: T; distanceM: number } | null {
  let best: { site: T; distanceM: number } | null = null
  for (const s of sites) {
    if (exclude.includes(s.id)) continue
    const d = distM(x, z, s.x, s.z)
    if (!best || d < best.distanceM) best = { site: s, distanceM: d }
  }
  return best
}

/** Nearest site whose (effective) radius contains the avatar. */
export function siteInRange<T extends Pt & { radiusM: number }>(
  x: number,
  z: number,
  sites: T[],
  accuracyM: number | null,
  liveOutsideBox: boolean,
): T | null {
  let best: { site: T; d: number } | null = null
  for (const s of sites) {
    if (
      !canCheckIn({
        avatarX: x,
        avatarZ: z,
        siteX: s.x,
        siteZ: s.z,
        radiusM: s.radiusM,
        accuracyM,
        liveOutsideBox,
      })
    ) {
      continue
    }
    const d = distM(x, z, s.x, s.z)
    if (!best || d < best.d) best = { site: s, d }
  }
  return best?.site ?? null
}
