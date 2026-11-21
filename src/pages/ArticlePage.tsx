import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articles, getArticle, getRelatedArticles, patterns, projects } from '@/content'
import { DiagramViewer } from '@/components/diagrams/DiagramViewer'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useReadingProgress } from '@/hooks/useReadingProgress'
import { favoritesStore, readingListStore, useFavorites, useReadingList } from '@/lib/storage'
import { renderMarkdown } from '@/lib/markdown'
import { formatDate } from '@/lib/utils'
import { getSection } from '@/data/navigation'
import { difficultyLabels } from '@/data/taxonomy'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = getArticle(slug ?? '')
  const [activeHeading, setActiveHeading] = useState('')
  const favorites = useFavorites()
  const reading = useReadingList()
  const progress = useReadingProgress()

  const rendered = useMemo(() => article ? renderMarkdown(article.content) : null, [article])
  useDocumentTitle(article?.seoTitle ?? article?.title, article?.seoDescription ?? article?.summary)

  useEffect(() => {
    if (!article || !rendered) return
    const headings = rendered.headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActiveHeading(visible[0].target.id)
    }, { rootMargin: '-80px 0px -70% 0px' })
    headings.forEach((heading) => observer.observe(heading))

    const body = document.querySelector('.article-body')
    const onCopy = (event: Event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-code-copy]')
      if (!button) return
      const code = button.closest('.code-block')?.querySelector('code')?.textContent
      if (!code) return
      navigator.clipboard?.writeText(code).then(() => {
        button.textContent = '已复制'
        window.setTimeout(() => { button.textContent = '复制' }, 1600)
      }).catch(() => { button.textContent = '复制失败' })
    }
    body?.addEventListener('click', onCopy)

    return () => {
      observer.disconnect()
      body?.removeEventListener('click', onCopy)
    }
  }, [article, rendered])

  if (!article || !rendered) {
    return <div className="not-found"><h1>404</h1><p>文章不存在。</p><Link to="/">返回首页</Link></div>
  }

  const section = getSection(article.category)
  const related = getRelatedArticles(article)
  const index = articles.findIndex((a) => a.id === article.id)
  const prev = articles[index - 1]
  const next = articles[index + 1]
  const isFavorite = favorites.includes(article.id)
  const isReading = reading.includes(article.id)

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="container section">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><Link to={section?.path ?? '/'}>{section?.name ?? article.category}</Link><span>/</span><span>文章详情</span></nav>
        <div className="article-layout" style={{ marginTop: 26 }}>
          <aside className="toc" aria-label="文章目录">
            <div className="toc-title">文章目录</div>
            {rendered.headings.map((h) => (
              <a key={h.id} href={`#${h.id}`} className={`lvl-${h.level} ${activeHeading === h.id ? 'active' : ''}`}>{h.text}</a>
            ))}
          </aside>

          <article className="article-main">
            <div className="badge">{section?.name ?? article.category}</div>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-summary">{article.summary}</p>
            <div className="article-info">
              <span>{article.author}</span><span>发布于 {formatDate(article.publishedAt)}</span><span>更新于 {formatDate(article.updatedAt)}</span>
              <span>{article.readingTime} 分钟阅读</span><span>{difficultyLabels[article.difficulty]}</span>
            </div>
            <div className="tag-row">{article.tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}</div>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: rendered.html }} />

            {article.diagrams.length > 0 && (
              <div>
                <h2>配套架构图</h2>
                {article.diagrams.map((id) => {
                  const meta = getDiagramMeta(id)
                  return <DiagramViewer key={id} id={id} title={meta.title} description={meta.description} type={meta.type} />
                })}
              </div>
            )}

            <div className="article-footer">
              <h2>参考资料</h2>
              <ul className="reference-list">
                {article.references.map((ref) => (
                  <li key={ref.title}>
                    {ref.url ? <a href={ref.url} target="_blank" rel="noreferrer">{ref.title} ↗</a> : ref.title}
                    {ref.publisher && ` · ${ref.publisher}`}{ref.date && ` · ${ref.date}`}
                    {ref.verification === 'to-verify' && <span className="badge amber" style={{ marginLeft: 8 }}>待核实</span>}
                  </li>
                ))}
              </ul>
              <div className="article-nav">
                {prev ? <Link className="card card-hover" to={`/article/${prev.slug}`}><span className="text-small text-muted">上一篇</span><h3 style={{ marginTop: 6 }}>{prev.title}</h3></Link> : <div />}
                {next && <Link className="card card-hover" to={`/article/${next.slug}`}><span className="text-small text-muted">下一篇</span><h3 style={{ marginTop: 6 }}>{next.title}</h3></Link>}
              </div>
              {related.length > 0 && (
                <div style={{ marginTop: 32 }}>
                  <h2>相关文章</h2>
                  <div className="grid grid-2" style={{ marginTop: 14 }}>
                    {related.map((a) => <Link key={a.id} className="card card-hover" to={`/article/${a.slug}`}><h3>{a.title}</h3><p className="text-small">{a.summary.slice(0, 90)}…</p></Link>)}
                  </div>
                </div>
              )}
              {article.relatedPatterns.length > 0 && (
                <div style={{ marginTop: 26 }}>
                  <h2>相关模式</h2>
                  <div className="tag-row" style={{ marginTop: 12 }}>
                    {article.relatedPatterns.map((id) => {
                      const p = patterns.find((x) => x.id === id)
                      return p ? <Link key={id} className="tag" to={`/patterns#${p.slug}`}>{p.name}</Link> : null
                    })}
                  </div>
                </div>
              )}
              {article.relatedProjects.length > 0 && (
                <div style={{ marginTop: 22 }}>
                  <h2>相关项目</h2>
                  <div className="tag-row" style={{ marginTop: 12 }}>
                    {article.relatedProjects.map((id) => {
                      const p = projects.find((x) => x.id === id)
                      return p ? <Link key={id} className="tag" to={`/cases#${p.id}`}>{p.name}</Link> : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </article>

          <aside className="article-side" aria-label="文章操作">
            <button type="button" className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`} onClick={() => favoritesStore.toggle(article.id)}>
              {isFavorite ? '★ 已收藏' : '☆ 收藏文章'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => readingListStore.toggle(article.id)}>
              {isReading ? '✓ 已在阅读清单' : '+ 加入阅读清单'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigator.clipboard?.writeText(window.location.href)}>复制文章链接</button>
            <div className="card text-small">
              <strong>阅读进度</strong>
              <p className="text-muted" style={{ marginTop: 4 }}>{progress}%</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function getDiagramMeta(id: string) {
  const found = diagramsData.find((d) => d.id === id)
  return found ?? { title: id, description: '架构图', type: '参考架构' }
}

import { diagrams as diagramsData } from '@/data/diagrams'
