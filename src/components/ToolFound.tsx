import { useNavigate } from 'react-router-dom'
import { TOOLS, toolById } from '../data/story'
import { TOTAL_PIECES } from '../data/checkpoints'
import { useGame } from '../state/useGameStore'
import { ItemIcon } from './ItemIcon'

/** Notice shown when the walker picks up a street tool. */
export function ToolFound({ toolId, onClose }: { toolId: string; onClose: () => void }) {
  const navigate = useNavigate()
  const tool = toolById(toolId)
  const parts = useGame((s) => s.checkedInSiteIds.length)
  const tools = useGame((s) => s.toolIds.length)
  if (!tool) return null
  const ready = parts >= TOTAL_PIECES && tools >= TOOLS.length
  return (
    <div className="unlock-backdrop" onClick={onClose}>
      <section className="unlock tool-found" role="dialog" aria-modal="true" aria-labelledby="tool-title" onClick={(e) => e.stopPropagation()}>
        <p className="unlock-kicker">Tool found</p>
        <span className="reward-icon reward-icon-lg">
          <ItemIcon id={tool.id} size={64} />
        </span>
        <h2 id="tool-title">{tool.name}</h2>
        <p className="muted">{tool.blurb}</p>
        <p className="reward-progress">
          Parts {parts}/{TOTAL_PIECES} · Tools {tools}/{TOOLS.length}
        </p>
        <div className="sheet-actions">
          {ready ? (
            <button className="btn btn-primary" onClick={() => navigate('/shipyard')}>
              Go to Hal’s shipyard
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>
              Keep exploring
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
