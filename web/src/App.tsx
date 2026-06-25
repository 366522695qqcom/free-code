import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WorkspaceStateProvider } from './state/WorkspaceState.js'
import { Workspace } from './pages/Workspace.js'
import { Sessions } from './pages/Sessions.js'
import { Settings } from './pages/Settings.js'

export default function App() {
  return (
    <WorkspaceStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Workspace />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceStateProvider>
  )
}
