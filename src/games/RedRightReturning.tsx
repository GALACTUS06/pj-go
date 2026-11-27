import { useEffect, useRef, useState } from 'react'
import { useAfter, useFrameLoop, type GameProps } from './common'

const BUOYS = 6
const PASS = 5
const TIME_S = 5

type Buoy = { red: boolean; num: number }

function makeBuoys(): Buoy[] {
  return Array.from({ length: BUOYS }, (_, i) => {
    const red = Math.random() < 0.5
    // Red nuns carry even numbers, green cans odd ones.
    const num = (i + 1) * 2 + (red ? 0 : 1)
    return { red, num }
  })
}

/** Harbor Overlook: bring a boat in from the Sound — keep red buoys on your right. */
export function RedRightReturning({ onWin, onLose }: GameProps) {
  const [buoys] = useState(makeBuoys)
  const [i, setI] = useState(0)
  const [right, setRight] = useState(0)
  const [time, setTime] = useState(TIME_S)
  const [last, setLast] = useState<boolean | null>(null)
  const finished = i >= BUOYS

  const clock = useRef(TIME_S)
  useEffect(() => {
    clock.current = TIME_S
    setTime(TIME_S)
  }, [i])
  useFrameLoop((dt) => {
    clock.current = Math.max(0, clock.current - dt)
    setTime(clock.current)
    if (clock.current === 0) answer(null)
  }, !finished && last === null)

  useAfter(last !== null, 700, () => {
    setLast(null)
    setI((n) => n + 1)
  })
  useAfter(finished, 300, () => (right >= PASS ? onWin() : onLose()))

  function answer(keepOnRight: boolean | null) {
    if (finished || last !== null) return
    const ok = keepOnRight !== null && keepOnRight === buoys[i].red
    if (ok) setRight((r) => r + 1)
    setLast(ok)
  }

  const b = buoys[Math.min(i, BUOYS - 1)]
  return (
    <div className="mg">
      <div className="mg-score">
        <span>Buoy {Math.min(i + 1, BUOYS)}/{BUOYS}</span>
        <span>Safe passes {right} (need {PASS})</span>
      </div>
      <div className="mg-progress">
        <span style={{ width: `${(time / TIME_S) * 100}%` }} />
      </div>
      <div className={`rr-channel${last === true ? ' is-ok' : last === false ? ' is-miss' : ''}`}>
        <svg viewBox="0 0 200 140" aria-hidden>
          <rect width="200" height="140" fill="#2f6f8f" />
          <g transform="translate(100 50)">
            {b.red ? (
              <path d="M-12 18 L0 -18 L12 18 Z" fill="#c8102e" stroke="#fff" strokeWidth="2" />
            ) : (
              <rect x="-11" y="-16" width="22" height="34" fill="#2e8b57" stroke="#fff" strokeWidth="2" />
            )}
            <text y="12" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
              {b.num}
            </text>
          </g>
          <g transform="translate(100 118)">
            <path d="M0 -16 L9 6 L0 2 L-9 6 Z" fill="#f4f6f8" stroke="#0b1f33" strokeWidth="1.5" />
          </g>
          <text x="100" y="136" textAnchor="middle" fontSize="8" fill="#dbe7ef">
            heading into the harbor
          </text>
        </svg>
      </div>
      <p className="mg-feedback" aria-live="polite">
        {last === true ? 'Safe!' : last === false ? (b.red ? 'Red stays on your right.' : 'Green stays on your left.') : '\u00a0'}
      </p>
      <div className="mg-pair">
        <button className="btn btn-outline btn-lg" onClick={() => answer(false)} disabled={finished || last !== null}>
          Keep it on my left
        </button>
        <button className="btn btn-outline btn-lg" onClick={() => answer(true)} disabled={finished || last !== null}>
          Keep it on my right
        </button>
      </div>
    </div>
  )
}
