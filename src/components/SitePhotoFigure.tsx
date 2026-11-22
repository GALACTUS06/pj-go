import { useState } from 'react'
import type { SitePhoto } from '../data/sitePhotos'

/** Site photo with caption; collapses to nothing if the image cannot load (e.g. offline). */
export function SitePhotoFigure({ photo, className }: { photo: SitePhoto; className: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <figure className={className}>
      <img src={photo.url} alt={photo.caption} onError={() => setFailed(true)} />
      <figcaption>{photo.caption}</figcaption>
    </figure>
  )
}
