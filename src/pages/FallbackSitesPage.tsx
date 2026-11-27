import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckInSheet } from '../components/CheckInSheet'
import { ItemIcon } from '../components/ItemIcon'
import { ToolFound } from '../components/ToolFound'
import { en } from '../copy/en'
import { SITES } from '../data/checkpoints'
import { SITE_STORY, TOOLS, TOOL_PICKUP_M, TOTAL_ITEMS } from '../data/story'
import { canCheckIn } from '../domain/checkIn'
import { distM } from '../domain/geo'
import { gps, player, teleport, useHud } from '../state/runtime'
import { useGame } from '../state/useGameStore'

/** 2D path used when WebGL is unavailable: same stops, mini games, tools and shipyard, no 3D. */
export function FallbackSitesPage({ reason }: { reason?: 'webgl' }) {
  const mode = useGame((s) => s.modePreference)
  const collected = useGame((s) => s.checkedInSiteIds)
  const tools = useGame((s) => s.toolIds)
  const pickUpTool = useGame((s) => s.pickUpTool)
  const hud = useHud()
  const [, tick] = useState(0)
  const [sheetId, setSheetId] = useState<string | null>(null)
  const [foundId, setFoundId] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const live = mode === 'live'
  const here = live ? gps.target : { x: player.x, z: player.z }
  const rows = [...SITES].sort((a, b) => a.puzzleSlot - b.puzzleSlot)
  const sheetSite = SITES.find((s) => s.id === sheetId)
  const inRangeOf = (x: number, z: number, radiusM: number) =>
    here != null &&
    canCheckIn({
      avatarX: here.x,
      avatarZ: here.z,
      siteX: x,
      siteZ: z,
      radiusM,
      accuracyM: live ? hud.gpsAccuracy : null,
      liveOutsideBox: live && hud.outsideBox,
    })
  const where = (x: number, z: number, inRange: boolean) =>
    inRange ? en.fallback.here : here ? en.fallback.distance(distM(here.x, here.z, x, z)) : en.play.gpsWaiting

  return (
    <div className="page fallback">
      <header className="page-head">
        <Link to="/" className="btn btn-ghost btn-small">
          {en.play.exit}
        </Link>
        <Link to="/shipyard" className="chip chip-strong">
          {en.play.ship(collected.length + tools.length, TOTAL_ITEMS)}
        </Link>
      </header>
      {reason === 'webgl' && (
        <div className="notice">
          <strong>{en.play.webglFallbackTitle}</strong>
          <p>{en.play.webglFallbackBody}</p>
        </div>
      )}
      <h1>{en.fallback.title}</h1>
      <p className="muted">{en.fallback.hint}</p>
      {live && hud.outsideBox && <div className="banner">{en.play.outsideBox}</div>}
      <ul className="site-list">
        {rows.map((s) => {
          const done = collected.includes(s.id)
          const inRange = inRangeOf(s.x, s.z, s.radiusM)
          return (
            <li key={s.id} className={done ? 'is-done' : ''}>
              <span className="site-slot">
                <ItemIcon id={SITE_STORY[s.id].part} size={20} />
              </span>
              <span className="site-name">
                {s.name}
                <small>{where(s.x, s.z, inRange)}</small>
              </span>
              {inRange ? (
                <button className="btn btn-small btn-primary" onClick={() => setSheetId(s.id)}>
                  {done ? en.play.reopen : en.play.checkIn}
                </button>
              ) : !live ? (
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => {
                    teleport(s.x, s.z)
                    tick((n) => n + 1)
                  }}
                >
                  {en.play.go}
                </button>
              ) : done ? (
                <span className="badge-done">✓</span>
              ) : null}
            </li>
          )
        })}
        {TOOLS.map((t) => {
          const done = tools.includes(t.id)
          const inRange = inRangeOf(t.x, t.z, TOOL_PICKUP_M)
          return (
            <li key={t.id} className={done ? 'is-done' : ''}>
              <span className="site-slot">
                <ItemIcon id={t.id} size={20} />
              </span>
              <span className="site-name">
                {t.name}
                <small>{done ? 'In the toolbox' : where(t.x, t.z, inRange)}</small>
              </span>
              {done ? (
                <span className="badge-done">✓</span>
              ) : inRange ? (
                <button
                  className="btn btn-small btn-primary"
                  onClick={() => {
                    if (pickUpTool(t.id)) setFoundId(t.id)
                  }}
                >
                  Pick up
                </button>
              ) : !live ? (
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => {
                    teleport(t.x, t.z)
                    tick((n) => n + 1)
                  }}
                >
                  {en.play.go}
                </button>
              ) : null}
            </li>
          )
        })}
      </ul>
      {sheetSite && <CheckInSheet site={sheetSite} onClose={() => setSheetId(null)} />}
      {foundId && <ToolFound toolId={foundId} onClose={() => setFoundId(null)} />}
    </div>
  )
}
