export function highlightCodeLine(line: string): string {
  const escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/(\/\/.*$)/g, '<span class="tok-comment">$1</span>')
    .replace(/(&quot;|')(.*?)\1/g, '<span class="tok-string">$1$2$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|interface|type|import|from|await|async|new|class|def|in|not|None|True|False)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="tok-number">$1</span>')
}
