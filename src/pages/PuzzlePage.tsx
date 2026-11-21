import { Link, useNavigate } from 'react-router-dom'
import { ASSETS } from '../config/assets'
import { en } from '../copy/en'
import { SITES, TOTAL_PIECES } from '../data/checkpoints'
import { useGame } from '../state/useGameStore'

export function PuzzlePage() {
  const navigate = useNavigate()
  const collected = useGame((s) => s.puzzlePieceIds)
  const revealFinale = useGame((s) => s.revealFinale)
  const complete = collected.length >= TOTAL_PIECES
  const slots = [...SITES].sort((a, b) => a.puzzleSlot - b.puzzleSlot)

  return (
    <div className="page puzzle">
      <header className="page-head">
        <Link to="/" className="btn btn-ghost btn-small">
          {en.puzzle.home}
        </Link>
        <span className="chip chip-strong">{en.puzzle.progress(collected.length, TOTAL_PIECES)}</span>
      </header>
      <h1>{en.puzzle.title}</h1>
      <p className="muted">{en.puzzle.hint}</p>

      <div className={`puzzle-grid${complete ? ' is-complete' : ''}`}>
        {slots.map((s) => {
          const on = collected.includes(s.id)
          const col = s.puzzleSlot % 3
          const row = Math.floor(s.puzzleSlot / 3)
          return (
            <div
              key={s.id}
              className={`puzzle-cell${on ? ' is-on' : ''}`}
              style={
                on
                  ? {
                      backgroundImage: `url(${ASSETS.finale})`,
                      backgroundPosition: `${col * 50}% ${row * 50}%`,
                    }
                  : undefined
              }
              title={s.name}
            >
              {!on && <span className="puzzle-num">{s.puzzleSlot + 1}</span>}
              <span className="puzzle-name">{s.name}</span>
            </div>
          )
        })}
      </div>

      <div className="page-actions">
        <button
          className="btn btn-primary btn-lg"
          disabled={!complete}
          onClick={() => {
            revealFinale()
            navigate('/finale')
          }}
        >
          {en.puzzle.reveal}
        </button>
        <Link to="/play" className="btn btn-outline btn-lg">
          {en.puzzle.backPlay}
        </Link>
      </div>
    </div>
  )
}
