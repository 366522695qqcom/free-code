/**
 * ChatPanel 聊天面板
 * 从设计稿 workspace.html 转换
 * 借鉴 src/components/Message.tsx 的消息类型分发 + TagTabs 的 tab 切换
 */
import { useWorkspaceState, useSetWorkspaceState } from '../state/store'
import { usePanelToggle } from '../hooks/usePanelToggle'
import { useSlashCommand } from '../hooks/useSlashCommand'
import { Message } from './Message'
import { SlashCommandPanel } from './SlashCommandPanel'
import type { ChatTab } from '../types'

export function ChatPanel() {
  const activeChatTab = useWorkspaceState(s => s.activeChatTab)
  const messages = useWorkspaceState(s => s.messages)
  const setState = useSetWorkspaceState()
  const { toggleChatPanel } = usePanelToggle()
  const slash = useSlashCommand()

  const setChatTab = (tab: ChatTab) => {
    setState(prev => ({ ...prev, activeChatTab: tab }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slash.handleKeyDown(e.nativeEvent)) {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const value = slash.inputValue.trim()
      if (value) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, { type: 'user', content: value }],
          inputValue: '',
          slashCommandOpen: false,
        }))
      }
    }
  }

  return (
    <div className="cc-chat-panel">
      <div className="cc-chat-header">
        <div className="cc-chat-header-left">
          <img src="/assets/icons/sparkles.32f08c.svg" width={16} height={16} alt="" />
          <span className="cc-chat-header-title">Claude</span>
        </div>
        <div className="cc-chat-header-right">
          <div className="ds-tabs--filled" style={{ display: 'inline-flex', gap: 'var(--spacer-2)' }}>
            <button
              className={`ds-tab ${activeChatTab === 'chat' ? 'is-active' : ''}`}
              style={{
                padding: 'var(--spacer-2) var(--spacer-8)',
                fontSize: 'var(--body-xs-font-size)',
                borderRadius: 'var(--radius-4)',
                background: activeChatTab === 'chat' ? 'var(--bg-overlay-l3)' : 'transparent',
                border: 'none',
                color: activeChatTab === 'chat' ? 'var(--text-default)' : 'var(--text-tertiary)',
                cursor: 'pointer',
              }}
              onClick={() => setChatTab('chat')}
            >
              Chat
            </button>
            <button
              className={`ds-tab ${activeChatTab === 'plan' ? 'is-active' : ''}`}
              style={{
                padding: 'var(--spacer-2) var(--spacer-8)',
                fontSize: 'var(--body-xs-font-size)',
                borderRadius: 'var(--radius-4)',
                background: activeChatTab === 'plan' ? 'var(--bg-overlay-l3)' : 'transparent',
                border: 'none',
                color: activeChatTab === 'plan' ? 'var(--text-default)' : 'var(--text-tertiary)',
                cursor: 'pointer',
              }}
              onClick={() => setChatTab('plan')}
            >
              Plan
            </button>
          </div>
          <button className="ds-wbtitlebar__iconbtn" title="Collapse panel" style={{ width: 24, height: 24 }} onClick={toggleChatPanel}>
            <img src="/assets/icons/chevron-right.svg" width={14} height={14} alt="" style={{ color: 'var(--icon-tertiary)' }} />
          </button>
        </div>
      </div>

      <div className="cc-chat-messages">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}
      </div>

      <div className="cc-chat-composer">
        <div className="ds-composer" style={{ maxWidth: '100%', borderRadius: 'var(--radius-8)' }}>
          {slash.isOpen && <SlashCommandPanel />}
          <textarea
            className="ds-composer__input"
            rows={2}
            placeholder="输入消息，输入 / 查看可用命令..."
            value={slash.inputValue}
            onChange={e => slash.handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
