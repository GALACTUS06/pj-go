import { Link, useNavigate } from 'react-router-dom'
import { APP_VERSION } from '../config/assets'
import { en } from '../copy/en'
import { TOTAL_ITEMS } from '../data/story'
import { useGame } from '../state/useGameStore'

export function HomePage() {
  const navigate = useNavigate()
  const mode = useGame((s) => s.modePreference)
  const setMode = useGame((s) => s.setMode)
  const found = useGame((s) => s.checkedInSiteIds.length + s.toolIds.length)
  const live = mode === 'live'

  return (
    <div className="home">
      <div className="home-hero">
        <svg className="home-waves" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
          <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 V60 H0Z" fill="#2f6f8f" opacity="0.55" />
          <path d="M0 40 Q50 22 100 40 T200 40 T300 40 T400 40 V60 H0Z" fill="#2f6f8f" />
        </svg>
        <p className="home-place">Port Jefferson, NY</p>
        <h1 className="home-title">{en.brand.name}</h1>
        <p className="home-tagline">{en.brand.tagline}</p>
      </div>

      <main className="home-main">
        <div className="home-progress">
          <div className="home-dots" aria-hidden>
            {Array.from({ length: TOTAL_ITEMS }, (_, i) => (
              <span key={i} className={i < found ? 'on' : ''} />
            ))}
          </div>
          <span>{en.play.ship(found, TOTAL_ITEMS)}</span>
        </div>

        <button className="btn btn-primary btn-lg" onClick={() => navigate('/play')}>
          {live ? en.home.continueLive : en.home.startVirtual}
        </button>
        <button className="btn btn-outline btn-lg" onClick={() => setMode(live ? 'virtual' : 'live')}>
          {live ? en.home.useVirtual : en.home.useLive}
        </button>
        <p className="muted home-mode">{en.home.modeLine(live)}</p>

        <nav className="home-links">
          <Link to="/shipyard">{en.home.shipyard}</Link>
          <button
            className="link-button"
            onClick={() => {
              useGame.setState({ storySeen: false })
              navigate('/play')
            }}
          >
            {en.home.story}
          </button>
          <Link to="/settings">{en.home.settings}</Link>
        </nav>
      </main>

      <footer className="home-footer">
        <span>{en.home.footerOsm}</span>
        <span>v{APP_VERSION}</span>
      </footer>
    </div>
  )
}
