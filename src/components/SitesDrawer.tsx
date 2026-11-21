import { en } from '../copy/en'
import { SITES } from '../data/checkpoints'
import { distM } from '../domain/geo'
import { player } from '../state/runtime'
import { useGame } from '../state/useGameStore'

/** List of all 9 sites; Go sets the navigation beacon. */
export function SitesDrawer({ onClose }: { onClose: () => void }) {
  const collected = useGame((s) => s.checkedInSiteIds)
  const beacon = useGame((s) => s.navBeaconSiteId)
  const setBeacon = useGame((s) => s.setBeacon)
  const rows = [...SITES].sort((a, b) => a.puzzleSlot - b.puzzleSlot)
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet drawer" onClick={(e) => e.stopPropagation()} aria-label={en.play.sitesDrawer}>
        <div className="sheet-handle" />
        <h2>{en.play.sitesDrawer}</h2>
        <ul className="site-list">
          {rows.map((s) => {
            const done = collected.includes(s.id)
            return (
              <li key={s.id} className={done ? 'is-done' : ''}>
                <span className="site-slot">{s.puzzleSlot + 1}</span>
                <span className="site-name">
                  {s.name}
                  <small>{Math.round(distM(player.x, player.z, s.x, s.z))} m</small>
                </span>
                {done ? (
                  <span className="badge-done">✓ {en.play.collected}</span>
                ) : (
                  <button
                    className={`btn btn-small ${beacon === s.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => {
                      setBeacon(beacon === s.id ? null : s.id)
                      onClose()
                    }}
                  >
                    {en.play.go}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
