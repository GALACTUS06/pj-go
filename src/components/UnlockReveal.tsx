import { useNavigate } from 'react-router-dom'
import { TOTAL_PIECES } from '../data/checkpoints'
import { photoFor } from '../data/sitePhotos'
import { PARTS, SITE_STORY, TOOLS } from '../data/story'
import type { Site } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { ItemIcon } from './ItemIcon'
import { SitePhotoFigure } from './SitePhotoFigure'

/** Reward after a site's mini game: the site's photo, the ship part earned, and Hal's comment. */
export function UnlockReveal({ site, onClose }: { site: Site; onClose: () => void }) {
  const navigate = useNavigate()
  const parts = useGame((s) => s.checkedInSiteIds.length)
  const tools = useGame((s) => s.toolIds.length)
  const story = SITE_STORY[site.id]
  const part = PARTS[story.part]
  const photo = photoFor(site.id)
  const ready = parts >= TOTAL_PIECES && tools >= TOOLS.length

  return (
    <div className="unlock-backdrop" onClick={onClose}>
      <section
        className="unlock"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="unlock-kicker">Part earned · {site.name}</p>
        {photo && <SitePhotoFigure photo={photo} className="unlock-photo" />}
        <div className="reward-part">
          <span className="reward-icon">
            <ItemIcon id={story.part} size={44} />
          </span>
          <div>
            <h2 id="unlock-title">{part.name}</h2>
            <p className="muted">{part.blurb}</p>
          </div>
        </div>
        <p className="reward-hal">{story.reward}</p>
        <p className="reward-progress">
          Parts {parts}/{TOTAL_PIECES} · Tools {tools}/{TOOLS.length}
        </p>

        <div className="sheet-actions">
          {ready ? (
            <button className="btn btn-primary" onClick={() => navigate('/shipyard')}>
              Go to Hal’s shipyard
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Keep exploring
            </button>
          )}
        </div>
        {photo && (
          <p className="unlock-credit">
            <a href={photo.source} target="_blank" rel="noreferrer">
              {photo.credit}
            </a>
          </p>
        )}
      </section>
    </div>
  )
}
