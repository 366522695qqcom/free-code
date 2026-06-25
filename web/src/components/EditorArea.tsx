/**
 * EditorArea 编辑器区域
 * 借鉴 src/components/HighlightedCode.tsx 使用 highlight.js
 */
import { useMemo } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/github-dark.css'
import { EDITOR_TABS, EDITOR_CODE } from '../types'

hljs.registerLanguage('typescript', typescript)

function highlightCode(code: string, language: string): string {
  try {
    const result = hljs.highlight(code, { language })
    return result.value
  } catch {
    return code
  }
}

export function EditorArea() {
  const highlighted = useMemo(() => highlightCode(EDITOR_CODE, 'typescript'), [])
  const lines = useMemo(() => EDITOR_CODE.split('\n'), [])

  return (
    <div className="cc-editor-area">
      <div className="ds-editortabs">
        {EDITOR_TABS.map((tab, i) => (
          <div key={i} className={`ds-editortab ${tab.active ? 'is-active' : ''}`}>
            <span className="ic">
              <img src={`/assets/icons/${tab.icon}.svg`} width={14} height={14} alt="" style={{ color: tab.iconColor }} />
            </span>
            <span>{tab.name}</span>
            <span className="close">
              <img src="/assets/icons/x.svg" width={12} height={12} alt="" />
            </span>
          </div>
        ))}
        <div className="ds-editortabs__spacer" />
        <div className="ds-editortabs__actions">
          <button title="Split editor">
            <img src="/assets/icons/columns.svg" width={16} height={16} alt="" />
          </button>
          <button title="More actions">
            <img src="/assets/icons/more-h.svg" width={16} height={16} alt="" />
          </button>
        </div>
      </div>

      <div className="cc-editor-content">
        <div className="cc-editor-gutter">
          {lines.map((_, i) => (
            <div key={i} className={`line-num ${i === 11 ? 'active-line' : ''}`}>{i + 1}</div>
          ))}
        </div>
        <div className="cc-editor-code">
          <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
      </div>
    </div>
  )
}
