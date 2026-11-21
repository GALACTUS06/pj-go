import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { showToast } from '../components/Toast'
import { APP_VERSION, ASSETS } from '../config/assets'
import { en } from '../copy/en'
import { SITES } from '../data/checkpoints'
import { resetPlayer, teleport } from '../state/runtime'
import { useGame } from '../state/useGameStore'

const LONG_PRESS_MS = 700

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const s = useGame()
  const [confirming, setConfirming] = useState(false)
  const [dev, setDev] = useState(false)
  const press = useRef<number | null>(null)

  return (
    <div className="page settings">
      <header className="page-head">
        <Link to="/" className="btn btn-ghost btn-small">
          {en.settings.back}
        </Link>
      </header>
      <h1>{en.settings.title}</h1>

      <section className="card">
        <h2>{en.settings.mode}</h2>
        <Segmented
          value={s.modePreference}
          onChange={s.setMode}
          options={[
            { value: 'virtual', label: en.settings.modeVirtual },
            { value: 'live', label: en.settings.modeLive },
          ]}
        />
        <p className="muted">{en.settings.modeHelp}</p>
      </section>

      <section className="card">
        <h2>{en.settings.camera}</h2>
        <Segmented
          value={s.cameraPreference}
          onChange={s.setCamera}
          options={[
            { value: 'follow', label: en.settings.cameraFollow },
            { value: 'oblique', label: en.settings.cameraOblique },
          ]}
        />
        <label className="toggle">
          <input
            type="checkbox"
            checked={!!s.reducedMotion}
            onChange={(e) => s.setReducedMotion(e.target.checked)}
          />
          {en.settings.reducedMotion}
        </label>
      </section>

      <section className="card">
        <h2>{en.settings.privacyTitle}</h2>
        <p>{en.settings.privacyBody}</p>
      </section>

      <section className="card">
        <h2>{en.settings.credits}</h2>
        <p>{en.credits.osm}</p>
        <p>{en.credits.ferry}</p>
        <p>{en.credits.mark}</p>
      </section>

      <section className="card">
        {confirming ? (
          <>
            <p>{en.settings.resetConfirm}</p>
            <div className="page-actions">
              <button
                className="btn btn-danger"
                onClick={() => {
                  s.reset()
                  resetPlayer()
                  setConfirming(false)
                  showToast(en.settings.resetDone)
                }}
              >
                {en.settings.resetYes}
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
                {en.settings.resetNo}
              </button>
            </div>
          </>
        ) : (
          <button className="btn btn-danger-outline" onClick={() => setConfirming(true)}>
            {en.settings.reset}
          </button>
        )}
        <p className="muted">
          <a href={ASSETS.clearCache}>{en.settings.clearCache}</a> — {en.settings.clearCacheHint}
        </p>
      </section>

      <p
        className="version"
        title={en.settings.devHint}
        onPointerDown={() => {
          press.current = window.setTimeout(() => setDev((d) => !d), LONG_PRESS_MS)
        }}
        onPointerUp={() => press.current && clearTimeout(press.current)}
        onPointerLeave={() => press.current && clearTimeout(press.current)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {en.settings.version(APP_VERSION)}
      </p>

      {dev && (
        <section className="card">
          <h2>{en.settings.devTitle}</h2>
          <ul className="site-list">
            {SITES.map((site) => (
              <li key={site.id}>
                <span className="site-name">{site.name}</span>
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => {
                    s.setMode('virtual')
                    teleport(site.x, site.z)
                    navigate('/play')
                  }}
                >
                  {en.play.go}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
