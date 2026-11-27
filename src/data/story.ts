import { latLngToLocal } from '../domain/geo'

/**
 * Story layer: a first-time visitor builds a sloop in Port Jefferson.
 * Hal and the people at each stop are fictional; the history in the
 * mini games and site sheets is real.
 */

export type PartId =
  | 'anchor'
  | 'frames'
  | 'planks'
  | 'rigging'
  | 'rudder'
  | 'sail'
  | 'provisions'
  | 'keel'
  | 'compass'

export type ToolId = 'mallet' | 'saw' | 'caulking-iron'

export type GameId =
  | 'dock-ferry'
  | 'carry-frame'
  | 'steam-bend'
  | 'knot-drill'
  | 'history-quiz'
  | 'sail-match'
  | 'catch-provisions'
  | 'meadow-timeline'
  | 'red-right-returning'

export type SiteStory = {
  part: PartId
  game: GameId
  gameTitle: string
  /** Who asks for help, and what they need — shown before the game. */
  ask: string
  /** Hal's line after the part is earned. */
  reward: string
}

export const PARTS: Record<PartId, { name: string; blurb: string }> = {
  keel: { name: 'Keel', blurb: 'The backbone timber every hull is built on.' },
  frames: { name: 'Frames', blurb: 'Curved ribs that give the hull its shape.' },
  planks: { name: 'Hull planks', blurb: 'Steam-bent planks fastened over the frames.' },
  rudder: { name: 'Rudder', blurb: 'Steers her, once she is moving.' },
  rigging: { name: 'Mast & rigging', blurb: 'A spruce mast and the lines that hold it up.' },
  sail: { name: 'Sail', blurb: 'Heavy canvas, hand-stitched.' },
  anchor: { name: 'Anchor', blurb: 'So she stays where you leave her.' },
  compass: { name: 'Compass', blurb: 'To find Connecticut in a fog.' },
  provisions: { name: 'Provisions', blurb: 'Chowder, bread and water for the crossing.' },
}

/** Order the parts are fitted on the Shipyard drawing. */
export const PART_ORDER: PartId[] = [
  'keel',
  'frames',
  'planks',
  'rudder',
  'rigging',
  'sail',
  'anchor',
  'compass',
  'provisions',
]

export const SITE_STORY: Record<string, SiteStory> = {
  'ferry-terminal': {
    part: 'anchor',
    game: 'dock-ferry',
    gameTitle: 'Dock the Ferry',
    ask: 'A deckhand is short a pair of hands: “Throw the lines when she’s square in the slip. Do it three times and that spare anchor is yours.”',
    reward: 'Hal: “An anchor before a hull. Backwards — but it’s a start.”',
  },
  'shipbuilders-memorial': {
    part: 'frames',
    game: 'carry-frame',
    gameTitle: 'Carry the Frame',
    ask: 'Like the bronze crew in the sculpture, a volunteer needs help carrying a curved hull frame to the water. Keep it level — don’t drop it.',
    reward: 'Hal: “That’s how this harbor did it for a hundred years — on shoulders.”',
  },
  'bayles-shipyard': {
    part: 'planks',
    game: 'steam-bend',
    gameTitle: 'Steam-Bend the Planks',
    ask: 'In the old mould loft a boatwright is steaming oak. Hold the heat in the green band until each plank bends — too hot and it scorches.',
    reward: 'Hal: “The Bayles yard built ships on this very shore. Planks from there are good luck.”',
  },
  'village-center': {
    part: 'rigging',
    game: 'knot-drill',
    gameTitle: 'Knot Drill',
    ask: 'A sailing instructor will part with a mast and a coil of line — if you can repeat her knots in order.',
    reward: 'Hal: “A mast and lines. Now she’ll stand up straight.”',
  },
  'historical-society': {
    part: 'rudder',
    game: 'history-quiz',
    gameTitle: 'Harbor History Quiz',
    ask: 'The museum keeps an old sloop rudder in the yard. The volunteer at the desk will lend it to anyone who knows the village’s story.',
    reward: 'Hal: “Know where you’ve been, and the rudder does the rest.”',
  },
  'main-street': {
    part: 'sail',
    game: 'sail-match',
    gameTitle: 'Sailmaker’s Match',
    ask: 'A shop on Main Street has a bolt of sailcloth, but the sailmaker’s supplies are all mixed up. Match the pairs before you run out of turns.',
    reward: 'Hal: “Canvas from Main Street. Every sail in this harbor started in a shop.”',
  },
  'harbourfront-dining': {
    part: 'provisions',
    game: 'catch-provisions',
    gameTitle: 'Catch the Provisions',
    ask: 'The galley is packing food for the crossing. Catch what they toss to you — but not the old boots.',
    reward: 'Hal: “Chowder for the Sound. Nobody crosses hungry.”',
  },
  'drowned-meadow': {
    part: 'keel',
    game: 'meadow-timeline',
    gameTitle: 'Meadow Timeline',
    ask: 'Behind the cottage lies an old oak keel timber. The keeper will give it up if you can put the village’s history in order.',
    reward: 'Hal: “A keel from Drowned Meadow. She’ll know where she was born.”',
  },
  'harbor-overlook': {
    part: 'compass',
    game: 'red-right-returning',
    gameTitle: 'Red Right Returning',
    ask: 'An old harbor pilot is watching the channel. Show him you can bring a boat in safely and he’ll hand you his compass.',
    reward: 'Hal: “Red right returning. Remember it on the way back.”',
  },
}

export type Tool = { id: ToolId; name: string; blurb: string; lat: number; lng: number; x: number; z: number }

/** Tools lie on streets between sites; walk over one to pick it up. */
export const TOOLS: Tool[] = [
  {
    id: 'mallet',
    name: 'Mallet',
    blurb: 'A shipwright’s mallet, dropped on West Broadway.',
    lat: 40.946469,
    lng: -73.070617,
  },
  {
    id: 'saw',
    name: 'Saw',
    blurb: 'A rusty frame saw leaning on a Main Street lamppost.',
    lat: 40.945941,
    lng: -73.066912,
  },
  {
    id: 'caulking-iron',
    name: 'Caulking iron',
    blurb: 'For packing the seams so she doesn’t leak.',
    lat: 40.948039,
    lng: -73.066069,
  },
].map((t) => ({ ...t, id: t.id as ToolId, ...latLngToLocal(t.lat, t.lng) }))

export const TOOL_IDS = TOOLS.map((t) => t.id)
export const toolById = (id: string | null | undefined) => TOOLS.find((t) => t.id === id) ?? null
export const TOOL_PICKUP_M = 10

export const STORY = {
  hal: 'Hal',
  intro: [
    {
      title: 'Off the ferry',
      body: 'You step off the boat from Bridgeport into Port Jefferson — a harbor village, once called Drowned Meadow, that built ships for generations.',
    },
    {
      title: 'The last boat has gone',
      body: 'By the time you look back, the ferry is pulling out. On the dock an old shipwright named Hal laughs: “Missed it? Then build your own. This village knows how.”',
    },
    {
      title: 'Nine stops, nine parts',
      body: 'Visit the nine places around the harbor. Help the people there and each will give you a part for a small sloop. Keep an eye on the streets, too — three tools are lying around.',
    },
    {
      title: 'Build her and sail',
      body: 'Bring everything to Hal’s shipyard, build the boat, and sail her out past the ferry. Follow the blue line — it always leads to the next thing you need.',
    },
  ],
  shipyardTitle: 'Hal’s Shipyard',
  shipyardHint: 'Each stop gives you one part. The tools are on the streets in between.',
  build: 'Build the sloop',
  building: 'Building…',
  launch: 'Launch her',
  finaleTitle: 'Leaving Port Jefferson',
  finaleBody:
    'Hal gives the hull a slap and pushes you off. You tack out past the breakwater, past the ferry that brought you here, into Long Island Sound — on a boat this village helped you build.',
  finaleLine: 'Drowned Meadow, Port Jefferson — still a harbor that builds ships.',
}

export const TOTAL_ITEMS = PART_ORDER.length + TOOLS.length
