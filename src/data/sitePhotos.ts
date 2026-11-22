import raw from '../../data/site-photos.json'
import { assetUrl } from '../config/assets'

type PhotoEntry = { file: string; caption: string; author: string; license: string; source: string }

const PHOTOS = raw as Record<string, PhotoEntry>

export type SitePhoto = { url: string; caption: string; credit: string; source: string }

export function photoFor(siteId: string): SitePhoto | null {
  const p = PHOTOS[siteId]
  if (!p) return null
  return {
    url: assetUrl(p.file),
    caption: p.caption,
    credit: `Photo: ${p.author} / Wikimedia Commons, ${p.license}`,
    source: p.source,
  }
}
