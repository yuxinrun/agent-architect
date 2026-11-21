import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { patterns, articles } from '@/content'
import { DiagramViewer } from '@/components/diagrams/DiagramViewer'
import { CodeBlock } from '@/components/common/CodeBlock'
import { diagrams } from '@/data/diagrams'
import { difficultyLabels, difficultyOrder } from '@/data/taxonomy'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Difficulty } from '@/types/content'

export function PatternsPage() {
  useDocumentTitle('Agent 设计模式', '按问题、模式、架构类型筛选，查看流程图、伪代码与工程代价。')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => [...new Set(patterns.map((p) => p.category))], [])
  const filtered = useMemo(() => patterns.filter((p) =>
    (category === 'all' || p.category === category) &&
    (difficulty === 'all' || p.difficulty === difficulty) &&
    (!query || `${p.name}${p.problem}${p.solution}${p.useCases.join('')}`.toLowerCase().includes(query.toLowerCase())),
  ), [category, difficulty, query])

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>设计模式</span></nav>
        <span className="eyebrow">Agent Design Patterns</span><h1>Agent 设计模式</h1>
        <p>模式不是口号。每种模式都说明执行流程、控制权归属、状态要求、适用边界、失败处理和工程代价。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索模式…" aria-label="搜索模式" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="按类别筛选"><option value="all">全部类别</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')} aria-label="按难度筛选"><option value="all">全部难度</option>{difficultyOrder.map((d) => <option key={d} value={d}>{difficultyLabels[d]}</option>)}</select>
          <span className="text-small text-muted">{filtered.length} 个模式</span>
        </div>

        <div className="grid" style={{ gap: 22 }}>
          {filtered.map((p) => (
            <article key={p.id} id={p.slug} className="card" style={{ scrollMarginTop: 90 }}>
              <div className="card-meta" style={{ marginTop: 0, marginBottom: 10 }}>
                <span className="badge">{p.category}</span><span className="badge gray">{difficultyLabels[p.difficulty]}</span>
              </div>
              <h2 style={{ fontSize: 26 }}>{p.name}</h2>
              <div className="kv-list" style={{ marginTop: 14 }}>
                <div className="kv-row"><strong>问题</strong><span>{p.problem}</span></div>
                <div className="kv-row"><strong>方案</strong><span>{p.solution}</span></div>
                <div className="kv-row"><strong>控制权</strong><span>{p.control}</span></div>
                <div className="kv-row"><strong>状态要求</strong><span>{p.state}</span></div>
                <div className="kv-row"><strong>权衡</strong><span>{p.tradeoffs}</span></div>
              </div>
              <div className="grid grid-2" style={{ marginTop: 18 }}>
                <div><h3 style={{ fontSize: 16 }}>执行流程</h3><ol>{p.workflow.map((w) => <li key={w}>{w}</li>)}</ol></div>
                <div>
                  <h3 style={{ fontSize: 16 }}>适用场景</h3><ul>{p.useCases.map((x) => <li key={x}>{x}</li>)}</ul>
                  <h3 style={{ fontSize: 16, marginTop: 12 }}>反模式</h3><ul>{p.antiPatterns.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
              {p.diagrams.map((id) => {
                const meta = diagrams.find((d) => d.id === id)
                return meta ? <DiagramViewer key={id} id={id} title={meta.title} description={meta.description} type={meta.type} /> : null
              })}
              {p.examples.map((ex) => <CodeBlock key={ex.title} code={ex.code} language={ex.language} title={ex.title} />)}
              <div className="tag-row" style={{ marginTop: 14 }}>
                {p.relatedArticles.map((id) => {
                  const a = articles.find((x) => x.id === id)
                  return a ? <Link key={id} className="tag" to={`/article/${a.slug}`}>{a.title}</Link> : null
                })}
                {p.references.map((ref) => ref.url && <a key={ref.title} className="tag" href={ref.url} target="_blank" rel="noreferrer">{ref.title} ↗</a>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
