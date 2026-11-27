import { useState } from 'react'
import { en } from '../copy/en'
import { photoFor } from '../data/sitePhotos'
import { PARTS, SITE_STORY } from '../data/story'
import type { Site } from '../domain/types'
import { useGame } from '../state/useGameStore'
import { ItemIcon } from './ItemIcon'
import { MiniGameModal } from './MiniGameModal'
import { SitePhotoFigure } from './SitePhotoFigure'
import { UnlockReveal } from './UnlockReveal'

type View = 'sheet' | 'game' | 'reward'

export function CheckInSheet({ site, onClose }: { site: Site; onClose: () => void }) {
  const collectedIds = useGame((s) => s.checkedInSiteIds)
  const checkIn = useGame((s) => s.checkIn)
  const [view, setView] = useState<View>('sheet')
  const collected = collectedIds.includes(site.id)
  const story = SITE_STORY[site.id]
  const photo = collected ? photoFor(site.id) : null

  if (view === 'game') {
    return (
      <MiniGameModal
        site={site}
        onClose={() => setView('sheet')}
        onWin={() => {
          checkIn(site.id)
          setView('reward')
        }}
      />
    )
  }
  if (view === 'reward') return <UnlockReveal site={site} onClose={onClose} />

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
        {photo && <SitePhotoFigure photo={photo} className="sheet-photo" />}
        <p className="sheet-kicker">{site.priority ? 'Landmark' : 'Harbor stop'}</p>
        <h2 id="sheet-title">{site.name}</h2>
        <p className="sheet-blurb">{site.blurb}</p>
        <ul className="sheet-facts">
          {site.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        {!collected && <p className="sheet-ask">{story.ask}</p>}
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
            <span className="badge-done badge-part">
              <ItemIcon id={story.part} size={22} /> {PARTS[story.part].name} earned
            </span>
          ) : (
            <button className="btn btn-primary" onClick={() => setView('game')}>
              Help out: {story.gameTitle}
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
