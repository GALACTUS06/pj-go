import { distM, effectiveRadiusM } from './geo'

export function canCheckIn(opts: {
  avatarX: number
  avatarZ: number
  siteX: number
  siteZ: number
  radiusM: number
  accuracyM?: number
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
    puzzlePieceIds: puzzlePieceIds.includes(siteId)
      ? puzzlePieceIds
      : [...puzzlePieceIds, siteId],
    granted: true,
  }
}

export function nearestUncollected(
  avatarX: number,
  avatarZ: number,
  sites: { id: string; x: number; z: number }[],
  collectedIds: string[],
): { id: string; distanceM: number } | null {
  let best: { id: string; distanceM: number } | null = null
  for (const s of sites) {
    if (collectedIds.includes(s.id)) continue
    const d = distM(avatarX, avatarZ, s.x, s.z)
    if (!best || d < best.distanceM) best = { id: s.id, distanceM: d }
  }
  return best
}
