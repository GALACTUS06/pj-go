import { en } from '../copy/en'
import { SITES } from '../data/checkpoints'
import { PARTS, SITE_STORY, TOOLS } from '../data/story'
import { distM } from '../domain/geo'
import { player } from '../state/runtime'
import { useGame } from '../state/useGameStore'
import { ItemIcon } from './ItemIcon'

/** All stops and tools; Go routes the blue line to one. */
export function SitesDrawer({ onClose }: { onClose: () => void }) {
  const collected = useGame((s) => s.checkedInSiteIds)
  const tools = useGame((s) => s.toolIds)
  const beacon = useGame((s) => s.navBeaconSiteId)
  const setBeacon = useGame((s) => s.setBeacon)
  const rows = [
    ...[...SITES]
      .sort((a, b) => a.puzzleSlot - b.puzzleSlot)
      .map((s) => ({ id: s.id, name: s.name, x: s.x, z: s.z, icon: SITE_STORY[s.id].part, sub: PARTS[SITE_STORY[s.id].part].name, done: collected.includes(s.id) })),
    ...TOOLS.map((t) => ({ id: t.id, name: t.name, x: t.x, z: t.z, icon: t.id, sub: 'Tool on the street', done: tools.includes(t.id) })),
  ]
  const go = (id: string) => {
    setBeacon(beacon === id ? null : id)
    onClose()
  }
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet drawer" onClick={(e) => e.stopPropagation()} aria-label={en.play.sitesDrawer}>
        <div className="sheet-handle" />
        <h2>{en.play.sitesDrawer}</h2>
        <ul className="site-list">
          {rows.map((r) => (
            <li key={r.id} className={r.done ? 'is-done' : ''}>
              <span className="site-slot">
                <ItemIcon id={r.icon} size={20} />
              </span>
              <span className="site-name">
                {r.name}
                <small>
                  {r.sub} · {Math.round(distM(player.x, player.z, r.x, r.z))} m
                </small>
              </span>
              {r.done ? (
                <span className="badge-done">✓</span>
              ) : (
                <button className={`btn btn-small ${beacon === r.id ? 'btn-primary' : 'btn-outline'}`} onClick={() => go(r.id)}>
                  {en.play.go}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
