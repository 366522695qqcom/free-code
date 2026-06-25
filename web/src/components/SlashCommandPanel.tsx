/**
 * SlashCommandPanel 命令面板
 * 从设计稿 workspace.html 转换
 * 借鉴 src/hooks/useTextInput.ts 的键盘映射
 */
import { useSlashCommand } from '../hooks/useSlashCommand'

export function SlashCommandPanel() {
  const { filteredCommands, highlightIndex, selectCommand } = useSlashCommand()

  return (
    <div className="cc-slash-panel is-visible" id="slashPanel">
      <div className="cc-slash-panel__header">
        <span style={{ fontSize: 'var(--body-xs-font-size)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>命令</span>
      </div>
      {filteredCommands.map((cmd, i) => (
        <div key={cmd.command}>
          {i > 0 && SLASH_DIVIDER_INDEX.has(i) && <div className="cc-slash-panel__divider" />}
          <div
            className={`cc-slash-panel__item ${i === highlightIndex ? 'is-highlighted' : ''}`}
            data-command={cmd.command}
            onClick={() => selectCommand(cmd)}
            onMouseEnter={() => {
              /* hover 高亮由 CSS 处理 */
            }}
          >
            <img src={`/assets/icons/${cmd.icon}.svg`} width={14} height={14} alt="" style={{ color: 'var(--icon-secondary)' }} />
            <div className="cc-slash-panel__info">
              <span className="cc-slash-panel__name">{cmd.name}</span>
              <span className="cc-slash-panel__desc">{cmd.desc}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** /help 后插入分隔线 */
const SLASH_DIVIDER_INDEX = new Set([6])
