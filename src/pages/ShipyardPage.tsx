import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ItemIcon } from '../components/ItemIcon'
import { SloopDrawing } from '../components/SloopDrawing'
import { SITES } from '../data/checkpoints'
import { PARTS, PART_ORDER, SITE_STORY, STORY, TOOLS, TOTAL_ITEMS, type PartId } from '../data/story'
import { useGame } from '../state/useGameStore'

const siteForPart = (p: PartId) => SITES.find((s) => SITE_STORY[s.id].part === p)!

export function ShipyardPage() {
  const navigate = useNavigate()
  const doneSites = useGame((s) => s.checkedInSiteIds)
  const tools = useGame((s) => s.toolIds)
  const revealFinale = useGame((s) => s.revealFinale)
  const [phase, setPhase] = useState<'idle' | 'building' | 'built'>('idle')
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const have = PART_ORDER.filter((p) => doneSites.includes(siteForPart(p).id))
  const count = have.length + tools.length
  const ready = count >= TOTAL_ITEMS

  const build = () => {
    setPhase('building')
    document.querySelector('.shipyard-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setPhase('built'), 1800)
  }

  return (
    <div className="page shipyard">
      <header className="page-head">
        <Link to="/" className="btn btn-ghost btn-small">
          Home
        </Link>
        <span className="chip chip-strong">
          {count}/{TOTAL_ITEMS}
        </span>
      </header>
      <h1>{STORY.shipyardTitle}</h1>
      <p className="muted">{STORY.shipyardHint}</p>

      <div className={`shipyard-stage${phase === 'building' ? ' is-building' : ''}`}>
        <SloopDrawing have={have} />
      </div>

      <h2 className="shipyard-h">Parts</h2>
      <ul className="item-list">
        {PART_ORDER.map((p) => {
          const on = have.includes(p)
          return (
            <li key={p} className={on ? 'is-on' : ''}>
              <ItemIcon id={p} size={28} />
              <span className="item-name">
                {PARTS[p].name}
                <small>{on ? '✓ Fitted' : `Help out at ${siteForPart(p).name}`}</small>
              </span>
            </li>
          )
        })}
      </ul>

      <h2 className="shipyard-h">Tools</h2>
      <ul className="item-list">
        {TOOLS.map((t) => {
          const on = tools.includes(t.id)
          return (
            <li key={t.id} className={on ? 'is-on' : ''}>
              <ItemIcon id={t.id} size={28} />
              <span className="item-name">
                {t.name}
                <small>{on ? '✓ In the toolbox' : 'Somewhere on the streets — follow the blue line'}</small>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="page-actions">
        {phase === 'built' ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              revealFinale()
              navigate('/finale')
            }}
          >
            {STORY.launch}
          </button>
        ) : (
          <button className="btn btn-primary btn-lg" disabled={!ready || phase === 'building'} onClick={build}>
            {phase === 'building' ? STORY.building : STORY.build}
          </button>
        )}
        <Link to="/play" className="btn btn-outline btn-lg">
          Back to the harbor
        </Link>
      </div>
    </div>
  )
}
