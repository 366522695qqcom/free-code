/**
 * Titlebar 标题栏
 * 从设计稿 workspace.html 转换，借鉴 TagTabs.tsx 的 selectedIndex 模式
 */
import { useWorkspaceState, useSetWorkspaceState } from '../state/store'
import type { ViewMode } from '../types'

const VIEW_MODES: ViewMode[] = ['verbose', 'normal', 'summary']

export function Titlebar() {
  const activeViewMode = useWorkspaceState(s => s.activeViewMode)
  const setState = useSetWorkspaceState()

  const setViewMode = (mode: ViewMode) => {
    setState(prev => ({ ...prev, activeViewMode: mode }))
  }

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }

  const toggleChatPanel = () => {
    setState(prev => ({ ...prev, chatPanelOpen: !prev.chatPanelOpen }))
  }

  return (
    <div className="cc-titlebar ds-wbtitlebar">
      <div className="ds-wbtitlebar__left">
        <div className="ds-wbtitlebar__lights">
          <span className="ds-wbtitlebar__light ds-wbtitlebar__light--close" />
          <span className="ds-wbtitlebar__light ds-wbtitlebar__light--min" />
          <span className="ds-wbtitlebar__light ds-wbtitlebar__light--max" />
        </div>
        <img src="/assets/icons/sparkles.svg" width={16} height={16} alt="" style={{ color: 'var(--text-brand)' }} />
        <span style={{ fontSize: 'var(--body-sm-strong-font-size)', fontWeight: 'var(--body-sm-strong-font-weight)', color: 'var(--text-default)' }}>Claude Code</span>
      </div>

      <div className="ds-wbtitlebar__project-selector">
        <img src="/assets/icons/folder.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-secondary)' }} />
        <span>my-project</span>
        <img src="/assets/icons/chevron-down.svg" width={12} height={12} alt="" style={{ color: 'var(--icon-tertiary)' }} />
      </div>

      <div className="ds-wbtitlebar__right">
        <div className="ds-tabs--filled" style={{ display: 'inline-flex', gap: 'var(--spacer-2)' }}>
          {VIEW_MODES.map(mode => (
            <button
              key={mode}
              className={`ds-tab ${activeViewMode === mode ? 'is-active' : ''}`}
              style={{
                padding: 'var(--spacer-4) var(--spacer-8)',
                fontSize: 'var(--body-xs-font-size)',
                borderRadius: 'var(--radius-4)',
                background: activeViewMode === mode ? 'var(--bg-overlay-l3)' : 'transparent',
                border: 'none',
                color: activeViewMode === mode ? 'var(--text-default)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
              onClick={() => setViewMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
        <button className="ds-wbtitlebar__iconbtn" title="Toggle sidebar" onClick={toggleSidebar}>
          <img src="/assets/icons/sidebar-left.svg" width={16} height={16} alt="" style={{ color: 'var(--icon-secondary)' }} />
        </button>
        <button className="ds-wbtitlebar__iconbtn" title="Toggle panel" onClick={toggleChatPanel}>
          <img src="/assets/icons/sidebar-right.svg" width={16} height={16} alt="" style={{ color: 'var(--icon-secondary)' }} />
        </button>
        <div className="ds-avatar ds-avatar--sm" style={{ background: 'var(--bg-brand)', color: 'var(--text-onbrand)', fontSize: 'var(--body-xs-font-size)', fontWeight: 'var(--font-weight-strong)' }}>U</div>
      </div>
    </div>
  )
}
