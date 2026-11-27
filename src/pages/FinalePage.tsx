import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { SloopDrawing } from '../components/SloopDrawing'
import { ASSETS } from '../config/assets'
import { en } from '../copy/en'
import { PART_ORDER, STORY, TOTAL_ITEMS } from '../data/story'
import { useGame } from '../state/useGameStore'

export function FinalePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const count = useGame((s) => s.checkedInSiteIds.length + s.toolIds.length)
  const launched = useGame((s) => s.finaleRevealed)
  if (count < TOTAL_ITEMS || !launched) return <Navigate to="/shipyard" replace />
  return (
    <div className="finale">
      <div className="finale-sea">
        <SloopDrawing have={PART_ORDER} sailing />
      </div>
      <div className="finale-copy">
        <p className="finale-kicker">THE END</p>
        <h1>{STORY.finaleTitle}</h1>
        <p className="finale-body">{STORY.finaleBody}</p>
        <figure className="finale-ferry">
          <img src={ASSETS.finale} alt="The Bridgeport ferry at Port Jefferson" />
          <figcaption>The ferry that brought you here, still crossing the Sound.</figcaption>
        </figure>
        <p className="finale-line">{STORY.finaleLine}</p>
        <div className="page-actions">
          <Link to="/play" className="btn btn-primary btn-lg">
            {en.finale.keepExploring}
          </Link>
          <Link to="/" className="btn btn-outline-light btn-lg">
            Home
          </Link>
        </div>
        <p className="finale-credit">{en.credits.ferry}</p>
      </div>
    </div>
  )
}
