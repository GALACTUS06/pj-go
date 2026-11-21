import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toast } from './components/Toast'
import { FinalePage } from './pages/FinalePage'
import { HomePage } from './pages/HomePage'
import { PlayPage } from './pages/PlayPage'
import { PuzzlePage } from './pages/PuzzlePage'
import { SettingsPage } from './pages/SettingsPage'

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
        <Route path="/finale" element={<FinalePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </HashRouter>
  )
}
