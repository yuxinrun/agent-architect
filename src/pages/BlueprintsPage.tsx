import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blueprints } from '@/data/blueprints'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function BlueprintsPage() {
  useDocumentTitle('Agent 项目工程模板', '10 类 Agent 项目的目录、接口、状态、工具、安全、测试与部署模板。')
  const [query, setQuery] = useState('')
  const filtered = blueprints.filter((b) => !query || `${b.name}${b.description}${b.tags.join('')}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>项目蓝图</span></nav>
        <span className="eyebrow">Agent Project Blueprint</span><h1>Agent 项目工程模板</h1>
        <p>每类模板给出目录结构、模块职责、核心接口、数据模型、状态管理、工具设计、错误处理、安全边界、测试与部署建议。模板是工程起点，不是银弹。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索模板…" aria-label="搜索模板" /><span className="text-small text-muted">{filtered.length} 个模板</span></div>
        <div className="grid" style={{ gap: 22 }}>
          {filtered.map((b) => (
            <section key={b.id} id={b.id} className="card" style={{ scrollMarginTop: 90 }}>
              <div className="card-meta" style={{ marginTop: 0, marginBottom: 10 }}><span className="badge">{b.tags.join(' · ')}</span><Link className="arrow-link" to={`/diagrams#${b.diagramId}`}>配套架构图 →</Link></div>
              <h2 style={{ fontSize: 24 }}>{b.name}</h2>
              <p style={{ marginTop: 8 }}>{b.description}</p>
              <div className="grid grid-2" style={{ marginTop: 18 }}>
                <div>
                  <h3 style={{ fontSize: 16 }}>项目目录</h3>
                  <pre className="tree-block">{b.tree.join('\n')}</pre>
                  <h3 style={{ fontSize: 16, marginTop: 14 }}>架构</h3><p className="text-small">{b.architecture}</p>
                  <h3 style={{ fontSize: 16, marginTop: 14 }}>模块职责</h3>
                  <div className="kv-list">{b.modules.map((m) => <div className="kv-row" key={m.name}><strong>{m.name}</strong><span>{m.duty}</span></div>)}</div>
                </div>
                <div>
                  <h3 style={{ fontSize: 16 }}>核心接口</h3><ul>{b.interfaces.map((x) => <li key={x}>{x}</li>)}</ul>
                  <h3 style={{ fontSize: 16, marginTop: 12 }}>数据模型</h3><ul>{b.dataModel.map((x) => <li key={x}>{x}</li>)}</ul>
                  <div className="kv-list" style={{ marginTop: 12 }}>
                    <div className="kv-row"><strong>状态管理</strong><span>{b.stateManagement}</span></div>
                    <div className="kv-row"><strong>工具设计</strong><span>{b.toolDesign}</span></div>
                    <div className="kv-row"><strong>错误处理</strong><span>{b.errorHandling}</span></div>
                    <div className="kv-row"><strong>安全边界</strong><span>{b.security}</span></div>
                    <div className="kv-row"><strong>测试方案</strong><span>{b.testing}</span></div>
                    <div className="kv-row"><strong>部署方案</strong><span>{b.deployment}</span></div>
                    <div className="kv-row"><strong>扩展建议</strong><span>{b.extension}</span></div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
