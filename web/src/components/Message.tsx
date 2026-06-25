import type { ChatMessage } from '../types/index.js'

// Borrowed from src/components/Message.tsx — message type dispatch pattern
type Props = {
  message: ChatMessage
}

export function Message({ message }: Props) {
  switch (message.type) {
    case 'user':
      return <UserMessage message={message} />
    case 'assistant':
      return <AssistantMessage message={message} />
    case 'tool-use':
      return <ToolUseMessage message={message} />
    default:
      return null
  }
}

function UserMessage({ message }: Props) {
  return (
    <div className="cc-msg cc-msg--user">
      <div className="cc-msg__avatar">
        <img src="/assets/icons/user.svg" alt="" width={16} height={16} />
      </div>
      <div className="cc-msg__content">
        <p>{message.content}</p>
      </div>
    </div>
  )
}

function AssistantMessage({ message }: Props) {
  return (
    <div className="cc-msg cc-msg--assistant">
      <div className="cc-msg__avatar">
        <img src="/assets/icons/sparkles.svg" alt="" width={16} height={16} />
      </div>
      <div className="cc-msg__content">
        {message.content.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>
          }
          if (line.startsWith('- ')) {
            return <p key={i} style={{ paddingLeft: 'var(--spacers-4)' }}>• {line.slice(2)}</p>
          }
          if (line === '') return <br key={i} />
          return <p key={i}>{line}</p>
        })}
      </div>
    </div>
  )
}

function ToolUseMessage({ message }: Props) {
  const statusClass = message.toolStatus === 'done'
    ? 'cc-tool-block--done'
    : message.toolStatus === 'error'
      ? 'cc-tool-block--error'
      : 'cc-tool-block--progress'

  return (
    <div className={`cc-tool-block ${statusClass}`}>
      <div className="cc-tool-block__header">
        <span className="cc-tool-block__icon">
          {message.toolStatus === 'done' ? (
            <img src="/assets/icons/check.svg" alt="" width={14} height={14} />
          ) : message.toolStatus === 'progress' ? (
            <span className="cc-spinner" />
          ) : (
            <img src="/assets/icons/x.svg" alt="" width={14} height={14} />
          )}
        </span>
        <span className="cc-tool-block__name">{message.toolName}</span>
        <span className="cc-tool-block__file">{message.content}</span>
      </div>
    </div>
  )
}
