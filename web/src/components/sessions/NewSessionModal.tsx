import React, { useState } from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'

const MODELS = [
  'Claude Sonnet 4',
  'Claude Opus 4',
  'Claude 3.5 Haiku',
]

const PERMISSION_MODES = [
  'Default',
  'Plan',
  'Auto-accept',
  'Bypass permissions',
]

export function NewSessionModal() {
  const open = useWorkspaceState(s => s.newSessionModalOpen)
  const setState = useSetWorkspaceState()

  const [projectPath, setProjectPath] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const [permissionMode, setPermissionMode] = useState(PERMISSION_MODES[0])

  if (!open) return null

  const close = () => setState(prev => ({ ...prev, newSessionModalOpen: false }))

  const handleCreate = () => {
    // In a real app this would dispatch a session creation action
    close()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 'var(--spacer-24)',
      }}
    >
      <div className="ds-dialog" role="dialog" aria-label="New Session" style={{ maxWidth: 440 }}>
        {/* Head */}
        <div className="ds-dialog__head">
          <span className="ds-dialog__title">New Session</span>
          <button className="ds-dialog__close" type="button" onClick={close}>
            <img src="/assets/icons/x.svg" alt="Close" style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Body */}
        <div className="ds-dialog__body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-16)' }}>
          {/* Project path */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label
              htmlFor="session-project-path"
              style={{
                fontFamily: 'var(--body-sm-font-family)',
                fontSize: 'var(--body-sm-font-size)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-secondary)',
              }}
            >
              Project path
            </label>
            <div className="ds-input">
              <img src="/assets/icons/folder.svg" alt="" style={{ width: 14, height: 14, color: 'var(--icon-secondary)' }} />
              <input
                id="session-project-path"
                type="text"
                placeholder="/path/to/project"
                value={projectPath}
                onChange={e => setProjectPath(e.target.value)}
              />
            </div>
          </div>

          {/* Model selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label
              htmlFor="session-model"
              style={{
                fontFamily: 'var(--body-sm-font-family)',
                fontSize: 'var(--body-sm-font-size)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-secondary)',
              }}
            >
              Model
            </label>
            <select
              id="session-model"
              className="ds-select"
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              {MODELS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Permission mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label
              htmlFor="session-permission"
              style={{
                fontFamily: 'var(--body-sm-font-family)',
                fontSize: 'var(--body-sm-font-size)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--text-secondary)',
              }}
            >
              Permission mode
            </label>
            <select
              id="session-permission"
              className="ds-select"
              value={permissionMode}
              onChange={e => setPermissionMode(e.target.value)}
            >
              {PERMISSION_MODES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Foot */}
        <div className="ds-dialog__foot">
          <button className="ds-btn ds-btn--secondary" type="button" onClick={close}>
            Cancel
          </button>
          <button className="ds-btn ds-btn--brand" type="button" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
