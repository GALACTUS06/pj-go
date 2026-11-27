import { useEffect, useRef } from 'react'

export type GameProps = {
  onWin: () => void
  onLose: () => void
}

/** Calls `step(dt)` every animation frame while `active`; dt in seconds, capped. */
export function useFrameLoop(step: (dt: number) => void, active = true) {
  const ref = useRef(step)
  ref.current = step
  useEffect(() => {
    if (!active) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ref.current(dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
}

/** Keyboard helper: calls handlers on keydown/keyup for the given keys (lower-case). */
export function useKeys(down: Record<string, () => void>, up: Record<string, () => void> = {}) {
  const ref = useRef({ down, up })
  ref.current = { down, up }
  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const f = ref.current.down[e.key.toLowerCase()]
      if (f) {
        e.preventDefault()
        e.stopPropagation()
        if (!e.repeat) f()
      }
    }
    const ku = (e: KeyboardEvent) => ref.current.up[e.key.toLowerCase()]?.()
    window.addEventListener('keydown', kd, true)
    window.addEventListener('keyup', ku, true)
    return () => {
      window.removeEventListener('keydown', kd, true)
      window.removeEventListener('keyup', ku, true)
    }
  }, [])
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Fires `onDone` once, after `ms`, when `when` becomes true. */
export function useAfter(when: boolean, ms: number, onDone: () => void) {
  const ref = useRef(onDone)
  ref.current = onDone
  useEffect(() => {
    if (!when) return
    const t = setTimeout(() => ref.current(), ms)
    return () => clearTimeout(t)
  }, [when, ms])
}
