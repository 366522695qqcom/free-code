import { useMemo } from 'react'
import { marked } from 'marked'

type Props = {
  children: string
}

export function Markdown({ children }: Props) {
  const html = useMemo(() => {
    return marked.parse(children)
  }, [children])

  return (
    <div
      className="cc-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
