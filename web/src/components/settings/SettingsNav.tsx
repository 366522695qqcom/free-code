import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'

type NavGroup = {
  title: string
  items: { key: string; icon: string; label: string }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'General',
    items: [
      { key: 'general', icon: 'layout.svg', label: 'Overview' },
    ],
  },
  {
    title: 'Model',
    items: [
      { key: 'model', icon: 'sparkles.svg', label: 'Model Selection' },
      { key: 'context', icon: 'arrow-expand.svg', label: 'Context Window' },
    ],
  },
  {
    title: 'Permissions',
    items: [
      { key: 'permissions', icon: 'shield.svg', label: 'Default Permissions' },
      { key: 'tools', icon: 'wrench.svg', label: 'Tool Permissions' },
      { key: 'auto-approve', icon: 'check.svg', label: 'Auto Approve' },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { key: 'theme', icon: 'eye.svg', label: 'Theme' },
      { key: 'font-size', icon: 'type.svg', label: 'Font Size' },
      { key: 'highlight', icon: 'code.svg', label: 'Code Highlighting' },
    ],
  },
  {
    title: 'Shortcuts',
    items: [
      { key: 'keybindings', icon: 'cmd.svg', label: 'Keyboard Map' },
      { key: 'custom-shortcuts', icon: 'key.svg', label: 'Custom Shortcuts' },
    ],
  },
  {
    title: 'Data',
    items: [
      { key: 'history', icon: 'clock.svg', label: 'Session History' },
      { key: 'export', icon: 'download.svg', label: 'Export Config' },
    ],
  },
]

export function SettingsNav() {
  const activeNav = useWorkspaceState(s => s.settingsActiveNav)
  const setState = useSetWorkspaceState()

  return (
    <aside className="settings-nav">
      <nav className="ds-navlist">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="ds-navlist__group">
            <div className="ds-navlist__group-title">{group.title}</div>
            {group.items.map(item => (
              <a
                key={item.key}
                className={`ds-navlist__item${activeNav === item.key ? ' is-active' : ''}`}
                onClick={() => setState(prev => ({ ...prev, settingsActiveNav: item.key }))}
              >
                <img src={`/assets/icons/${item.icon}`} width={18} height={18} alt="" className="icon" />
                <span className="ds-navlist__label">{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
