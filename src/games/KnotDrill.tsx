import { useEffect, useState } from 'react'
import { useAfter, type GameProps } from './common'

const KNOTS = [
  { name: 'Bowline', color: '#c8102e' },
  { name: 'Cleat hitch', color: '#2f6f8f' },
  { name: 'Clove hitch', color: '#f0b429' },
  { name: 'Figure-eight', color: '#5b8c5a' },
]
const ROUNDS = [3, 4, 5]
const SHOW_MS = 650

/** Village Center: repeat the instructor's knots in order (three rounds). */
export function KnotDrill({ onWin, onLose }: GameProps) {
  const [seq] = useState(() => Array.from({ length: ROUNDS[ROUNDS.length - 1] }, () => Math.floor(Math.random() * 4)))
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'show' | 'input' | 'won' | 'lost'>('show')
  const [lit, setLit] = useState<number | null>(null)
  const [pos, setPos] = useState(0)
  const len = ROUNDS[Math.min(round, ROUNDS.length - 1)]

  useEffect(() => {
    if (phase !== 'show') return
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const next = () => {
      if (i >= len) {
        setLit(null)
        setPos(0)
        setPhase('input')
        return
      }
      setLit(seq[i])
      t = setTimeout(() => {
        setLit(null)
        i++
        t = setTimeout(next, 200)
      }, SHOW_MS)
    }
    t = setTimeout(next, 500)
    return () => clearTimeout(t)
  }, [phase, len, seq])

  useAfter(phase === 'won', 400, onWin)
  useAfter(phase === 'lost', 700, onLose)

  const press = (k: number) => {
    if (phase !== 'input') return
    if (k !== seq[pos]) {
      setLit(k)
      setPhase('lost')
      return
    }
    if (pos + 1 < len) {
      setPos(pos + 1)
    } else if (round + 1 < ROUNDS.length) {
      setRound(round + 1)
      setPhase('show')
    } else {
      setPhase('won')
    }
  }

  return (
    <div className="mg">
      <div className="mg-score">
        <span>Round {Math.min(round + 1, ROUNDS.length)}/{ROUNDS.length}</span>
        <span>{phase === 'show' ? 'Watch…' : phase === 'input' ? `Your turn: ${pos}/${len}` : phase === 'lost' ? 'Wrong knot!' : 'Perfect!'}</span>
      </div>
      <div className="knot-grid">
        {KNOTS.map((k, i) => (
          <button
            key={k.name}
            className={`knot${lit === i ? ' is-lit' : ''}`}
            style={{ '--knot': k.color } as React.CSSProperties}
            onClick={() => press(i)}
            disabled={phase !== 'input'}
          >
            <svg viewBox="0 0 40 40" aria-hidden>
              <path d={KNOT_PATHS[i]} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
            {k.name}
          </button>
        ))}
      </div>
    </div>
  )
}

const KNOT_PATHS = [
  'M8 32 C8 10 32 10 30 22 C28 32 14 30 18 20 M30 22 L34 34',
  'M6 20 H34 M14 12 C26 12 26 28 14 28 M26 12 C14 12 14 28 26 28',
  'M6 14 H34 M6 26 H34 M14 6 C24 14 16 26 26 34',
  'M20 4 C34 10 6 30 20 36 C34 30 6 10 20 4',
]
