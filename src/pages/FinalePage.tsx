import { Link, Navigate } from 'react-router-dom'
import { ASSETS } from '../config/assets'
import { en } from '../copy/en'
import { FINALE, TOTAL_PIECES } from '../data/checkpoints'
import { useGame } from '../state/useGameStore'

export function FinalePage() {
  const pieces = useGame((s) => s.puzzlePieceIds.length)
  if (pieces < TOTAL_PIECES) return <Navigate to="/puzzle" replace />
  return (
    <div className="finale">
      <img className="finale-img" src={ASSETS.finale} alt="The Port Jefferson ferry on the harbor" />
      <div className="finale-copy">
        <p className="finale-kicker">9 / 9</p>
        <h1>{FINALE.title}</h1>
        <p className="finale-sub">{FINALE.subtitle}</p>
        <p className="finale-line">{FINALE.closingLine}</p>
        <div className="page-actions">
          <Link to="/puzzle" className="btn btn-outline-light btn-lg">
            {en.finale.backPuzzle}
          </Link>
          <Link to="/play" className="btn btn-primary btn-lg">
            {en.finale.keepExploring}
          </Link>
        </div>
        <p className="finale-credit">{en.credits.ferry}</p>
      </div>
    </div>
  )
}
