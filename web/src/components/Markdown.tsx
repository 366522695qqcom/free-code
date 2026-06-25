/**
 * Markdown 渲染组件
 * 借鉴 src/components/Markdown.tsx 的 marked.lexer + 缓存模式
 */
import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const renderCache = new Map<string, string>()

export function Markdown({ children }: { children: string }) {
  const html = useMemo(() => {
    const cached = renderCache.get(children)
    if (cached !== undefined) return cached
    const rendered = marked.parse(children, { async: false }) as string
    if (renderCache.size > 200) {
      const firstKey = renderCache.keys().next().value
      if (firstKey) renderCache.delete(firstKey)
    }
    renderCache.set(children, rendered)
    return rendered
  }, [children])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
