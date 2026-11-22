import { useNavigate } from 'react-router-dom'
import { ASSETS } from '../config/assets'
import { en } from '../copy/en'
import { SITES, TOTAL_PIECES } from '../data/checkpoints'
import { photoFor } from '../data/sitePhotos'
import type { Site } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { SitePhotoFigure } from './SitePhotoFigure'

/** Celebration shown right after a check-in: the site's photo and the new puzzle piece. */
export function UnlockReveal({ site, onClose }: { site: Site; onClose: () => void }) {
  const navigate = useNavigate()
  const collected = useGame((s) => s.puzzlePieceIds)
  const complete = collected.length >= TOTAL_PIECES
  const photo = photoFor(site.id)
  const slots = [...SITES].sort((a, b) => a.puzzleSlot - b.puzzleSlot)

  return (
    <div className="unlock-backdrop" onClick={onClose}>
      <section
        className="unlock"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="unlock-kicker">{en.unlock.kicker(collected.length, TOTAL_PIECES)}</p>
        {photo && <SitePhotoFigure photo={photo} className="unlock-photo" />}
        <h2 id="unlock-title">{site.name}</h2>

        <div className="unlock-board" aria-label={en.unlock.board}>
          {slots.map((s) => {
            const on = collected.includes(s.id)
            return (
              <span
                key={s.id}
                className={`unlock-cell${on ? ' is-on' : ''}${s.id === site.id ? ' is-new' : ''}`}
                style={
                  on
                    ? {
                        backgroundImage: `url(${ASSETS.finale})`,
                        backgroundPosition: `${(s.puzzleSlot % 3) * 50}% ${Math.floor(s.puzzleSlot / 3) * 50}%`,
                      }
                    : undefined
                }
              />
            )
          })}
        </div>

        <div className="sheet-actions">
          {complete ? (
            <button className="btn btn-primary" onClick={() => navigate('/puzzle')}>
              {en.sheet.openPuzzle}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              {en.unlock.continue}
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
