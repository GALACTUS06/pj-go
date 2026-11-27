import { useState } from 'react'
import { shuffle, useAfter, type GameProps } from './common'

const EVENTS = [
  { when: 'Colonial era', what: 'Settlers call the harbor’s tide-flooded flats “Drowned Meadow.”' },
  { when: '1836', what: 'The village takes the name Port Jefferson.' },
  { when: '1883', what: 'The Bridgeport & Port Jefferson ferry company is founded.' },
  { when: '1963', what: 'Port Jefferson incorporates as a village.' },
]
const MAX_MISTAKES = 2

/** Drowned Meadow Cottage: tap the village's milestones from earliest to latest. */
export function MeadowTimeline({ onWin, onLose }: GameProps) {
  const [cards] = useState(() => shuffle(EVENTS.map((e, order) => ({ ...e, order }))))
  const [placed, setPlaced] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<number | null>(null)
  const won = placed === EVENTS.length
  const lost = mistakes >= MAX_MISTAKES

  useAfter(shake !== null, 450, () => setShake(null))
  useAfter(won, 700, onWin)
  useAfter(lost, 600, onLose)

  const tap = (order: number) => {
    if (won || lost || order < placed) return
    if (order === placed) setPlaced(placed + 1)
    else {
      setMistakes((m) => m + 1)
      setShake(order)
    }
  }

  return (
    <div className="mg">
      <div className="mg-score">
        <span>In order {placed}/{EVENTS.length}</span>
        <span>Mistakes {mistakes}/{MAX_MISTAKES}</span>
      </div>
      <ol className="timeline-done">
        {EVENTS.slice(0, placed).map((e) => (
          <li key={e.when}>
            <strong>{e.when}</strong> {e.what}
          </li>
        ))}
      </ol>
      <div className="timeline-cards">
        {cards
          .filter((c) => c.order >= placed)
          .map((c) => (
            <button key={c.when} className={`timeline-card${shake === c.order ? ' is-wrong' : ''}`} onClick={() => tap(c.order)}>
              {c.what}
            </button>
          ))}
      </div>
      <p className="muted mg-hint">Tap the earliest event first.</p>
    </div>
  )
}
