import type { ComponentType } from 'react'
import type { GameId } from '../data/story'
import { CarryFrame } from './CarryFrame'
import { CatchProvisions } from './CatchProvisions'
import type { GameProps } from './common'
import { DockFerry } from './DockFerry'
import { HistoryQuiz } from './HistoryQuiz'
import { KnotDrill } from './KnotDrill'
import { MeadowTimeline } from './MeadowTimeline'
import { RedRightReturning } from './RedRightReturning'
import { SailMatch } from './SailMatch'
import { SteamBend } from './SteamBend'

export const GAMES: Record<GameId, { Component: ComponentType<GameProps>; howTo: string }> = {
  'dock-ferry': {
    Component: DockFerry,
    howTo: 'Tap “Throw the lines” when the whole ferry is inside the slip. Three dockings; three misses and you start over.',
  },
  'carry-frame': {
    Component: CarryFrame,
    howTo: 'Gusts tip the frame. Hold “Lift left” or “Lift right” to keep it level for 12 seconds.',
  },
  'steam-bend': {
    Component: SteamBend,
    howTo: 'Hold to heat the steam box; let go to cool. Keep the needle in the green band for 2 seconds per plank. Above the red line it scorches.',
  },
  'knot-drill': {
    Component: KnotDrill,
    howTo: 'Watch the knots light up, then tap them in the same order. Three rounds, each one longer.',
  },
  'history-quiz': {
    Component: HistoryQuiz,
    howTo: 'Four questions about Port Jefferson. Get three right.',
  },
  'sail-match': {
    Component: SailMatch,
    howTo: 'Flip two cards per turn to find matching sailmaker’s supplies. Match all six pairs in 16 turns.',
  },
  'catch-provisions': {
    Component: CatchProvisions,
    howTo: 'Move the basket between three lanes. Catch 10 provisions; missing food or catching a boot counts against you.',
  },
  'meadow-timeline': {
    Component: MeadowTimeline,
    howTo: 'Tap the four moments in the village’s history from earliest to latest.',
  },
  'red-right-returning': {
    Component: RedRightReturning,
    howTo: 'Coming in from the sea, keep red buoys on your right and green buoys on your left (“red right returning”). Five safe passes out of six.',
  },
}
