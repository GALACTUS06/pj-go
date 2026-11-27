import { useState } from 'react'
import { STORY } from '../data/story'

const SCENES = [
  // Ferry pulling into the harbor.
  <g key="ferry">
    <path d="M30 70 H170 L160 84 H40 Z" fill="#f4f6f8" stroke="#0b1f33" strokeWidth="2" />
    <rect x="55" y="54" width="80" height="16" fill="#f4f6f8" stroke="#0b1f33" strokeWidth="2" />
    <rect x="80" y="44" width="30" height="10" fill="#c8102e" />
  </g>,
  // Hal on the dock.
  <g key="hal">
    <rect x="20" y="78" width="160" height="8" fill="#8a5a2b" />
    <circle cx="70" cy="44" r="10" fill="#f1d3b3" />
    <path d="M58 40 H82 L78 32 H62 Z" fill="#0b1f33" />
    <rect x="61" y="54" width="18" height="24" rx="5" fill="#2f6f8f" />
    <path d="M140 66 H190 L184 74 H146 Z" fill="#f4f6f8" opacity="0.6" />
  </g>,
  // Nine stops.
  <g key="stops">
    {Array.from({ length: 9 }, (_, i) => (
      <circle key={i} cx={30 + (i % 5) * 35 + (i >= 5 ? 17 : 0)} cy={i >= 5 ? 68 : 42} r="9" fill="#f0b429" stroke="#0b1f33" strokeWidth="2" />
    ))}
  </g>,
  // A sloop under sail.
  <g key="sloop">
    <path d="M50 72 H150 L138 86 H62 Z" fill="#8a5a2b" stroke="#0b1f33" strokeWidth="2" />
    <path d="M100 20 V72" stroke="#0b1f33" strokeWidth="3" />
    <path d="M103 24 C130 38 140 54 142 68 H103 Z" fill="#f4efe2" stroke="#0b1f33" strokeWidth="2" />
    <path d="M97 30 L70 68 H97 Z" fill="#f4efe2" stroke="#0b1f33" strokeWidth="2" />
  </g>,
]

/** First-time story intro: four panels, shown before the controls tutorial. */
export function StoryIntro({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0)
  const panel = STORY.intro[i]
  const last = i === STORY.intro.length - 1
  return (
    <div className="story" role="dialog" aria-modal="true" aria-labelledby="story-title">
      <div className="story-card">
        <svg className="story-art" viewBox="0 0 200 100" aria-hidden>
          <rect width="200" height="100" fill="#cfe3ef" />
          <path d="M0 80 Q50 74 100 80 T200 80 V100 H0 Z" fill="#2f6f8f" />
          {SCENES[i]}
        </svg>
        <p className="coach-count">
          {i + 1} / {STORY.intro.length}
        </p>
        <h2 id="story-title">{panel.title}</h2>
        <p>{panel.body}</p>
        <div className="coach-actions">
          {!last && (
            <button className="btn btn-ghost" onClick={onDone}>
              Skip
            </button>
          )}
          <button className="btn btn-primary" onClick={() => (last ? onDone() : setI(i + 1))}>
            {last ? 'Let’s go' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
