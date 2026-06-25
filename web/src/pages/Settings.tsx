import { Link } from 'react-router-dom'
import { SettingsNav } from '../components/settings/SettingsNav.js'
import { SettingsContent } from '../components/settings/SettingsContent.js'

export function Settings() {
  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="ds-pagehead">
        <div className="ds-pagehead__main">
          <span className="ds-pagehead__title">Settings</span>
          <span className="ds-pagehead__subtitle">Configure Claude Code behavior and preferences</span>
        </div>
        <div className="ds-pagehead__actions">
          <Link to="/" className="ds-pagehead__btn" style={{ textDecoration: 'none' }}>
            <img src="/assets/icons/arrow-left.svg" width={16} height={16} alt="" className="icon" />
            Back to Workspace
          </Link>
          <Link to="/sessions" className="ds-pagehead__btn" style={{ textDecoration: 'none' }}>
            <img src="/assets/icons/message-circle.svg" width={16} height={16} alt="" className="icon" />
            Sessions
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="settings-layout">
        <SettingsNav />
        <SettingsContent />
      </div>
    </div>
  )
}
