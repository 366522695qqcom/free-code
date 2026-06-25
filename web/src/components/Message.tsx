/**
 * Message 消息组件
 * 借鉴 src/components/Message.tsx 的消息类型分发模式
 * 借鉴 src/components/messages/AssistantTextMessage.tsx 的助手消息渲染
 */
import { Markdown } from './Markdown'
import { Spinner } from './Spinner'
import type { ChatMessage } from '../types'

export function Message({ message }: { message: ChatMessage }) {
  if (message.type === 'user') {
    return <div className="cc-msg cc-msg--user">{message.content}</div>
  }

  if (message.type === 'assistant') {
    return (
      <div className="cc-msg cc-msg--assistant">
        <Markdown>{message.content}</Markdown>
      </div>
    )
  }

  // tool-use
  return (
    <div className={`cc-tool-block cc-tool-block--${message.status}`}>
      <div className="cc-tool-block__header">
        <img src={`/assets/icons/${message.icon}.svg`} width={14} height={14} alt="" style={{ color: 'var(--icon-default)' }} />
        <span className="cc-tool-block__label">{message.toolName}</span>
        <span className="cc-tool-block__file">{message.filePath}</span>
        <span className={`cc-tool-block__status cc-tool-block__status--${message.status}`}>
          {message.status === 'done' ? (
            <img src="/assets/icons/check.svg" width={14} height={14} alt="" />
          ) : (
            <Spinner />
          )}
        </span>
      </div>
    </div>
  )
}
