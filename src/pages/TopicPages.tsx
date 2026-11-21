import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { articles, books, papers, projects } from '@/content'
import { domains, domainById } from '@/data/domains'
import { topics, topicBySlug } from '@/data/topic-catalog'
import { getTopicDetail } from '@/data/topic-details'
import { diagrams } from '@/data/diagrams'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { renderMarkdown } from '@/lib/markdown'
import type { TopicStatus } from '@/types/v2'

const statusLabels: Record<TopicStatus, string> = {
  published: '已发布', outline: '专题框架', draft: '草稿', planned: '规划中', 'needs-review': '待核实',
}
const statusClass: Record<TopicStatus, string> = {
  published: 'green', outline: 'gray', draft: 'gray', planned: 'gray', 'needs-review': 'amber',
}

export function TopicCatalogPage() {
  useDocumentTitle('主题覆盖矩阵', '58 项 Agent 技术主题的归类、状态与内容覆盖情况。')
  const [domain, setDomain] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [onlyGaps, setOnlyGaps] = useState(false)

  const filtered = useMemo(() => topics.filter((t) =>
    (domain === 'all' || t.categoryId === domain) &&
    (status === 'all' || t.status === status) &&
    (!query || `${t.title}${t.titleEn}${t.description}${t.tags.join('')}`.toLowerCase().includes(query.toLowerCase())) &&
    (!onlyGaps || t.status !== 'published' || t.articleIds.length === 0 || t.diagramIds.length === 0),
  ), [domain, status, query, onlyGaps])

  const counts = useMemo(() => ({
    published: topics.filter((t) => t.status === 'published').length,
    outline: topics.filter((t) => t.status === 'outline').length,
    needsReview: topics.filter((t) => t.status === 'needs-review').length,
    withArticles: topics.filter((t) => t.articleIds.length > 0).length,
    withDiagrams: topics.filter((t) => t.diagramIds.length > 0).length,
  }), [])

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>主题覆盖矩阵</span></nav>
        <span className="eyebrow">Topic Coverage Matrix</span><h1>Agent 技术主题覆盖矩阵</h1>
        <p>用户指定的 58 项主题逐项进入知识体系。状态如实标注：只有专题内容、资料引用和必要结构完整时才标记为“已发布”。</p>
      </div></div>
      <div className="container section">
        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <div className="card"><div className="section-index">TOTAL</div><h3>{topics.length}</h3><p>指定主题</p></div>
          <div className="card"><div className="section-index">PUBLISHED</div><h3>{counts.published}</h3><p>完整专题</p></div>
          <div className="card"><div className="section-index">OUTLINE</div><h3>{counts.outline}</h3><p>专题框架已建立</p></div>
          <div className="card"><div className="section-index">REVIEW</div><h3>{counts.needsReview}</h3><p>资料待核实</p></div>
        </div>

        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索主题…" aria-label="搜索主题" />
          <select value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="按领域筛选"><option value="all">全部一级领域</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.no} {d.name}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="按状态筛选"><option value="all">全部状态</option>{(Object.keys(statusLabels) as TopicStatus[]).map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</select>
          <button type="button" className={`filter-chip ${onlyGaps ? 'active' : ''}`} onClick={() => setOnlyGaps(!onlyGaps)}>只看缺口</button>
          <span className="text-small text-muted">{filtered.length} / {topics.length}</span>
        </div>

        <div className="matrix-wrap">
          <div className="matrix-head matrix-row">
            <span>主题</span><span>一级领域</span><span>状态</span><span>文章</span><span>图</span><span>项目</span><span>论文</span><span>参考</span>
          </div>
          {filtered.map((t) => {
            const d = domainById.get(t.categoryId)
            return (
              <div className="matrix-row" key={t.id}>
                <span><Link to={`/topic/${t.slug}`}>{t.title}</Link><small>{t.titleEn}</small></span>
                <span>{d ? `${d.no} ${d.name}` : t.categoryId}</span>
                <span><b className={`badge ${statusClass[t.status]}`}>{statusLabels[t.status]}</b></span>
                <span>{t.articleIds.length}</span><span>{t.diagramIds.length}</span><span>{t.projectIds.length}</span><span>{t.paperIds.length}</span><span>{t.references.length}</span>
              </div>
            )
          })}
        </div>
        <p className="text-small text-muted" style={{ marginTop: 12 }}>统计说明：当前 {counts.withArticles} 个主题有关联文章，{counts.withDiagrams} 个主题有关联架构图。数字为内容关联数量，不代表主题已完成。</p>
      </div>
    </>
  )
}

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = topicBySlug.get(slug ?? '')
  useDocumentTitle(topic?.title ?? '专题', topic?.description)

  if (!topic) return <div className="not-found"><h1>404</h1><p>专题不存在。</p><Link to="/topic-catalog">返回主题矩阵</Link></div>

  const domain = domainById.get(topic.categoryId)
  const detail = getTopicDetail(topic.slug)
  const deepDiveHtml = useMemo(() => detail ? renderMarkdown(detail.deepDive.join('\n\n')).html : '', [detail])
  const topicArticles = topic.articleIds.map((id) => articles.find((a) => a.id === id)).filter((a) => Boolean(a))
  const topicDiagrams = topic.diagramIds.map((id) => diagrams.find((d) => d.id === id)).filter((d) => Boolean(d))
  const topicProjects = topic.projectIds.map((id) => projects.find((p) => p.id === id)).filter((p) => Boolean(p))
  const topicPapers = topic.paperIds.map((id) => papers.find((p) => p.id === id)).filter((p) => Boolean(p))
  const topicBooks = topic.bookIds.map((id) => books.find((b) => b.id === id)).filter((b) => Boolean(b))
  const related = topic.relatedTopicIds.map((id) => topics.find((t) => t.id === id)).filter((t) => Boolean(t))

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span>{domain && <><Link to={domain.path}>{domain.name}</Link><span>/</span></>}<span>专题</span></nav>
        <span className="eyebrow">{topic.titleEn}</span>
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
        <div className="card-meta" style={{ marginTop: 14 }}>
          <b className={`badge ${statusClass[topic.status]}`}>{statusLabels[topic.status]}</b>
          <span>最后整理：{topic.lastVerifiedAt}</span><span>{topic.tags.join(' · ')}</span>
        </div>
      </div></div>
      <div className="container section">
        {topic.status !== 'published' && (
          <div className="card" style={{ borderColor: '#e5c07b', marginBottom: 24 }}>
            <strong>内容状态说明：</strong>当前专题已建立结构化框架，但尚未达到“已发布”标准。请将其作为学习路线与资料索引使用，关键结论需结合原始资料核实。
          </div>
        )}

        <section className="card">
          <h2>专题概览</h2>
          <p style={{ marginTop: 12 }}>{topic.overview}</p>
          <h3 style={{ fontSize: 17, marginTop: 22 }}>核心问题</h3>
          <ul>{topic.keyQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
          <h3 style={{ fontSize: 17, marginTop: 22 }}>主要技术路线</h3>
          <div className="tag-row">{topic.routes.map((r) => <span className="tag" key={r}>{r}</span>)}</div>
        </section>

        {detail && (
          <section className="card" style={{ marginTop: 18 }}>
            <h2>深度解析</h2>
            <div className="article-body" dangerouslySetInnerHTML={{ __html: deepDiveHtml }} />
          </section>
        )}

        {detail && detail.decisions.length > 0 && (
          <section className="card" style={{ marginTop: 18 }}>
            <h2>关键决策点</h2>
            <div className="decision-list" style={{ marginTop: 12 }}>
              {detail.decisions.map((d, idx) => (
                <div className="decision-item" key={idx}>
                  <div className="decision-q"><b>决策 {idx + 1}：</b>{d.question}</div>
                  <div className="decision-opts">选项：{d.options}</div>
                  <div className="decision-rec"><span className="badge green">建议</span> {d.recommendation}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {detail && detail.pitfalls.length > 0 && (
          <section className="card" style={{ marginTop: 18 }}>
            <h2>常见陷阱与修复</h2>
            <div className="table-scroll" style={{ marginTop: 12 }}>
              <table>
                <thead><tr><th>现象</th><th>根因</th><th>修复</th></tr></thead>
                <tbody>{detail.pitfalls.map((p, idx) => (
                  <tr key={idx}><td>{p.symptom}</td><td>{p.cause}</td><td>{p.fix}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        <section className="card" style={{ marginTop: 18 }}>
          <h2>学习路径</h2>
          <ol style={{ paddingLeft: 20, marginTop: 10 }}>{topic.learningPath.map((p) => <li key={p} style={{ margin: '8px 0' }}>{p}</li>)}</ol>
          {detail && detail.prerequisites.length > 0 && (
            <>
              <h3 style={{ fontSize: 17, marginTop: 22 }}>前置知识</h3>
              <div className="tag-row">{detail.prerequisites.map((p) => <span className="tag" key={p}>{p}</span>)}</div>
            </>
          )}
          {detail && detail.outcomes.length > 0 && (
            <>
              <h3 style={{ fontSize: 17, marginTop: 22 }}>掌握标准</h3>
              <ul>{detail.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          )}
        </section>

        {detail && detail.metrics.length > 0 && (
          <section className="card" style={{ marginTop: 18 }}>
            <h2>验收指标</h2>
            <div className="table-scroll" style={{ marginTop: 12 }}>
              <table>
                <thead><tr><th>指标</th><th>定义</th><th>良好标准</th></tr></thead>
                <tbody>{detail.metrics.map((m) => (
                  <tr key={m.name}><td><b>{m.name}</b></td><td>{m.definition}</td><td>{m.good}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        <div className="grid grid-3 topic-info-grid" style={{ marginTop: 18, alignItems: 'start' }}>
          <section className="card">
            <h2>内容覆盖</h2>
            <div className="kv-list" style={{ marginTop: 10 }}>
              <div className="kv-row"><strong>深度文章</strong><span>{topicArticles.length ? topicArticles.map((a) => <Link key={a!.id} className="arrow-link" style={{ display: 'block', marginTop: 4 }} to={`/article/${a!.slug}`}>{a!.title} →</Link>) : '待补充'}</span></div>
              <div className="kv-row"><strong>架构图</strong><span>{topicDiagrams.length ? topicDiagrams.map((d) => <Link key={d!.id} className="arrow-link" style={{ display: 'block', marginTop: 4 }} to={`/diagrams#${d!.id}`}>{d!.title} →</Link>) : '待补充'}</span></div>
              <div className="kv-row"><strong>开源项目</strong><span>{topicProjects.length ? topicProjects.map((p) => <Link key={p!.id} className="arrow-link" style={{ display: 'block', marginTop: 4 }} to={`/open-source#${p!.id}`}>{p!.name} →</Link>) : '待补充'}</span></div>
              <div className="kv-row"><strong>论文</strong><span>{topicPapers.length ? topicPapers.map((p) => <Link key={p!.id} className="arrow-link" style={{ display: 'block', marginTop: 4 }} to={`/research-center#${p!.id}`}>{p!.title} →</Link>) : '待补充'}</span></div>
              <div className="kv-row"><strong>书籍</strong><span>{topicBooks.length ? topicBooks.map((b) => <span key={b!.id}>{b!.title}</span>) : '待补充'}</span></div>
            </div>
          </section>
          <section className="card">
            <h2>参考资料</h2>
            <ul className="reference-list" style={{ marginTop: 10 }}>
              {topic.references.map((r) => <li key={r.title}>{r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a> : r.title}{r.publisher && ` · ${r.publisher}`}{r.verification === 'to-verify' && <span className="badge amber" style={{ marginLeft: 8 }}>待核实</span>}</li>)}
            </ul>
          </section>
          <section className="card">
            <h2>相关专题</h2>
            <div className="tag-row" style={{ marginTop: 12 }}>
              {related.length ? related.map((t) => <Link key={t!.id} className="tag" to={`/topic/${t!.slug}`}>{t!.title}</Link>) : <span className="text-muted">暂无</span>}
            </div>
            <Link className="arrow-link" to="/topic-catalog" style={{ display: 'inline-block', marginTop: 16 }}>返回主题矩阵 →</Link>
          </section>
        </div>
      </div>
    </>
  )
}
