import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { articles, architectures, books, papers, patterns, projects } from '@/content'
import { ArticleCard } from '@/components/common/ContentCards'
import { domainNavItems, getSection, navItems } from '@/data/navigation'
import { domainById, domains } from '@/data/domains'
import { topicsByDomain } from '@/data/topic-catalog'
import { difficultyLabels, difficultyOrder } from '@/data/taxonomy'
import type { Difficulty, SectionId } from '@/types/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const statusLabels: Record<string, string> = {
  published: '已发布', outline: '专题框架', draft: '草稿', planned: '规划中', 'needs-review': '待核实',
}

export function SectionPage() {
  const { sectionId: routeParam } = useParams<{ sectionId: string }>()
  const location = useLocation()
  // 静态领域路由（如 /protocols）没有 :sectionId 参数，用当前路径兜底解析。
  const rawId = routeParam || location.pathname.replace(/^\/+/, '')
  const section = getSection(rawId) ?? domainNavItems[0]
  const domain = domainById.get(section.id)
  const [tag, setTag] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [query, setQuery] = useState('')

  const sectionArticles = useMemo(() => articles.filter((a) => a.category === section.id), [section.id])
  const sectionTopics = useMemo(() => topicsByDomain(section.id), [section.id])
  const allTags = useMemo(() => [...new Set([...sectionArticles.flatMap((a) => a.tags), ...sectionTopics.flatMap((t) => t.tags)])].slice(0, 20), [sectionArticles, sectionTopics])
  const filteredArticles = useMemo(() => sectionArticles.filter((a) => {
    const matchTag = tag === 'all' || a.tags.includes(tag)
    const matchDifficulty = difficulty === 'all' || a.difficulty === difficulty
    const matchQuery = !query || `${a.title}${a.summary}${a.tags.join('')}`.toLowerCase().includes(query.toLowerCase())
    return matchTag && matchDifficulty && matchQuery
  }), [sectionArticles, tag, difficulty, query])
  const filteredTopics = useMemo(() => sectionTopics.filter((t) =>
    (tag === 'all' || t.tags.includes(tag)) &&
    (difficulty === 'all' || t.difficulty === difficulty) &&
    (!query || `${t.title}${t.titleEn}${t.description}`.toLowerCase().includes(query.toLowerCase())),
  ), [sectionTopics, tag, difficulty, query])

  useDocumentTitle(domain?.seoTitle ?? section?.name ?? '栏目', domain?.seoDescription ?? section?.description)

  return (
    <>
      <div className="page-header">
        <div className="container page-header-inner">
          <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>{domain?.no ?? '栏目'} {section.name}</span></nav>
          <span className="eyebrow">{domain?.en ?? section.en}</span>
          <h1>{section.name}</h1>
          <p>{domain?.summary ?? section.description}</p>
          {domain && (
            <div className="tag-row" style={{ marginTop: 16 }}>
              {domain.groups.map((g) => <span key={g} className="tag">{g}</span>)}
            </div>
          )}
        </div>
      </div>
      <div className="container section">
        {domain && (
          <div className="filter-bar">
            <Link className="arrow-link" to="/topic-catalog" style={{ margin: 0 }}>查看 58 项主题覆盖矩阵 →</Link>
            <Link className="arrow-link" to="/decision-guide" style={{ margin: 0 }}>架构决策工具 →</Link>
            <Link className="arrow-link" to="/blueprints" style={{ margin: 0 }}>项目工程模板 →</Link>
          </div>
        )}

        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="筛选本栏目专题与文章…" aria-label="筛选栏目内容" />
          <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="标签筛选">
            <option value="all">全部标签</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="难度筛选">
            <option value="all">全部难度</option>
            {difficultyOrder.map((d) => <option key={d} value={d}>{difficultyLabels[d]}</option>)}
          </select>
          <span className="text-small text-muted">{filteredTopics.length} 个专题 · {filteredArticles.length} 篇文章</span>
        </div>

        {filteredTopics.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, marginBottom: 14 }}>二级专题</h2>
            <div className="grid grid-3">
              {filteredTopics.map((t) => (
                <Link key={t.id} to={`/topic/${t.slug}`} className="card card-hover card-link">
                  <div className="card-meta" style={{ marginTop: 0, marginBottom: 8 }}>
                    <span className={`badge ${t.status === 'published' ? 'green' : t.status === 'needs-review' ? 'amber' : 'gray'}`}>{statusLabels[t.status]}</span>
                    <span>{difficultyLabels[t.difficulty]}</span>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <div className="card-meta">
                    <span>{t.articleIds.length} 篇文章</span><span>{t.diagramIds.length} 张图</span><span>{t.projectIds.length} 个项目</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 style={{ fontSize: 24, marginBottom: 14 }}>深度文章</h2>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-3">{filteredArticles.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 44 }}>
              <h3>本栏目文章将持续补充</h3>
              <p style={{ marginTop: 8 }}>可先阅读上方专题框架，或通过全站搜索访问相关内容。</p>
              <div className="tag-row" style={{ justifyContent: 'center', marginTop: 16 }}>
                {domains.slice(0, 6).map((d) => <Link key={d.id} className="tag" to={d.path}>{d.name}</Link>)}
              </div>
            </div>
          )}
        </section>

        {(section.id === 'architecture' || section.id === 'cases' || section.id === 'books' || section.id === 'papers' || section.id === 'patterns') && (
          <div className="card" style={{ marginTop: 28 }}>
            <h3>结构化浏览入口</h3>
            <div className="tag-row" style={{ marginTop: 12 }}>
              {section.id === 'architecture' && <Link className="tag" to="/architecture">参考架构方案（{architectures.length}）</Link>}
              {section.id === 'cases' && <Link className="tag" to="/open-source">开源项目中心（{projects.length}）</Link>}
              {section.id === 'books' && <Link className="tag" to="/research-center">研究中心</Link>}
              {section.id === 'papers' && <Link className="tag" to="/research-center">论文研究中心（{papers.length}）</Link>}
              {section.id === 'patterns' && <Link className="tag" to="/patterns">模式浏览器（{patterns.length}）</Link>}
              {navItems.slice(0, 4).map((n) => <Link key={n.id} className="tag" to={n.path}>{n.name}</Link>)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
