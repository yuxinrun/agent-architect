export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export function estimateReadingTime(content: string): number {
  const chars = content.replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / 400))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getExcerpt(markdown: string, max = 160): string {
  return markdown
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[|>`*_\[\]()#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}
