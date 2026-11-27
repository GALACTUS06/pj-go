import { useRef, useState } from 'react'
import { useAfter, useFrameLoop, useKeys, type GameProps } from './common'

const GOAL_S = 12
const DROP_DEG = 35
const PUSH = 120

/** Shipbuilders Memorial: keep a hull frame level while carrying it to the water. */
export function CarryFrame({ onWin, onLose }: GameProps) {
  const [view, setView] = useState({ angle: 0, t: 0 })
  const sim = useRef({ angle: 0, vel: 0, t: 0, gust: 0, nextGust: 0.6, push: 0 })
  const [result, setResult] = useState<'win' | 'lose' | null>(null)

  useFrameLoop((dt) => {
    const s = sim.current
    s.t += dt
    s.nextGust -= dt
    if (s.nextGust <= 0) {
      const strength = 30 + s.t * 4
      s.gust = (Math.random() * 2 - 1) * strength
      s.nextGust = 0.5 + Math.random() * 0.6
    }
    s.vel += (s.angle * 1.1 + s.gust + s.push * PUSH) * dt
    s.vel *= 0.985
    s.angle += s.vel * dt
    if (Math.abs(s.angle) > DROP_DEG) setResult('lose')
    else if (s.t >= GOAL_S) setResult('win')
    setView({ angle: s.angle, t: s.t })
  }, result === null)

  useAfter(result === 'win', 400, onWin)
  useAfter(result === 'lose', 600, onLose)

  // Positive angle tips the right end down, so lifting the right end pushes negative.
  const LIFT_LEFT = 1
  const LIFT_RIGHT = -1
  const hold = (dir: number) => () => (sim.current.push = dir)
  const release = () => (sim.current.push = 0)
  useKeys(
    { a: hold(LIFT_LEFT), arrowleft: hold(LIFT_LEFT), d: hold(LIFT_RIGHT), arrowright: hold(LIFT_RIGHT) },
    { a: release, arrowleft: release, d: release, arrowright: release },
  )

  const danger = Math.abs(view.angle) / DROP_DEG
  const holdProps = (dir: number) => ({
    onPointerDown: hold(dir),
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
  })

  return (
    <div className="mg">
      <div className="mg-score">
        <span>To the water: {Math.max(0, GOAL_S - view.t).toFixed(1)} s</span>
        <span>{result === 'lose' ? 'Dropped!' : danger > 0.65 ? 'Careful!' : 'Steady'}</span>
      </div>
      <div className="mg-progress">
        <span style={{ width: `${Math.min(100, (view.t / GOAL_S) * 100)}%` }} />
      </div>
      <div className="frame-stage">
        <svg viewBox="-110 -60 220 120" className="frame-svg" aria-hidden>
          <g transform={`rotate(${view.angle})`}>
            <path d="M-95 0 Q0 70 95 0" fill="none" stroke="#8a5a2b" strokeWidth="10" strokeLinecap="round" />
            <path d="M-95 0 Q0 70 95 0" fill="none" stroke="#b07a43" strokeWidth="4" strokeLinecap="round" />
            {[-70, 0, 70].map((px) => (
              <g key={px} transform={`translate(${px} -14)`}>
                <circle r="7" cy="-14" fill="#5d4c3a" />
                <rect x="-6" y="-8" width="12" height="20" rx="4" fill="#5d4c3a" />
              </g>
            ))}
          </g>
          <line x1="-100" x2="100" y1="50" y2="50" stroke="#2f6f8f" strokeWidth="3" />
        </svg>
        <div className="frame-meter" style={{ background: danger > 0.65 ? '#c8102e' : '#5b8c5a', width: `${danger * 100}%` }} />
      </div>
      <div className="mg-pair">
        <button className="btn btn-outline btn-lg" {...holdProps(LIFT_LEFT)}>
          ◀ Lift left
        </button>
        <button className="btn btn-outline btn-lg" {...holdProps(LIFT_RIGHT)}>
          Lift right ▶
        </button>
      </div>
    </div>
  )
}
