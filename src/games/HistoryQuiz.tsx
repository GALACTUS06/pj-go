import { useState } from 'react'
import { shuffle, type GameProps } from './common'

const QUESTIONS = [
  {
    q: 'Before 1836, Port Jefferson was known as…',
    a: 'Drowned Meadow',
    wrong: ['Setauket Landing', 'Bridgeport East', 'Mount Sinai Harbor'],
    note: 'The tidal flats flooded at high water — hence “Drowned Meadow.”',
  },
  {
    q: 'The village was renamed in honor of…',
    a: 'Thomas Jefferson',
    wrong: ['A local sea captain', 'The first ferry', 'Jefferson County'],
    note: 'In 1836 the village took the name of the third U.S. president.',
  },
  {
    q: 'In the 1800s the harbor was best known for…',
    a: 'Shipbuilding',
    wrong: ['Gold mining', 'Silk weaving', 'Glassblowing'],
    note: 'Shipyards along this shore built sailing vessels for more than a century.',
  },
  {
    q: 'The ferry from Port Jefferson crosses Long Island Sound to…',
    a: 'Bridgeport, Connecticut',
    wrong: ['New London, Connecticut', 'Providence, Rhode Island', 'Montauk, New York'],
    note: 'The Bridgeport & Port Jefferson ferry has run since the 1880s.',
  },
]
const PASS = 3

/** Historical Society Museum: four questions on the village's story; three right to pass. */
export function HistoryQuiz({ onWin, onLose }: GameProps) {
  const [order] = useState(() => QUESTIONS.map((q) => ({ ...q, options: shuffle([q.a, ...q.wrong]) })))
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const q = order[i]

  const pick = (opt: string) => {
    if (picked) return
    setPicked(opt)
    if (opt === q.a) setScore((s) => s + 1)
  }
  const next = () => {
    if (i + 1 < order.length) {
      setI(i + 1)
      setPicked(null)
    } else if (score >= PASS) {
      onWin()
    } else {
      onLose()
    }
  }

  return (
    <div className="mg">
      <div className="mg-score">
        <span>Question {i + 1}/{order.length}</span>
        <span>Correct {score} (need {PASS})</span>
      </div>
      <p className="quiz-q">{q.q}</p>
      <div className="quiz-options">
        {q.options.map((opt) => (
          <button
            key={opt}
            className={`quiz-opt${picked && opt === q.a ? ' is-right' : ''}${picked === opt && opt !== q.a ? ' is-wrong' : ''}`}
            onClick={() => pick(opt)}
            disabled={picked !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="mg-feedback" aria-live="polite">
        {picked ? `${picked === q.a ? 'Right!' : 'Not quite.'} ${q.note}` : '\u00a0'}
      </p>
      <button className="btn btn-primary btn-lg" onClick={next} disabled={!picked}>
        {i + 1 < order.length ? 'Next question' : 'Finish'}
      </button>
    </div>
  )
}
