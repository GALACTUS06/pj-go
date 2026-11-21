import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckInSheet } from '../components/CheckInSheet'
import { en } from '../copy/en'
import { SITES, TOTAL_PIECES } from '../data/checkpoints'
import { canCheckIn } from '../domain/checkIn'
import { distM } from '../domain/geo'
import { gps, player, teleport, useHud } from '../state/runtime'
import { useGame } from '../state/useGameStore'

/** 2D path used when WebGL is unavailable: same check-in and puzzle, no 3D. */
export function FallbackSitesPage({ reason }: { reason?: 'webgl' }) {
  const mode = useGame((s) => s.modePreference)
  const collected = useGame((s) => s.checkedInSiteIds)
  const hud = useHud()
  const [, tick] = useState(0)
  const [sheetId, setSheetId] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const live = mode === 'live'
  const here = live ? gps.target : { x: player.x, z: player.z }
  const rows = [...SITES].sort((a, b) => a.puzzleSlot - b.puzzleSlot)
  const sheetSite = SITES.find((s) => s.id === sheetId)

  return (
    <div className="page fallback">
      <header className="page-head">
        <Link to="/" className="btn btn-ghost btn-small">
          {en.play.exit}
        </Link>
        <Link to="/puzzle" className="chip chip-strong">
          {en.play.pieces(collected.length, TOTAL_PIECES)}
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
          const d = here ? distM(here.x, here.z, s.x, s.z) : null
          const inRange =
            here != null &&
            canCheckIn({
              avatarX: here.x,
              avatarZ: here.z,
              siteX: s.x,
              siteZ: s.z,
              radiusM: s.radiusM,
              accuracyM: live ? hud.gpsAccuracy : null,
              liveOutsideBox: live && hud.outsideBox,
            })
          return (
            <li key={s.id} className={done ? 'is-done' : ''}>
              <span className="site-slot">{s.puzzleSlot + 1}</span>
              <span className="site-name">
                {s.name}
                <small>
                  {inRange ? en.fallback.here : d != null ? en.fallback.distance(d) : en.play.gpsWaiting}
                </small>
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
      </ul>
      {sheetSite && <CheckInSheet site={sheetSite} onClose={() => setSheetId(null)} />}
    </div>
  )
}
