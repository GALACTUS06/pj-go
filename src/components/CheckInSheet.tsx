import { useNavigate } from 'react-router-dom'
import { en } from '../copy/en'
import { TOTAL_PIECES } from '../data/checkpoints'
import type { Site } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { showToast } from './Toast'

export function CheckInSheet({ site, onClose }: { site: Site; onClose: () => void }) {
  const navigate = useNavigate()
  const collectedIds = useGame((s) => s.checkedInSiteIds)
  const checkIn = useGame((s) => s.checkIn)
  const collected = collectedIds.includes(site.id)
  const complete = collectedIds.length >= TOTAL_PIECES

  const collect = () => {
    if (checkIn(site.id)) {
      showToast(en.toast.piece(useGame.getState().checkedInSiteIds.length, TOTAL_PIECES))
    }
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
