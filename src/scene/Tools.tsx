import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ItemIcon } from '../components/ItemIcon'
import { TOOLS, type Tool } from '../data/story'
import { distM } from '../domain/geo'
import { player } from '../state/runtime'
import { useGame } from '../state/useGameStore'

const COLOR = '#18b6a4'
const BEAM_M = 10
const LABEL_HIDE_M = 220

function ToolMarker({ tool }: { tool: Tool }) {
  const spin = useRef<THREE.Mesh>(null)
  const label = useRef<HTMLDivElement>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (spin.current) {
      spin.current.rotation.y = t * 1.6
      spin.current.position.y = BEAM_M + 1.2 + Math.sin(t * 2) * 0.4
    }
    if (label.current) {
      const d = distM(player.x, player.z, tool.x, tool.z)
      label.current.style.display = d > LABEL_HIDE_M ? 'none' : ''
    }
  })
  return (
    <group position={[tool.x, 0, tool.z]}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.08}>
        <ringGeometry args={[2.2, 3, 40]} />
        <meshBasicMaterial color={COLOR} transparent opacity={0.8} />
      </mesh>
      <mesh position-y={BEAM_M / 2}>
        <cylinderGeometry args={[0.5, 0.8, BEAM_M, 12, 1, true]} />
        <meshBasicMaterial color={COLOR} transparent opacity={0.45} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={spin}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color={COLOR} />
      </mesh>
      <Html position={[0, BEAM_M + 4, 0]} center zIndexRange={[10, 0]} pointerEvents="none">
        <div ref={label} className="world-label is-tool">
          <ItemIcon id={tool.id} size={16} /> {tool.name}
        </div>
      </Html>
    </group>
  )
}

export function Tools() {
  const found = useGame((s) => s.toolIds)
  return (
    <>
      {TOOLS.filter((t) => !found.includes(t.id)).map((t) => (
        <ToolMarker key={t.id} tool={t} />
      ))}
    </>
  )
}
