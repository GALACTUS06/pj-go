import { useRef, useState } from 'react'
import { useAfter, useFrameLoop, useKeys, type GameProps } from './common'

const LANES = 3
const NEEDED = 10
const MAX_MISSES = 3
const GOOD = [
  { name: 'Clams', glyph: '🐚' },
  { name: 'Bread', glyph: '🍞' },
  { name: 'Apple', glyph: '🍎' },
  { name: 'Water', glyph: '💧' },
]
const BOOT = { name: 'Old boot', glyph: '👢' }

type Item = { id: number; lane: number; y: number; bad: boolean; glyph: string }

/** Waterfront Dining: catch the galley's provisions in three lanes; dodge the boots. */
export function CatchProvisions({ onWin, onLose }: GameProps) {
  const [items, setItems] = useState<Item[]>([])
  const [lane, setLane] = useState(1)
  const [caught, setCaught] = useState(0)
  const [misses, setMisses] = useState(0)
  const sim = useRef({ items: [] as Item[], spawn: 0.4, id: 0, t: 0, lane: 1 })
  const done = caught >= NEEDED || misses >= MAX_MISSES

  useFrameLoop((dt) => {
    const s = sim.current
    s.t += dt
    s.spawn -= dt
    const speed = 42 + s.t * 1.6
    if (s.spawn <= 0) {
      const bad = Math.random() < 0.22
      const g = bad ? BOOT : GOOD[Math.floor(Math.random() * GOOD.length)]
      s.items.push({ id: s.id++, lane: Math.floor(Math.random() * LANES), y: -10, bad, glyph: g.glyph })
      s.spawn = Math.max(0.55, 1.05 - s.t * 0.02)
    }
    let got = 0
    let missed = 0
    s.items = s.items.filter((it) => {
      it.y += speed * dt
      if (it.y >= 82 && it.y < 96 && it.lane === s.lane) {
        if (it.bad) missed++
        else got++
        return false
      }
      if (it.y >= 100) {
        if (!it.bad) missed++
        return false
      }
      return true
    })
    if (got) setCaught((c) => c + got)
    if (missed) setMisses((m) => m + missed)
    setItems([...s.items])
  }, !done)

  useAfter(caught >= NEEDED, 300, onWin)
  useAfter(misses >= MAX_MISSES, 500, onLose)

  const move = (to: number) => {
    const l = Math.max(0, Math.min(LANES - 1, to))
    sim.current.lane = l
    setLane(l)
  }
  useKeys({ a: () => move(sim.current.lane - 1), arrowleft: () => move(sim.current.lane - 1), d: () => move(sim.current.lane + 1), arrowright: () => move(sim.current.lane + 1) })

  return (
    <div className="mg">
      <div className="mg-score">
        <span>Caught {Math.min(caught, NEEDED)}/{NEEDED}</span>
        <span>Misses {misses}/{MAX_MISSES}</span>
      </div>
      <div className="catch-field">
        {Array.from({ length: LANES }, (_, l) => (
          <button key={l} className="catch-lane" onClick={() => move(l)} aria-label={`Lane ${l + 1}`} />
        ))}
        {items.map((it) => (
          <span key={it.id} className="catch-item" style={{ left: `${(it.lane + 0.5) * (100 / LANES)}%`, top: `${it.y}%` }}>
            {it.glyph}
          </span>
        ))}
        <span className="catch-basket" style={{ left: `${(lane + 0.5) * (100 / LANES)}%` }}>
          🧺
        </span>
      </div>
      <p className="muted mg-hint">Tap a lane to move the basket. Boots count as a miss.</p>
    </div>
  )
}
