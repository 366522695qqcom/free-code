// Borrowed from src/commands/cost/ — Web adaptation.
// cc sums session cost/tokens from accumulated usage. Here we read the current
// workspace messages and total up costUSD + usage fields. WorkspaceState.messages
// is migrating from ChatMessage[] to the cc-borrowed Message[] (Phase 5); the
// cost/usage fields are optional during that migration, so we read them
// defensively via a minimal local type.

import type * as React from 'react'
import { useWorkspaceState } from '../state/WorkspaceState.js'
import type {
  LocalJSXCommand,
  LocalJSXCommandOnDone,
} from '../types/command.js'

// Minimal message shape covering only the cost-relevant optional fields.
type CostedMessage = {
  costUSD?: number
  usage?: {
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens?: number
    cache_creation_input_tokens?: number
  }
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 'var(--spacer-24)',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 'var(--spacer-12)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--body-sm-font-size)',
  color: 'var(--text-secondary)',
}

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 'var(--body-sm-font-size)',
  color: 'var(--text-default)',
}

function CostCard({ onDone }: { onDone: LocalJSXCommandOnDone }) {
  const messages = useWorkspaceState(s => s.messages) as CostedMessage[]

  let inputTokens = 0
  let outputTokens = 0
  let cacheReadTokens = 0
  let cacheCreationTokens = 0
  let totalCost = 0
  for (const m of messages) {
    if (typeof m.costUSD === 'number') totalCost += m.costUSD
    const u = m.usage
    if (u) {
      inputTokens += u.input_tokens
      outputTokens += u.output_tokens
      cacheReadTokens += u.cache_read_input_tokens ?? 0
      cacheCreationTokens += u.cache_creation_input_tokens ?? 0
    }
  }
  const totalTokens =
    inputTokens + outputTokens + cacheReadTokens + cacheCreationTokens

  const close = () => onDone()
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close()
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Input tokens', value: inputTokens.toLocaleString() },
    { label: 'Output tokens', value: outputTokens.toLocaleString() },
    { label: 'Cache read', value: cacheReadTokens.toLocaleString() },
    { label: 'Cache creation', value: cacheCreationTokens.toLocaleString() },
    { label: 'Total tokens', value: totalTokens.toLocaleString() },
    { label: 'Estimated cost', value: `$${totalCost.toFixed(4)}` },
  ]

  return (
    <div onClick={handleBackdrop} style={backdropStyle}>
      <div className="ds-dialog" role="dialog" aria-label="Session cost" style={{ maxWidth: 380 }}>
        <div className="ds-dialog__head">
          <span className="ds-dialog__title">Session cost</span>
          <button className="ds-dialog__close" type="button" onClick={close}>
            <img src="/assets/icons/x.svg" alt="Close" style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div
          className="ds-dialog__body"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacer-8)' }}
        >
          {rows.map(r => (
            <div key={r.label} style={rowStyle}>
              <span style={labelStyle}>{r.label}</span>
              <span style={valueStyle}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className="ds-dialog__foot">
          <button className="ds-btn ds-btn--secondary" type="button" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export const costCommand: LocalJSXCommand = {
  type: 'local-jsx',
  name: 'cost',
  description: 'Show the total cost and duration of the current session',
  userFacingName: () => '/cost',
  call: (_args, _context, onDone) => <CostCard onDone={onDone} />,
}
