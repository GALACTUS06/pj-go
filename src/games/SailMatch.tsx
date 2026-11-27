import { useState } from 'react'
import { shuffle, useAfter, type GameProps } from './common'

const ITEMS = [
  { name: 'Sailcloth', glyph: '▤', color: '#e9dcc0' },
  { name: 'Needle', glyph: '⟋', color: '#cfd8e0' },
  { name: 'Palm', glyph: '✋', color: '#d9b48f' },
  { name: 'Beeswax', glyph: '⬢', color: '#f0c75e' },
  { name: 'Grommet', glyph: '◎', color: '#c9a66b' },
  { name: 'Twine', glyph: '∞', color: '#b9d3c2' },
]
const MAX_TURNS = 16

/** Main Street: memory match on a sailmaker's supplies within a turn limit. */
export function SailMatch({ onWin, onLose }: GameProps) {
  const [cards] = useState(() => shuffle([...ITEMS, ...ITEMS].map((it, i) => ({ ...it, key: i }))))
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [turns, setTurns] = useState(0)
  const won = matched.length === ITEMS.length
  const lost = !won && turns >= MAX_TURNS && open.length === 0

  useAfter(open.length === 2, 750, () => {
    const [a, b] = open
    if (cards[a].name === cards[b].name) setMatched((m) => [...m, cards[a].name])
    setOpen([])
  })
  useAfter(won, 500, onWin)
  useAfter(lost, 500, onLose)

  const flip = (i: number) => {
    if (won || lost || open.length === 2 || open.includes(i) || matched.includes(cards[i].name)) return
    const next = [...open, i]
    if (next.length === 2) setTurns((t) => t + 1)
    setOpen(next)
  }

  return (
    <div className="mg">
      <div className="mg-score">
        <span>Pairs {matched.length}/{ITEMS.length}</span>
        <span>Turns left {MAX_TURNS - turns}</span>
      </div>
      <div className="match-grid">
        {cards.map((c, i) => {
          const up = open.includes(i) || matched.includes(c.name)
          return (
            <button
              key={c.key}
              className={`match-card${up ? ' is-up' : ''}${matched.includes(c.name) ? ' is-matched' : ''}`}
              style={up ? { background: c.color } : undefined}
              onClick={() => flip(i)}
              aria-label={up ? c.name : 'Hidden card'}
            >
              {up ? (
                <>
                  <span className="match-glyph">{c.glyph}</span>
                  <span className="match-name">{c.name}</span>
                </>
              ) : (
                <span className="match-back">PJ</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
