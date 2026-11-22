import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckInSheet } from '../components/CheckInSheet'
import { ErrorBoundary, canWebGL } from '../components/ErrorBoundary'
import { Joystick } from '../components/Joystick'
import { SitesDrawer } from '../components/SitesDrawer'
import { showToast } from '../components/Toast'
import { TutorialCoach } from '../components/TutorialCoach'
import { en } from '../copy/en'
import { TOTAL_PIECES, siteById } from '../data/checkpoints'
import { usePlayerLocation } from '../location/usePlayerLocation'
import { PlayCanvas } from '../scene/PlayCanvas'
import { useHarborGeo } from '../scene/useHarborGeo'
import { input, setAutoWalk, useHud } from '../state/runtime'
import { useGame } from '../state/useGameStore'
import { FallbackSitesPage } from './FallbackSitesPage'

const LOOK_SENSITIVITY = 0.006

function useKeyboard(onCheckIn: () => void, onCamera: () => void) {
  const handlers = useRef({ onCheckIn, onCamera })
  handlers.current = { onCheckIn, onCamera }
  useEffect(() => {
    const down = new Set<string>()
    const sync = () => {
      const has = (...k: string[]) => k.some((x) => down.has(x))
      input.keyX = (has('d', 'arrowright') ? 1 : 0) - (has('a', 'arrowleft') ? 1 : 0)
      input.keyY = (has('w', 'arrowup') ? 1 : 0) - (has('s', 'arrowdown') ? 1 : 0)
      input.keyTurn = (has('q') ? 1 : 0) - (has('e') ? 1 : 0)
    }
    const kd = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const k = e.key.toLowerCase()
      if (k === 'enter' || k === ' ') {
        e.preventDefault()
        handlers.current.onCheckIn()
        return
      }
      if (k === 'c') handlers.current.onCamera()
      down.add(k)
      sync()
    }
    const ku = (e: KeyboardEvent) => {
      down.delete(e.key.toLowerCase())
      sync()
    }
    const blur = () => {
      down.clear()
      sync()
    }
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
      window.removeEventListener('blur', blur)
      blur()
    }
  }, [])
}

function prefersReducedMotion() {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function PlayPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const mode = useGame((s) => s.modePreference)
  const camera = useGame((s) => s.cameraPreference)
  const reducedMotion = useGame((s) => s.reducedMotion) || prefersReducedMotion()
  const collected = useGame((s) => s.checkedInSiteIds)
  const setMode = useGame((s) => s.setMode)
  const toggleCamera = useGame((s) => s.toggleCamera)
  const hud = useHud()
  const { state: geoState, retry } = useHarborGeo()
  const [webgl] = useState(canWebGL)
  const [sheetId, setSheetId] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const look = useRef<{ id: number; x: number } | null>(null)

  usePlayerLocation(mode === 'live')

  useEffect(() => () => setAutoWalk(false), [])

  useEffect(() => {
    if (mode === 'live' && hud.gpsStatus === 'denied') {
      showToast(en.play.gpsDenied)
      setMode('virtual')
    }
  }, [mode, hud.gpsStatus, setMode])

  const inRange = siteById(hud.inRangeId)
  const openCheckIn = () => {
    if (!inRange) return
    setAutoWalk(false)
    setSheetId(inRange.id)
  }
  useKeyboard(openCheckIn, toggleCamera)

  const fallback = <FallbackSitesPage reason="webgl" />
  if (!webgl || params.get('fallback') === '1') return fallback

  const next = siteById(hud.nextId)
  const near = siteById(hud.nearId)
  const sheetSite = siteById(sheetId)
  const allDone = collected.length >= TOTAL_PIECES

  return (
    <div
      className="play"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'CANVAS' || look.current) return
        look.current = { id: e.pointerId, x: e.clientX }
      }}
      onPointerMove={(e) => {
        if (look.current?.id !== e.pointerId) return
        input.camYaw += (e.clientX - look.current.x) * LOOK_SENSITIVITY
        look.current.x = e.clientX
      }}
      onPointerUp={(e) => {
        if (look.current?.id === e.pointerId) look.current = null
      }}
      onPointerCancel={() => (look.current = null)}
    >
      <div className="play-stage">
        {geoState.status === 'ready' && (
          <ErrorBoundary fallback={fallback}>
            <PlayCanvas geo={geoState.geo} mode={mode} camera={camera} reducedMotion={reducedMotion} />
          </ErrorBoundary>
        )}
      </div>

      {geoState.status === 'loading' && <div className="play-overlay">{en.play.geoLoading}</div>}
      {geoState.status === 'error' && (
        <div className="play-overlay">
          <p>{en.play.geoLoadFail}</p>
          <button className="btn btn-primary" onClick={retry}>
            {en.play.retry}
          </button>
          <Link className="btn btn-ghost" to="/play?fallback=1">
            {en.play.openList}
          </Link>
        </div>
      )}

      <header className="hud-top">
        <Link className="chip chip-strong" to="/puzzle">
          {en.play.pieces(collected.length, TOTAL_PIECES)}
        </Link>
        <div className="hud-top-right">
          <button className="chip" onClick={() => setDrawer(true)}>
            {en.play.sitesDrawer}
          </button>
          <button className="chip" onClick={toggleCamera} aria-label={en.a11y.cameraToggle}>
            {camera === 'follow' ? en.play.cameraFollow : en.play.cameraOblique}
          </button>
          <button className="chip" onClick={() => navigate('/')} aria-label={en.play.exit}>
            ✕
          </button>
        </div>
      </header>

      <div className="hud-center">
        {allDone ? (
          <Link className="next-chip is-done" to="/puzzle">
            {en.play.allDone}
          </Link>
        ) : next ? (
          <button className="next-chip" onClick={() => setDrawer(true)}>
            <span className="compass" style={{ transform: `rotate(${hud.nextBearing}rad)` }} aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 2 L20 21 L12 16.5 L4 21 Z" fill="currentColor" />
              </svg>
            </span>
            {en.play.next(next.name, hud.nextDist)}
          </button>
        ) : null}
        {mode === 'live' && hud.gpsStatus === 'waiting' && <span className="chip">{en.play.gpsWaiting}</span>}
        {mode === 'live' && hud.gpsAccuracy != null && hud.gpsAccuracy > 25 && (
          <span className="chip chip-warn">{en.play.gpsAccuracy(hud.gpsAccuracy)}</span>
        )}
        {mode === 'live' && hud.outsideBox && <div className="banner">{en.play.outsideBox}</div>}
      </div>

      <footer className="hud-bottom">
        {mode === 'virtual' ? <Joystick /> : <span />}
        <div className="hud-action">
          {mode === 'virtual' && next && !allDone && hud.hasRoute && hud.inRangeId !== next.id && (
            <button
              className={`chip chip-walk${hud.autoWalk ? ' is-on' : ''}`}
              onClick={() => setAutoWalk(!hud.autoWalk)}
              aria-pressed={hud.autoWalk}
            >
              {hud.autoWalk ? `■ ${en.play.stopWalk}` : `▶ ${en.play.autoWalk}`}
            </button>
          )}
          {near && <span className="chip">{en.play.near(near.name)}</span>}
          <button
            className="btn btn-primary btn-checkin"
            disabled={!inRange}
            onClick={openCheckIn}
            aria-label={en.a11y.checkIn}
          >
            {inRange && collected.includes(inRange.id) ? en.play.reopen : en.play.checkIn}
          </button>
        </div>
      </footer>

      <TutorialCoach mode={mode} />
      {sheetSite && <CheckInSheet site={sheetSite} onClose={() => setSheetId(null)} />}
      {drawer && <SitesDrawer onClose={() => setDrawer(false)} />}
    </div>
  )
}
