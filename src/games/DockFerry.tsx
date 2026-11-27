import { useRef, useState } from 'react'
import { useAfter, useFrameLoop, useKeys, type GameProps } from './common'

const FERRY_W = 18
const SLIP = { left: 58, width: 26 }
const NEEDED = 3
const MAX_MISSES = 3

/** Ferry Terminal: stop the ferry inside the slip three times. */
export function DockFerry({ onWin, onLose }: GameProps) {
  const [x, setX] = useState(0)
  const [docked, setDocked] = useState(0)
  const [misses, setMisses] = useState(0)
  const [flash, setFlash] = useState<'ok' | 'miss' | null>(null)
  const motion = useRef({ x: 0, dir: 1, speed: 34 })
  const done = docked >= NEEDED || misses >= MAX_MISSES

  useFrameLoop((dt) => {
    const m = motion.current
    m.x += m.dir * m.speed * dt
    if (m.x > 100 - FERRY_W) {
      m.x = 100 - FERRY_W
      m.dir = -1
    } else if (m.x < 0) {
      m.x = 0
      m.dir = 1
    }
    setX(m.x)
  }, !done && flash === null)

  useAfter(flash !== null, 650, () => {
    setFlash(null)
    motion.current.x = 0
    motion.current.dir = 1
  })
  useAfter(docked >= NEEDED, 500, onWin)
  useAfter(misses >= MAX_MISSES, 500, onLose)

  const throwLines = () => {
    if (done || flash) return
    const m = motion.current
    if (m.x >= SLIP.left && m.x + FERRY_W <= SLIP.left + SLIP.width) {
      setDocked((n) => n + 1)
      m.speed *= 1.35
      setFlash('ok')
    } else {
      setMisses((n) => n + 1)
      setFlash('miss')
    }
  }
  useKeys({ ' ': throwLines, enter: throwLines })

  return (
    <div className="mg">
      <div className="mg-score">
        <span>Docked {docked}/{NEEDED}</span>
        <span>Misses {misses}/{MAX_MISSES}</span>
      </div>
      <div className={`dock-water${flash ? ` is-${flash}` : ''}`}>
        <div className="dock-slip" style={{ left: `${SLIP.left}%`, width: `${SLIP.width}%` }} />
        <svg className="dock-ferry" style={{ left: `${x}%`, width: `${FERRY_W}%` }} viewBox="0 0 60 30" aria-hidden>
          <path d="M2 18 H58 L52 28 H8 Z" fill="#f4f6f8" stroke="#0b1f33" strokeWidth="1.5" />
          <rect x="12" y="9" width="34" height="9" fill="#f4f6f8" stroke="#0b1f33" strokeWidth="1.5" />
          <rect x="20" y="3" width="16" height="6" fill="#c8102e" />
          {[16, 24, 32, 40].map((wx) => (
            <rect key={wx} x={wx} y="11" width="4" height="4" fill="#2f6f8f" />
          ))}
        </svg>
      </div>
      <p className="mg-feedback" aria-live="polite">
        {flash === 'ok' ? 'Lines on! Next one is faster.' : flash === 'miss' ? 'Missed the slip!' : '\u00a0'}
      </p>
      <button className="btn btn-primary btn-lg" onClick={throwLines} disabled={done}>
        Throw the lines
      </button>
    </div>
  )
}
