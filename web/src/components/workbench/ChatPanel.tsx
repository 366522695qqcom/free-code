import React, { useRef, useCallback } from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'
import { usePanelToggle } from '../../hooks/usePanelToggle.js'
import { useSlashCommand } from '../../hooks/useSlashCommand.js'
import { SlashCommandPanel } from './SlashCommandPanel.js'
import type { ChatMessage, ChatTab } from '../../types/index.js'

function Message({ message }: { message: ChatMessage }) {
  if (message.type === 'user') {
    return (
      <div className="cc-msg cc-msg--user">
        {message.content}
      </div>
    )
  }

  if (message.type === 'tool-use') {
    const isDone = message.toolStatus === 'done'
    const isProgress = message.toolStatus === 'progress'
    const iconSrc = message.toolName === 'Read' ? 'file-text.svg'
      : message.toolName === 'Write' ? 'edit.svg'
      : 'code.svg'

    return (
      <div className={`cc-tool-block${isDone ? ' cc-tool-block--done' : isProgress ? ' cc-tool-block--progress' : ''}`}>
        <div className="cc-tool-block__header">
          <img src={`/assets/icons/${iconSrc}`} width={14} height={14} alt="" style={{ color: 'var(--icon-default)' }} />
          <span className="cc-tool-block__label">{message.toolName}</span>
          <span className="cc-tool-block__file">{message.content}</span>
          <span className={`cc-tool-block__status${isDone ? ' cc-tool-block__status--done' : isProgress ? ' cc-tool-block__status--progress' : ''}`}>
            {isDone && <img src="/assets/icons/check.svg" width={14} height={14} alt="" />}
            {isProgress && <div className="cc-spinner" />}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="cc-msg cc-msg--assistant">
      {message.content}
    </div>
  )
}

const CHAT_TABS: { key: ChatTab; label: string }[] = [
  { key: 'chat', label: 'Chat' },
  { key: 'plan', label: 'Plan' },
]

export function ChatPanel() {
  const messages = useWorkspaceState(s => s.messages)
  const activeChatTab = useWorkspaceState(s => s.activeChatTab)
  const setState = useSetWorkspaceState()
  const { toggleChatPanel } = usePanelToggle()
  const {
    slashCommandOpen,
    filteredCommands,
    openSlashPanel,
    closeSlashPanel,
    updateFilter,
    navigateUp,
    navigateDown,
    selectCommand,
    slashCommandIndex,
  } = useSlashCommand()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value === '/') {
      openSlashPanel()
    } else if (!value.startsWith('/')) {
      closeSlashPanel()
    } else {
      updateFilter(value.slice(1))
    }
  }, [openSlashPanel, closeSlashPanel, updateFilter])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!slashCommandOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      navigateDown()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      navigateUp()
    } else if (e.key === 'Enter' && slashCommandIndex >= 0) {
      e.preventDefault()
      const cmd = filteredCommands[slashCommandIndex]
      if (cmd && textareaRef.current) {
        textareaRef.current.value = cmd.name + ' '
        closeSlashPanel()
      }
    } else if (e.key === 'Escape') {
      closeSlashPanel()
    }
  }, [slashCommandOpen, navigateDown, navigateUp, selectCommand, slashCommandIndex, filteredCommands, closeSlashPanel])

  return (
    <div className="cc-chat-panel" style={{ gridColumn: 4, gridRow: 2, display: 'flex', flexDirection: 'column', background: 'var(--bg-base-secondary)', borderLeft: '1px solid var(--border-neutral-l1)', overflow: 'hidden' }}>
      <div className="cc-chat-header">
        <div className="cc-chat-header-left">
          <img src="/assets/icons/sparkles.32f08c.svg" width={16} height={16} alt="" />
          <span className="cc-chat-header-title">Claude</span>
        </div>
        <div className="cc-chat-header-right">
          <div className="ds-tabs--filled" style={{ display: 'inline-flex', gap: 'var(--spacer-2)' }}>
            {CHAT_TABS.map(tab => (
              <button
                key={tab.key}
                className={`ds-tab${activeChatTab === tab.key ? ' is-active' : ''}`}
                style={{
                  padding: 'var(--spacer-2) var(--spacer-8)',
                  fontSize: 'var(--body-xs-font-size)',
                  borderRadius: 'var(--radius-4)',
                  background: activeChatTab === tab.key ? 'var(--bg-overlay-l3)' : 'transparent',
                  border: 'none',
                  color: activeChatTab === tab.key ? 'var(--text-default)' : 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
                onClick={() => setState(prev => ({ ...prev, activeChatTab: tab.key }))}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="ds-wbtitlebar__iconbtn" title="Collapse panel" style={{ width: 24, height: 24 }} onClick={toggleChatPanel}>
            <img src="/assets/icons/chevron-right.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-tertiary)' }} />
          </button>
        </div>
      </div>

      <div className="cc-chat-messages">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>

      <div className="cc-chat-composer">
        <div className="ds-composer" style={{ maxWidth: '100%', borderRadius: 'var(--radius-8)' }}>
          <textarea
            ref={textareaRef}
            className="ds-composer__input"
            rows={2}
            placeholder="输入消息，输入 / 查看可用命令..."
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          {slashCommandOpen && (
            <SlashCommandPanel
              filteredCommands={filteredCommands}
              highlightedIndex={slashCommandIndex}
              onSelect={(cmd) => {
                if (textareaRef.current) {
                  textareaRef.current.value = cmd.name + ' '
                  textareaRef.current.focus()
                }
                closeSlashPanel()
              }}
            />
          )}
          <div className="ds-composer__toolbar">
            <div className="ds-composer__tools">
              <button className="ds-composer__icon-btn" title="Attach image">
                <img src="/assets/icons/image.svg" width={16} height={16} alt="" style={{ color: 'var(--icon-secondary)' }} />
              </button>
              <button className="ds-composer__icon-btn" title="Voice input">
                <img src="/assets/icons/mic.svg" width={16} height={16} alt="" style={{ color: 'var(--icon-secondary)' }} />
              </button>
            </div>
            <div className="ds-composer__actions">
              <button className="ds-composer__send" title="Send message">
                <img src="/assets/icons/send.0c0c0d.svg" width={16} height={16} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
