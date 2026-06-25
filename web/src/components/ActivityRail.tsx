/**
 * ActivityRail 活动栏
 * 借鉴 TagTabs.tsx 的 selectedIndex 模式
 */
import { useWorkspaceState, useSetWorkspaceState } from '../state/store'
import type { RailItem } from '../types'

const RAIL_ITEMS: { id: RailItem; icon: string; title: string }[] = [
  { id: 'files', icon: 'files', title: 'Files' },
  { id: 'search', icon: 'search', title: 'Search' },
  { id: 'git', icon: 'git', title: 'Git' },
  { id: 'terminal', icon: 'terminal', title: 'Terminal' },
]

const NAV_ITEMS: { id: RailItem; icon: string; title: string }[] = [
  { id: 'sessions', icon: 'message-circle', title: 'Sessions' },
  { id: 'settings', icon: 'gear', title: 'Settings' },
]

export function ActivityRail() {
  const activeRailItem = useWorkspaceState(s => s.activeRailItem)
  const setState = useSetWorkspaceState()

  const setRailItem = (id: RailItem) => {
    setState(prev => ({ ...prev, activeRailItem: id }))
  }

  const isActive = (id: RailItem) => activeRailItem === id

  return (
    <div className="cc-activity-rail ds-activityrail">
      {RAIL_ITEMS.map(item => (
        <button
          key={item.id}
          className={`ds-activityrail__btn ${isActive(item.id) ? 'is-active' : ''}`}
          title={item.title}
          onClick={() => setRailItem(item.id)}
        >
          <img
            src={`/assets/icons/${item.icon}.svg`}
            width={18}
            height={18}
            alt=""
            style={{ color: isActive(item.id) ? 'var(--icon-default)' : 'var(--icon-secondary)' }}
          />
        </button>
      ))}
      <div className="ds-activityrail__spacer" />
      <div className="ds-activityrail__divider" />
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`ds-activityrail__btn ${isActive(item.id) ? 'is-active' : ''}`}
          title={item.title}
          onClick={() => setRailItem(item.id)}
        >
          <img
            src={`/assets/icons/${item.icon}.svg`}
            width={18}
            height={18}
            alt=""
            style={{ color: isActive(item.id) ? 'var(--icon-default)' : 'var(--icon-secondary)' }}
          />
        </button>
      ))}
    </div>
  )
}
