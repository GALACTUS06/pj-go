import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { en } from '../copy/en'
import { TOTAL_PIECES } from '../data/checkpoints'
import { photoFor } from '../data/sitePhotos'
import type { Site } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { UnlockReveal } from './UnlockReveal'

export function CheckInSheet({ site, onClose }: { site: Site; onClose: () => void }) {
  const navigate = useNavigate()
  const collectedIds = useGame((s) => s.checkedInSiteIds)
  const checkIn = useGame((s) => s.checkIn)
  const [revealed, setRevealed] = useState(false)
  const collected = collectedIds.includes(site.id)
  const complete = collectedIds.length >= TOTAL_PIECES
  const photo = collected ? photoFor(site.id) : null

  if (revealed) return <UnlockReveal site={site} onClose={onClose} />

  const collect = () => {
    if (checkIn(site.id)) setRevealed(true)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        {photo && (
          <figure className="sheet-photo">
            <img src={photo.url} alt={photo.caption} />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        )}
        <p className="sheet-kicker">{site.priority ? 'Landmark' : 'Harbor stop'} · Piece {site.puzzleSlot + 1}</p>
        <h2 id="sheet-title">{site.name}</h2>
        <p className="sheet-blurb">{site.blurb}</p>
        <ul className="sheet-facts">
          {site.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        {site.sources?.length ? (
          <p className="sheet-sources">
            {en.sheet.sources}:{' '}
            {site.sources.map((s) => (
              <a key={s} href={s} target="_blank" rel="noreferrer">
                {new URL(s).hostname}
              </a>
            ))}
          </p>
        ) : null}
        {photo && (
          <p className="sheet-sources">
            <a href={photo.source} target="_blank" rel="noreferrer">
              {photo.credit}
            </a>
          </p>
        )}
        <div className="sheet-actions">
          {collected ? (
            complete ? (
              <button className="btn btn-primary" onClick={() => navigate('/puzzle')}>
                {en.sheet.openPuzzle}
              </button>
            ) : (
              <span className="badge-done">✓ {en.sheet.collected}</span>
            )
          ) : (
            <button className="btn btn-primary" onClick={collect}>
              {en.sheet.collect}
            </button>
          )}
          <button className="btn btn-ghost" onClick={onClose}>
            {en.sheet.close}
          </button>
        </div>
      </section>
    </div>
  )
}
