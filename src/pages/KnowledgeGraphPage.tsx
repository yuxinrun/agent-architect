import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { kgNodes, kgRelations, kgNodeTypes, kgNodeById, relationsOf } from '@/data/knowledge-graph'
import { domains } from '@/data/domains'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { KGNode, KGRelationType } from '@/types/v2'

const typeColors: Record<string, string> = {
  Concept: '#2463EB', Architecture: '#1748B8', DesignPattern: '#7A5AD6', Mechanism: '#159C7B',
  Framework: '#3D7DE0', Protocol: '#0E7490', Component: '#536B82', Tool: '#D97706',
  Project: '#B45309', Paper: '#D64545', Book: '#9B2020', Application: '#2B9E5F',
  EngineeringPractice: '#2463EB', SecurityControl: '#DC2626', EvaluationMetric: '#0891B2',
}

export function KnowledgeGraphPage() {
  useDocumentTitle('Agent 知识图谱 V2', '本地 JSON 数据驱动的 15 类节点、12 类关系知识图谱。')
  const [type, setType] = useState('all')
  const [domain, setDomain] = useState('all')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<KGNode | null>(null)
  const [relationType, setRelationType] = useState<KGRelationType | 'all'>('all')

  const visibleNodes = useMemo(() => kgNodes.filter((n) =>
    (type === 'all' || n.type === type) &&
    (domain === 'all' || n.domainId === domain) &&
    (!query || `${n.label}${n.summary}${n.type}`.toLowerCase().includes(query.toLowerCase())),
  ), [type, domain, query])
  const visibleIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes])
  const visibleRelations = useMemo(() => kgRelations.filter((r) =>
    visibleIds.has(r.source) && visibleIds.has(r.target) && (relationType === 'all' || r.type === relationType),
  ), [visibleIds, relationType])
  const nodeRelations = active ? relationsOf(active.id) : []

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>知识图谱</span></nav>
        <span className="eyebrow">Agent Knowledge Graph V2</span><h1>Agent 技术知识图谱</h1>
        <p>基于本地 JSON 的 15 类节点与 12 类关系。支持节点类型筛选、领域筛选、搜索、关系类型过滤与详情查看，不引入图数据库。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索节点…" aria-label="搜索节点" />
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="按节点类型筛选"><option value="all">全部节点类型</option>{kgNodeTypes.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} aria-label="按领域筛选"><option value="all">全部一级领域</option>{domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select value={relationType} onChange={(e) => setRelationType(e.target.value as KGRelationType | 'all')} aria-label="按关系类型筛选"><option value="all">全部关系</option>{[...new Set(kgRelations.map((r) => r.type))].map((r) => <option key={r}>{r}</option>)}</select>
          <span className="text-small text-muted">{visibleNodes.length} 节点 · {visibleRelations.length} 关系</span>
        </div>
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="kg-canvas">
            <svg viewBox="0 0 1260 980" role="img" aria-label="Agent 技术知识图谱">
              <rect width="1260" height="980" fill="#fff" />
              {visibleRelations.map((r, i) => {
                const a = kgNodeById.get(r.source); const b = kgNodeById.get(r.target)
                if (!a || !b) return null
                return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#CBD5E1" strokeWidth="1.5" /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} textAnchor="middle" className="kg-edge-label">{r.type}</text></g>
              })}
              {visibleNodes.map((node) => (
                <g key={node.id} className="kg-node" onClick={() => setActive(node)} onKeyDown={(e) => e.key === 'Enter' && setActive(node)} tabIndex={0} role="button" aria-label={node.label}>
                  <circle cx={node.x} cy={node.y} r="27" fill={typeColors[node.type] ?? '#536B82'} opacity={active?.id === node.id ? 1 : 0.88} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#fff">{node.label.slice(0, 7)}</text>
                </g>
              ))}
            </svg>
          </div>
          <div>
            <div className="card">
              <h3>{active ? active.label : '选择一个节点'}</h3>
              {active ? (
                <>
                  <p style={{ marginTop: 8 }}><b>类型：</b>{active.type} · <b>领域：</b>{active.domainId}</p>
                  <p className="text-small" style={{ marginTop: 8 }}>{active.summary}</p>
                  <Link className="arrow-link" to={active.href}>打开相关内容 →</Link>
                  <h4 style={{ fontSize: 15, marginTop: 18 }}>关联关系</h4>
                  <div className="kv-list">
                    {nodeRelations.map((r, i) => {
                      const otherId = r.source === active.id ? r.target : r.source
                      const other = kgNodeById.get(otherId)
                      return <div className="kv-row" key={`${r.source}-${r.target}-${i}`}><strong>{r.type}</strong><span>{r.source === active.id ? '→ ' : '← '}{other?.label ?? otherId} · {r.label}</span></div>
                    })}
                  </div>
                </>
              ) : <p style={{ marginTop: 8 }}>点击左侧节点查看类型、领域、摘要与关联关系。手机端可横向滚动图谱。</p>}
            </div>
            <div className="card" style={{ marginTop: 18 }}>
              <h3>节点类型图例</h3>
              <div className="tag-row" style={{ marginTop: 12 }}>
                {kgNodeTypes.map((t) => <span className="tag" key={t}><i className="legend-dot" style={{ background: typeColors[t] }} />{t}</span>)}
              </div>
              <p className="text-small text-muted" style={{ marginTop: 14 }}>数据源：<code>src/data/knowledge-graph.json</code>。关系使用稳定 ID，不通过标题字符串匹配。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
