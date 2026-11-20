/** Complete English copy — mirror of docs/COPY_DECK.md */

export const en = {
  brand: {
    name: 'PJ Go',
    tagline:
      'Explore Port Jefferson’s harbor — collect 9 pieces, reveal the ferry.',
  },
  home: {
    startVirtual: 'Start Virtual Walk',
    useLive: 'Use Live Location',
    puzzle: 'Puzzle',
    settings: 'Settings',
    footerOsm: 'Map data © OpenStreetMap',
  },
  play: {
    pieces: (n: number) => `Pieces ${n}/9`,
    cameraFollow: 'Camera: Follow',
    cameraOblique: 'Camera: Overview',
    exit: 'Exit',
    checkIn: 'Check in',
    near: (siteName: string) => `Near: ${siteName}`,
    next: (siteName: string, meters: number) =>
      `Next: ${siteName} · ${Math.round(meters)} m`,
    gpsAccuracy: (meters: number) => `GPS ±${Math.round(meters)} m`,
    outsideBox: 'Head toward the harbor district',
    gpsDenied: 'Location unavailable — staying in Virtual',
    geoLoadFail: 'Harbor map failed to load',
    retry: 'Retry',
    webglFallbackTitle: '3D unavailable',
    webglFallbackBody:
      'Continue with the site list — you can still collect all 9 pieces.',
    openList: 'Open site list',
    sitesDrawer: 'Sites',
    go: 'Go',
    collected: 'Collected',
  },
  toast: {
    piece: (n: number) => `Piece unlocked (${n}/9)`,
  },
  tutorial: {
    steps: [
      {
        title: 'Move',
        body: 'Drag the stick to walk the harbor.',
      },
      {
        title: 'Find a glow',
        body: 'Follow Next or walk to a glowing marker.',
      },
      {
        title: 'Check in',
        body: 'When close enough, tap Check in to collect a piece.',
      },
    ],
    next: 'Next',
    done: 'Got it',
    skip: 'Skip',
  },
  sheet: {
    collect: 'Collect puzzle piece',
    collected: 'Collected',
    close: 'Close',
  },
  puzzle: {
    title: 'Harbor Puzzle',
    progress: (n: number) => `${n}/9`,
    reveal: 'Reveal the ferry',
    backPlay: 'Back to Play',
  },
  finale: {
    title: 'Port Jefferson Ferry',
    subtitle: 'Long Island Sound crossing to Bridgeport, Connecticut',
    closing:
      'Nine pieces of the harbor — one ferry still ties Long Island to Connecticut.',
    backPuzzle: 'Back to puzzle',
    keepExploring: 'Keep exploring',
  },
  settings: {
    title: 'Settings',
    mode: 'Play mode',
    modeVirtual: 'Virtual',
    modeLive: 'Live',
    camera: 'Camera',
    cameraFollow: 'Follow',
    cameraOblique: 'Overview',
    reset: 'Reset all progress',
    resetConfirm:
      'Clear all check-ins and puzzle pieces? This cannot be undone.',
    resetYes: 'Reset',
    resetNo: 'Cancel',
    credits: 'Credits',
    privacyTitle: 'Privacy',
    privacyBody:
      'Live mode uses your device location only on this device to place your avatar. Location is not uploaded to our servers. PJ Go has no accounts.',
    clearCache: 'Clear cached app data',
    clearCacheHint:
      'Use if the app looks stuck on an old version after an update.',
    version: (v: string) => `Build ${v}`,
    devTeleport: 'Teleport to site (dev)',
  },
  fallback: {
    title: 'Harbor sites',
    hint: 'Tap a site when you are in range (Virtual teleport via Go, or Live GPS).',
    checkIn: 'Check in',
  },
  a11y: {
    joystick: 'Movement joystick',
    checkIn: 'Check in at nearby site',
    cameraToggle: 'Toggle camera mode',
  },
} as const
