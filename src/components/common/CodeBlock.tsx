import { useState } from 'react'
import { highlightCodeLine } from '@/lib/highlight'

export function CodeBlock({ code, language = 'text', title }: { code: string; language?: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-language">{language}</span>
        {title && <span className="code-title">{title}</span>}
        <button type="button" onClick={copy} className="code-copy" aria-label="复制代码">
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre><code dangerouslySetInnerHTML={{ __html: code.split('\n').map(highlightCodeLine).join('\n') }} /></pre>
    </div>
  )
}
