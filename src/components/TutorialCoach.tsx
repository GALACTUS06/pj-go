import { useState } from 'react'
import { en } from '../copy/en'
import type { PlayMode } from '../domain/types'
import { useGame } from '../state/useGameStore'

export function TutorialCoach({ mode }: { mode: PlayMode }) {
  const done = useGame((s) => s.tutorialDone)
  const storySeen = useGame((s) => s.storySeen)
  const complete = useGame((s) => s.completeTutorial)
  const [step, setStep] = useState(0)
  if (done || !storySeen) return null
  const steps = mode === 'live' ? en.tutorial.liveSteps : en.tutorial.steps
  const s = steps[step]
  const last = step === steps.length - 1
  return (
    <div className={`coach coach-step-${step}`} role="dialog" aria-label="Tutorial">
      <div className="coach-card">
        <p className="coach-count">
          {step + 1} / {steps.length}
        </p>
        <h3>{s.title}</h3>
        <p>{s.body}</p>
        <div className="coach-actions">
          <button className="btn btn-ghost" onClick={complete}>
            {en.tutorial.skip}
          </button>
          <button className="btn btn-primary" onClick={() => (last ? complete() : setStep(step + 1))}>
            {last ? en.tutorial.done : en.tutorial.next}
          </button>
        </div>
      </div>
    </div>
  )
}
