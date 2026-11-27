import type { PartId, ToolId } from '../data/story'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const ICONS: Record<PartId | ToolId, JSX.Element> = {
  anchor: (
    <g {...S}>
      <circle cx="24" cy="9" r="4" />
      <path d="M24 13 V41 M16 20 H32 M9 30 C10 38 17 41 24 41 C31 41 38 38 39 30 M9 30 L6 34 M39 30 L42 34" />
    </g>
  ),
  frames: (
    <g {...S}>
      <path d="M6 12 C8 34 40 34 42 12 M12 12 C14 28 34 28 36 12 M18 12 C19 22 29 22 30 12 M4 12 H44" />
    </g>
  ),
  planks: (
    <g {...S}>
      <path d="M4 16 Q24 22 44 16 M4 24 Q24 30 44 24 M4 32 Q24 38 44 32" />
    </g>
  ),
  rigging: (
    <g {...S}>
      <path d="M24 4 V44 M24 8 L8 40 M24 8 L40 40 M14 28 H34" />
    </g>
  ),
  rudder: (
    <g {...S}>
      <path d="M18 4 V44 M18 18 H34 C38 18 40 24 38 32 L34 44 H18" />
    </g>
  ),
  sail: (
    <g {...S}>
      <path d="M14 4 V44 M14 6 C30 14 38 26 40 38 H14 M8 44 H40" />
    </g>
  ),
  provisions: (
    <g {...S}>
      <path d="M14 8 H34 C38 16 38 32 34 40 H14 C10 32 10 16 14 8 Z M12 18 H36 M12 30 H36" />
    </g>
  ),
  keel: (
    <g {...S}>
      <path d="M4 20 H44 L40 28 H8 Z M10 20 V14 M38 20 V14" />
    </g>
  ),
  compass: (
    <g {...S}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 10 L29 24 L24 38 L19 24 Z" />
      <circle cx="24" cy="24" r="2" />
    </g>
  ),
  mallet: (
    <g {...S}>
      <rect x="8" y="8" width="22" height="12" rx="3" />
      <path d="M19 20 L36 42" />
    </g>
  ),
  saw: (
    <g {...S}>
      <path d="M6 30 L34 10 L42 18 L14 38 Z M10 34 L8 40 M16 30 L14 36 M22 26 L20 32 M28 22 L26 28" />
    </g>
  ),
  'caulking-iron': (
    <g {...S}>
      <path d="M8 40 L28 20 M28 20 L36 12 L42 18 L34 26 Z M26 22 L32 28" />
    </g>
  ),
}

export function ItemIcon({ id, size = 40 }: { id: PartId | ToolId; size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden className="item-icon">
      {ICONS[id]}
    </svg>
  )
}
