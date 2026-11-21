import { useState } from 'react'
import { Link } from 'react-router-dom'
import { diagrams } from '@/data/diagrams'
import { ArchitectureDiagram } from '@/components/diagrams/ArchitectureDiagram'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function DiagramsPage() {
  useDocumentTitle('Agent 架构图谱', '25 张原创 SVG：概念模型、参考架构与图例说明。')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const filtered = diagrams.filter((d) => (type === 'all' || d.type === type) && (!query || `${d.title}${d.description}${d.tags.join('')}`.includes(query)))

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>架构图谱</span></nav>
        <span className="eyebrow">Architecture Diagrams</span><h1>Agent 架构图谱</h1>
        <p>图表是核心内容而非装饰。每张图区分概念模型、参考架构与特定项目实现，并标注控制流、数据流与反馈关系。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索图谱…" aria-label="搜索图谱" />
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="图类型筛选"><option value="all">全部类型</option><option>概念模型</option><option>参考架构</option><option>特定项目实现</option></select>
          <span className="text-small text-muted">{filtered.length} 张</span>
        </div>
        <div className="grid" style={{ gap: 22 }}>
          {filtered.map((d) => (
            <section key={d.id} id={d.id} className="card" style={{ scrollMarginTop: 90 }}>
              <div className="card-meta" style={{ marginTop: 0, marginBottom: 8 }}><span className="badge">{d.type}</span><span>{d.tags.join(' · ')}</span></div>
              <h2 style={{ fontSize: 21 }}>{d.title}</h2>
              <p className="text-small text-muted" style={{ marginTop: 6 }}>{d.description}</p>
              <div className="diagram-scroll" style={{ marginTop: 14 }}><ArchitectureDiagram id={d.id} /></div>
              <p className="text-small text-muted" style={{ marginTop: 8 }}>实线表示控制流或数据流；虚线表示反馈和状态关系。移动端可横向滚动查看。</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
