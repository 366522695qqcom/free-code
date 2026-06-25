import { Link } from 'react-router-dom'
import { useWorkspaceState, useSetWorkspaceState } from '../state/WorkspaceState.js'
import { SessionCard, type SessionStatus } from '../components/sessions/SessionCard.js'
import { NewSessionModal } from '../components/sessions/NewSessionModal.js'

type TabKey = 'active' | 'history' | 'archived'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'history', label: 'History' },
  { key: 'archived', label: 'Archived' },
]

/* ── Sample data ──────────────────────────────────────────────── */

type SessionData = {
  id: string
  name: string
  projectPath: string
  model: string
  lastActive: string
  messageCount: number
  status: SessionStatus
  isCurrent?: boolean
}

const ACTIVE_SESSIONS: SessionData[] = [
  {
    id: 's1',
    name: 'Refactor App Component',
    projectPath: 'MY-PROJECT',
    model: 'Claude Opus 4',
    lastActive: '2 min ago',
    messageCount: 14,
    status: 'active',
    isCurrent: true,
  },
  {
    id: 's2',
    name: 'Fix Login Bug',
    projectPath: 'AUTH-SERVICE',
    model: 'Claude Sonnet 4',
    lastActive: '15 min ago',
    messageCount: 8,
    status: 'completed',
  },
  {
    id: 's3',
    name: 'Write Unit Tests',
    projectPath: 'MY-PROJECT',
    model: 'Claude Opus 4',
    lastActive: '8 min ago',
    messageCount: 6,
    status: 'idle',
  },
  {
    id: 's4',
    name: 'API Documentation Update',
    projectPath: 'API-DOCS',
    model: 'Claude Sonnet 4',
    lastActive: '30 min ago',
    messageCount: 11,
    status: 'error',
  },
]

const HISTORY_SESSIONS: SessionData[] = [
  {
    id: 'h1',
    name: 'Database Migration Script',
    projectPath: 'MY-PROJECT',
    model: 'Claude Opus 4',
    lastActive: '1 hour ago',
    messageCount: 22,
    status: 'completed',
  },
  {
    id: 'h2',
    name: 'Add Auth Middleware',
    projectPath: 'AUTH-SERVICE',
    model: 'Claude Sonnet 4',
    lastActive: '2 hours ago',
    messageCount: 18,
    status: 'completed',
  },
  {
    id: 'h3',
    name: 'Performance Optimization',
    projectPath: 'MY-PROJECT',
    model: 'Claude Opus 4',
    lastActive: '3 hours ago',
    messageCount: 9,
    status: 'error',
  },
]

/* ── Page Component ───────────────────────────────────────────── */

export function Sessions() {
  const activeTab = useWorkspaceState(s => s.sessionsActiveTab)
  const setState = useSetWorkspaceState()

  const setTab = (key: TabKey) => {
    setState(prev => ({ ...prev, sessionsActiveTab: key }))
  }

  const openNewSessionModal = () => {
    setState(prev => ({ ...prev, newSessionModalOpen: true }))
  }

  const sessions = activeTab === 'active'
    ? ACTIVE_SESSIONS
    : activeTab === 'history'
      ? HISTORY_SESSIONS
      : []

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base-default)',
        color: 'var(--text-default)',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: 'var(--spacer-40) var(--spacer-24)',
        }}
      >
        {/* ── Page Header ──────────────────────────────────────── */}
        <header className="ds-pagehead">
          <div className="ds-pagehead__main">
            <h1 className="ds-pagehead__title">Sessions</h1>
            <p className="ds-pagehead__subtitle">
              Manage your Claude Code concurrent sessions
            </p>
          </div>
          <div className="ds-pagehead__actions">
            <Link
              to="/"
              className="ds-btn ds-btn--ghost"
              style={{ textDecoration: 'none' }}
            >
              <img src="/assets/icons/arrow-left.svg" alt="" style={{ width: 14, height: 14 }} />
              Workspace
            </Link>
            <button className="ds-btn ds-btn--brand" type="button" onClick={openNewSessionModal}>
              <img src="/assets/icons/plus.svg" alt="" style={{ width: 14, height: 14 }} />
              New Session
            </button>
          </div>
        </header>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <nav className="ds-tabs" aria-label="Session tabs" style={{ marginTop: 'var(--spacer-24)' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`ds-tab${activeTab === tab.key ? ' is-active' : ''}`}
              type="button"
              onClick={() => setTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Session Cards Grid ───────────────────────────────── */}
        <section
          aria-label={`${activeTab} sessions`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacer-16)',
            marginTop: 'var(--spacer-24)',
          }}
        >
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              name={session.name}
              projectPath={session.projectPath}
              model={session.model}
              lastActive={session.lastActive}
              messageCount={session.messageCount}
              status={session.status}
              isCurrent={session.isCurrent}
            />
          ))}
        </section>

        {sessions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacer-40) 0',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--body-base-font-family)',
              fontSize: 'var(--body-base-font-size)',
            }}
          >
            No {activeTab} sessions found.
          </div>
        )}
      </div>

      {/* ── New Session Modal ──────────────────────────────────── */}
      <NewSessionModal />
    </div>
  )
}
