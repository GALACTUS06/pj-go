import { useEffect, useRef, useState } from 'react'
import { en } from '../copy/en'
import { input } from '../state/runtime'

const RADIUS = 52
const DEADZONE = 0.12

export function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const pointer = useRef<number | null>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  useEffect(
    () => () => {
      input.stickX = 0
      input.stickY = 0
    },
    [],
  )

  const update = (clientX: number, clientY: number) => {
    const r = base.current!.getBoundingClientRect()
    let dx = clientX - (r.left + r.width / 2)
    let dy = clientY - (r.top + r.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS
      dy = (dy / len) * RADIUS
    }
    setKnob({ x: dx, y: dy })
    const mag = Math.min(1, len / RADIUS)
    if (mag < DEADZONE) {
      input.stickX = 0
      input.stickY = 0
    } else {
      input.stickX = dx / RADIUS
      input.stickY = -dy / RADIUS
    }
  }

  const release = () => {
    pointer.current = null
    setKnob({ x: 0, y: 0 })
    input.stickX = 0
    input.stickY = 0
  }

  return (
    <div
      ref={base}
      className="joystick"
      role="application"
      aria-label={en.a11y.joystick}
      onPointerDown={(e) => {
        e.stopPropagation()
        pointer.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (pointer.current === e.pointerId) update(e.clientX, e.clientY)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <div className="joystick-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
