import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'
import { useProviders } from '../../state/ProvidersState.js'
import { useSetSessions } from '../../state/SessionsState.js'
import type { ChatSession } from '../../types/index.js'

// Task 21.2 / 21.3 — removed hardcoded `MODELS` constant. Models now come from
// the currently selected Provider's `models` array (defaults to the first
// provider's first model). Create now calls `createSession` from
// SessionsState, sets `currentSessionId` on WorkspaceState, and navigates to
// the workspace (`/`).

const PERMISSION_MODES: readonly ChatSession['permissionMode'][] = [
  'default',
  'plan',
  'auto-accept',
  'bypass',
]

const PERMISSION_LABELS: Record<ChatSession['permissionMode'], string> = {
  default: 'Default',
  plan: 'Plan',
  'auto-accept': 'Auto-accept',
  bypass: 'Bypass permissions',
}

export function NewSessionModal() {
  const open = useWorkspaceState(s => s.newSessionModalOpen)
  const workspaceCurrentProviderId = useWorkspaceState(s => s.currentProviderId)
  const workspaceCurrentModel = useWorkspaceState(s => s.currentModel)
  const setState = useSetWorkspaceState()
  const providers = useProviders(s => s.providers)
  const { createSession } = useSetSessions()
  const navigate = useNavigate()

  const currentProvider =
    providers.find(p => p.id === workspaceCurrentProviderId) ?? providers[0]
  const initialModel =
    (workspaceCurrentModel && currentProvider?.models.includes(workspaceCurrentModel)
      ? workspaceCurrentModel
      : currentProvider?.models[0]) ?? ''

  const [projectPath, setProjectPath] = useState('')
  const [providerId, setProviderId] = useState(currentProvider?.id ?? '')
  const [model, setModel] = useState(initialModel)
  const [permissionMode, setPermissionMode] = useState<ChatSession['permissionMode']>('default')

  if (!open) return null

  const close = () => setState(prev => ({ ...prev, newSessionModalOpen: false }))

  // Models for the currently selected provider in the form.
  const selectedProvider = providers.find(p => p.id === providerId) ?? currentProvider
  const availableModels = selectedProvider?.models ?? []

  const handleProviderChange = (newProviderId: string) => {
    const next = providers.find(p => p.id === newProviderId)
    setProviderId(newProviderId)
    // Reset model to the first model of the new provider.
    setModel(next?.models[0] ?? '')
  }

  const handleCreate = () => {
    if (!selectedProvider || !model) return
    const id = createSession({
      title: projectPath
        ? projectPath.split('/').filter(Boolean).pop() ?? 'New Session'
        : 'New Session',
      projectPath,
      providerId: selectedProvider.id,
      model,
      permissionMode,
    })
    // Persist the new selection on the workspace and navigate to it.
    setState(prev => ({
      ...prev,
      newSessionModalOpen: false,
      currentProviderId: selectedProvider.id,
      currentModel: model,
      currentSessionId: id,
    }))
    navigate('/')
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close()
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--body-sm-font-family)',
    fontSize: 'var(--body-sm-font-size)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-secondary)',
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
        <div
          className="ds-dialog__body"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-16)' }}
        >
          {/* Project path */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label htmlFor="session-project-path" style={labelStyle}>
              Project path
            </label>
            <div className="ds-input">
              <img
                src="/assets/icons/folder.svg"
                alt=""
                style={{ width: 14, height: 14, color: 'var(--icon-secondary)' }}
              />
              <input
                id="session-project-path"
                type="text"
                placeholder="/path/to/project"
                value={projectPath}
                onChange={e => setProjectPath(e.target.value)}
              />
            </div>
          </div>

          {/* Provider selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label htmlFor="session-provider" style={labelStyle}>
              Provider
            </label>
            <select
              id="session-provider"
              className="ds-select"
              value={providerId}
              onChange={e => handleProviderChange(e.target.value)}
              disabled={providers.length === 0}
            >
              {providers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.apiType})
                </option>
              ))}
              {providers.length === 0 && <option value="">No providers configured</option>}
            </select>
          </div>

          {/* Model selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label htmlFor="session-model" style={labelStyle}>
              Model
            </label>
            <select
              id="session-model"
              className="ds-select"
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={availableModels.length === 0}
            >
              {availableModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
              {availableModels.length === 0 && <option value="">No models configured</option>}
            </select>
          </div>

          {/* Permission mode */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-6)' }}>
            <label htmlFor="session-permission" style={labelStyle}>
              Permission mode
            </label>
            <select
              id="session-permission"
              className="ds-select"
              value={permissionMode}
              onChange={e =>
                setPermissionMode(e.target.value as ChatSession['permissionMode'])
              }
            >
              {PERMISSION_MODES.map(m => (
                <option key={m} value={m}>{PERMISSION_LABELS[m]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Foot */}
        <div className="ds-dialog__foot">
          <button className="ds-btn ds-btn--secondary" type="button" onClick={close}>
            Cancel
          </button>
          <button
            className="ds-btn ds-btn--brand"
            type="button"
            onClick={handleCreate}
            disabled={!selectedProvider || !model}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
