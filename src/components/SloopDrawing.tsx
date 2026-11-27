import type { PartId } from '../data/story'

/** Side view of the sloop; parts not yet earned are drawn as dashed outlines. */
const LAYERS: Record<PartId, (on: boolean) => JSX.Element> = {
  keel: (on) => <path d="M72 168 H248 L238 177 H82 Z" fill={on ? '#5c3b1e' : 'none'} />,
  frames: (on) => (
    <g fill="none" strokeWidth={on ? 4 : 2} stroke={on ? '#8a5a2b' : undefined}>
      {[96, 124, 152, 180, 208, 232].map((x) => (
        <path key={x} d={`M${x - 14} 122 Q${x} 170 ${x + 4} 168`} />
      ))}
    </g>
  ),
  planks: (on) => (
    <g>
      <path d="M50 120 H272 L250 168 H72 Z" fill={on ? '#b07a43' : 'none'} />
      {on && (
        <g stroke="#8a5a2b" strokeWidth="1.5" fill="none">
          <path d="M56 134 H266 M62 148 H260 M68 160 H254" />
        </g>
      )}
    </g>
  ),
  rudder: (on) => <path d="M54 124 L42 172 H58 L64 124 Z" fill={on ? '#6b4423' : 'none'} />,
  rigging: (on) => (
    <g fill="none" strokeWidth={on ? 4 : 2} stroke={on ? '#3b2a1a' : undefined}>
      <path d="M170 120 V18" />
      <path d="M170 22 L268 118 M170 22 L58 118" strokeWidth={on ? 1.5 : 1} />
    </g>
  ),
  sail: (on) => (
    <g fill={on ? '#f4efe2' : 'none'}>
      <path d="M165 26 C134 50 116 78 112 100 H165 Z" />
      <path d="M175 32 L248 100 H175 Z" />
    </g>
  ),
  anchor: (on) => (
    <g fill="none" strokeWidth="2.5" stroke={on ? '#3b4a57' : undefined}>
      <path d="M262 124 V146 M254 140 C256 148 268 148 270 140 M257 130 H267" />
    </g>
  ),
  compass: (on) => (
    <g>
      <circle cx="132" cy="112" r="6" fill={on ? '#f0b429' : 'none'} />
      {on && <path d="M132 107 L134.5 112 L132 117 L129.5 112 Z" fill="#0b1f33" />}
    </g>
  ),
  provisions: (on) => (
    <g fill={on ? '#8a5a2b' : 'none'}>
      <rect x="196" y="106" width="11" height="14" rx="3" />
      <rect x="210" y="106" width="11" height="14" rx="3" />
    </g>
  ),
}

const ORDER: PartId[] = ['keel', 'frames', 'planks', 'rudder', 'rigging', 'sail', 'compass', 'provisions', 'anchor']

export function SloopDrawing({ have, sailing = false }: { have: PartId[]; sailing?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className={`sloop${sailing ? ' is-sailing' : ''}`} role="img" aria-label="Your sloop">
      <path d="M0 172 Q40 166 80 172 T160 172 T240 172 T320 172 V200 H0 Z" fill="#2f6f8f" />
      <g className="sloop-hull">
        {ORDER.map((id) => {
          const on = have.includes(id)
          return (
            <g
              key={id}
              className={on ? 'sloop-part is-on' : 'sloop-part'}
              stroke={on ? '#0b1f33' : '#7f95a8'}
              strokeWidth={on ? 1.5 : 1.5}
              strokeDasharray={on ? undefined : '4 3'}
            >
              {LAYERS[id](on)}
            </g>
          )
        })}
      </g>
      <path d="M0 180 Q40 174 80 180 T160 180 T240 180 T320 180 V200 H0 Z" fill="#2f6f8f" opacity="0.7" />
    </svg>
  )
}
