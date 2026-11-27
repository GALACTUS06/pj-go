import { useRef, useState } from 'react'
import { useAfter, useFrameLoop, useKeys, type GameProps } from './common'

const PLANKS = 3
const MAX_SCORCH = 2
const BEND_S = 2
const SCORCH = 96
const HEAT_RATE = 38
const COOL_RATE = 24
/** Green band per plank: it narrows as you go. */
const BANDS: [number, number][] = [
  [58, 80],
  [62, 78],
  [65, 76],
]

/** Bayles Shipyard: hold the steam box in the green band until each plank bends. */
export function SteamBend({ onWin, onLose }: GameProps) {
  const sim = useRef({ temp: 25, bend: 0, heating: false })
  const [view, setView] = useState({ temp: 25, bend: 0 })
  const [plank, setPlank] = useState(0)
  const [scorched, setScorched] = useState(0)
  const [note, setNote] = useState('')
  const done = plank >= PLANKS || scorched >= MAX_SCORCH
  const band = BANDS[Math.min(plank, PLANKS - 1)]

  useFrameLoop((dt) => {
    const s = sim.current
    s.temp = Math.max(15, Math.min(100, s.temp + (s.heating ? HEAT_RATE : -COOL_RATE) * dt))
    if (s.temp >= SCORCH) {
      s.temp = 30
      s.bend = 0
      setScorched((n) => n + 1)
      setNote('Scorched! Fresh plank.')
    } else if (s.temp >= band[0] && s.temp <= band[1]) {
      s.bend += dt
      if (s.bend >= BEND_S) {
        s.bend = 0
        s.temp = 30
        setPlank((n) => n + 1)
        setNote('It bends! Next plank.')
      }
    }
    setView({ temp: s.temp, bend: s.bend })
  }, !done)

  useAfter(plank >= PLANKS, 400, onWin)
  useAfter(scorched >= MAX_SCORCH, 500, onLose)

  const heat = (on: boolean) => () => (sim.current.heating = on)
  useKeys({ ' ': heat(true), enter: heat(true) }, { ' ': heat(false), enter: heat(false) })

  const curve = 4 + (view.bend / BEND_S) * 36
  return (
    <div className="mg">
      <div className="mg-score">
        <span>Planks {plank}/{PLANKS}</span>
        <span>Scorched {scorched}/{MAX_SCORCH}</span>
      </div>
      <div className="steam-stage">
        <div className="steam-gauge" aria-label={`Temperature ${Math.round(view.temp)}`}>
          <div className="steam-band" style={{ bottom: `${band[0]}%`, height: `${band[1] - band[0]}%` }} />
          <div className="steam-hot" style={{ bottom: `${SCORCH}%` }} />
          <div className="steam-needle" style={{ bottom: `${view.temp}%` }} />
        </div>
        <svg viewBox="0 0 200 80" className="steam-plank" aria-hidden>
          <path d={`M10 30 Q100 ${30 + curve} 190 30`} fill="none" stroke="#8a5a2b" strokeWidth="14" strokeLinecap="round" />
          <path d={`M10 30 Q100 ${30 + curve} 190 30`} fill="none" stroke="#c48b52" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mg-feedback" aria-live="polite">{note || '\u00a0'}</p>
      <button
        className="btn btn-primary btn-lg"
        disabled={done}
        onPointerDown={heat(true)}
        onPointerUp={heat(false)}
        onPointerLeave={heat(false)}
        onPointerCancel={heat(false)}
      >
        Hold to heat
      </button>
    </div>
  )
}
