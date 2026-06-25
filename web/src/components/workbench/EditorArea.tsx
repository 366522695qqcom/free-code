import type React from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../../state/WorkspaceState.js'

const SAMPLE_CODE_LINES = [
  { content: '<span class="syn-import">import</span> <span class="syn-punctuation">{</span> <span class="syn-type">useState</span> <span class="syn-punctuation">}</span> <span class="syn-from">from</span> <span class="syn-string">\'react\'</span><span class="syn-punctuation">;</span>', active: false },
  { content: '<span class="syn-import">import</span> <span class="syn-type">Header</span> <span class="syn-from">from</span> <span class="syn-string">\'./components/Header\'</span><span class="syn-punctuation">;</span>', active: false },
  { content: '<span class="syn-import">import</span> <span class="syn-type">Sidebar</span> <span class="syn-from">from</span> <span class="syn-string">\'./components/Sidebar\'</span><span class="syn-punctuation">;</span>', active: false },
  { content: '', active: false },
  { content: '<span class="syn-export">export</span> <span class="syn-keyword">function</span> <span class="syn-function">App</span><span class="syn-punctuation">()</span> <span class="syn-punctuation">{</span>', active: false },
  { content: '  <span class="syn-keyword">const</span> <span class="syn-punctuation">[</span><span class="syn-parameter">theme</span><span class="syn-punctuation">,</span> <span class="syn-function">setTheme</span><span class="syn-punctuation">]</span> <span class="syn-operator">=</span> <span class="syn-function">useState</span><span class="syn-punctuation">(</span><span class="syn-string">\'dark\'</span><span class="syn-punctuation">);</span>', active: false },
  { content: '', active: false },
  { content: '  <span class="syn-keyword">return</span> <span class="syn-punctuation">(</span>', active: false },
  { content: '    <span class="syn-tag">&lt;div</span> <span class="syn-attribute">className</span><span class="syn-operator">=</span><span class="syn-punctuation">{</span><span class="syn-string">`app ${</span><span class="syn-parameter">theme</span><span class="syn-string">}`</span><span class="syn-punctuation">}</span><span class="syn-tag">&gt;</span>', active: false },
  { content: '      <span class="syn-tag">&lt;Header</span>', active: false },
  { content: '        <span class="syn-attribute">theme</span><span class="syn-operator">=</span><span class="syn-punctuation">{</span><span class="syn-parameter">theme</span><span class="syn-punctuation">}</span>', active: false },
  { content: '        <span class="syn-attribute">onToggle</span><span class="syn-operator">=</span><span class="syn-punctuation">{()</span> <span class="syn-keyword">=&gt;</span>', active: true },
  { content: '          <span class="syn-function">setTheme</span><span class="syn-punctuation">(</span><span class="syn-parameter">t</span> <span class="syn-keyword">=&gt;</span> <span class="syn-parameter">t</span> <span class="syn-operator">===</span> <span class="syn-string">\'dark\'</span> <span class="syn-operator">?</span> <span class="syn-string">\'light\'</span> <span class="syn-operator">:</span> <span class="syn-string">\'dark\'</span><span class="syn-punctuation">)</span>', active: false },
  { content: '        <span class="syn-punctuation">}</span>', active: false },
  { content: '      <span class="syn-tag">/&gt;</span>', active: false },
  { content: '      <span class="syn-tag">&lt;Sidebar /&gt;</span>', active: false },
  { content: '    <span class="syn-tag">&lt;/div&gt;</span>', active: false },
  { content: '  <span class="syn-punctuation">);</span>', active: false },
  { content: '<span class="syn-punctuation">}</span>', active: false },
]

const TAB_ICONS: Record<string, { src: string; color: string }> = {
  'jwt.ts': { src: 'file-text.svg', color: 'var(--accent-blue)' },
  'middleware.ts': { src: 'file-text.svg', color: 'var(--accent-blue)' },
  'session.ts': { src: 'file-text.svg', color: 'var(--accent-blue)' },
}

export function EditorArea() {
  const editorTabs = useWorkspaceState(s => s.editorTabs)
  const activeEditorTab = useWorkspaceState(s => s.activeEditorTab)
  const setState = useSetWorkspaceState()

  const handleTabClick = (tabId: string) => {
    setState(prev => ({
      ...prev,
      activeEditorTab: tabId,
      editorTabs: prev.editorTabs.map(t => ({ ...t, isActive: t.id === tabId })),
    }))
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    setState(prev => {
      const newTabs = prev.editorTabs.filter(t => t.id !== tabId)
      const newActive = prev.activeEditorTab === tabId
        ? (newTabs[0]?.id ?? null)
        : prev.activeEditorTab
      return {
        ...prev,
        editorTabs: newTabs.map((t, _i) => ({ ...t, isActive: t.id === newActive })),
        activeEditorTab: newActive,
      }
    })
  }

  return (
    <div className="cc-editor-area" style={{ gridColumn: 3, gridRow: 2, display: 'flex', flexDirection: 'column', background: 'var(--bg-base-default)', overflow: 'hidden' }}>
      <div className="ds-editortabs">
        {editorTabs.map(tab => {
          const iconInfo = TAB_ICONS[tab.name] ?? { src: 'file.svg', color: 'var(--code-constant)' }
          return (
            <div
              key={tab.id}
              className={`ds-editortab${tab.id === activeEditorTab ? ' is-active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="ic">
                <img src={`/assets/icons/${iconInfo.src}`} width={14} height={14} alt="" style={{ color: iconInfo.color }} />
              </span>
              <span>{tab.name}</span>
              <span className="close" onClick={e => handleTabClose(e, tab.id)}>
                <img src="/assets/icons/x.svg" width={12} height={12} alt="" />
              </span>
            </div>
          )
        })}
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
          {SAMPLE_CODE_LINES.map((_, i) => (
            <div key={i} className={`line-num${_.active ? ' active-line' : ''}`}>{i + 1}</div>
          ))}
        </div>
        <div className="cc-editor-code">
          {SAMPLE_CODE_LINES.map((line, i) => (
            <span
              key={i}
              className={`code-line${line.active ? ' active-line' : ''}`}
              dangerouslySetInnerHTML={{ __html: line.content || '&nbsp;' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
