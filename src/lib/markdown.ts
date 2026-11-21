import { slugify } from './utils'
import { highlightCodeLine } from './highlight'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
}

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

export function renderMarkdown(markdown: string): { html: string; headings: MarkdownHeading[] } {
  const lines = markdown.trim().split('\n')
  const headings: MarkdownHeading[] = []
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    const heading = line.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      const text = heading[2].trim()
      const id = slugify(text)
      headings.push({ id, text, level })
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`)
      i++
      continue
    }

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text'
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      i++
      const highlighted = code.map(highlightCodeLine).join('\n')
      out.push(`<div class="code-block"><div class="code-toolbar"><span class="code-language">${escapeHtml(lang)}</span><button type="button" class="code-copy" data-code-copy>复制</button></div><pre><code>${highlighted}</code></pre></div>`)
      continue
    }

    if (line.trim().startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().slice(1, -1).split('|').map((c) => c.trim())
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells)
        i++
      }
      if (rows.length) {
        const head = rows[0].map((c) => `<th>${inline(c)}</th>`).join('')
        const body = rows.slice(1).map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
        out.push(`<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`)
      }
      continue
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`)
        i++
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    if (line.startsWith('>')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) { quote.push(lines[i].replace(/^>\s?/, '')); i++ }
      out.push(`<blockquote>${quote.map((q) => inline(q)).join('<br>')}</blockquote>`)
      continue
    }

    const para: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() && !/^(#{2,4}\s|```|\s*[-*]\s|\s*\d+\.\s|>|\|)/.test(lines[i])) {
      para.push(lines[i]); i++
    }
    out.push(`<p>${inline(para.join(' '))}</p>`)
  }

  return { html: out.join('\n'), headings }
}
