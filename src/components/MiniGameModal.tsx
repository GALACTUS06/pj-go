import { useState } from 'react'
import { PARTS, SITE_STORY } from '../data/story'
import type { Site } from '../domain/types'
import { GAMES } from '../games'
import { ItemIcon } from './ItemIcon'

type Phase = 'intro' | 'play' | 'lost'

/** Wraps a site's mini game: intro → play → (lost → retry / skip). Winning or skipping calls onWin. */
export function MiniGameModal({ site, onWin, onClose }: { site: Site; onWin: () => void; onClose: () => void }) {
  const story = SITE_STORY[site.id]
  const game = GAMES[story.game]
  const [phase, setPhase] = useState<Phase>('intro')
  const [attempt, setAttempt] = useState(0)
  const [losses, setLosses] = useState(0)

  return (
    <div className="unlock-backdrop">
      <section className="unlock mg-modal" role="dialog" aria-modal="true" aria-labelledby="mg-title">
        <header className="mg-head">
          <p className="unlock-kicker">{site.name}</p>
          <button className="btn btn-ghost btn-small mg-close" onClick={onClose} aria-label="Leave the game">
            ✕
          </button>
        </header>
        <h2 id="mg-title">{story.gameTitle}</h2>

        {phase === 'intro' && (
          <>
            <p className="mg-ask">{story.ask}</p>
            <div className="mg-reward-preview">
              <ItemIcon id={story.part} size={36} />
              <span>
                Reward: <strong>{PARTS[story.part].name}</strong>
              </span>
            </div>
            <p className="muted">{game.howTo}</p>
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={() => setPhase('play')}>
                Start
              </button>
            </div>
          </>
        )}

        {phase === 'play' && (
          <game.Component
            key={attempt}
            onWin={onWin}
            onLose={() => {
              setLosses((n) => n + 1)
              setPhase('lost')
            }}
          />
        )}

        {phase === 'lost' && (
          <>
            <p className="mg-ask">Not this time. Have another go?</p>
            <p className="muted">{game.howTo}</p>
            <div className="sheet-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAttempt((a) => a + 1)
                  setPhase('play')
                }}
              >
                Try again
              </button>
              {losses >= 1 && (
                <button className="btn btn-ghost" onClick={onWin}>
                  Skip — take the part
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
