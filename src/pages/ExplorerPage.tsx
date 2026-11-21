import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArchitectureDiagram } from '@/components/diagrams/ArchitectureDiagram'
import { articles } from '@/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const modules = [
  { id: 'core', name: 'Agent Core', role: '维护目标与决策循环', io: '输入：任务、观察 / 输出：动作候选', deps: 'Planner、Context Manager、State Store', article: 'art-agent-architecture-map' },
  { id: 'planner', name: 'Planner', role: '目标分解、动作选择与重规划', io: '输入：目标、约束、反馈 / 输出：结构化计划', deps: 'Context Manager、State Store', article: 'art-planning-fundamentals' },
  { id: 'memory', name: 'Memory', role: '跨步骤与跨会话的信息持久化', io: '输入：事件、事实 / 输出：检索结果', deps: 'Context Manager、Guardrails', article: 'art-memory-fundamentals' },
  { id: 'tools', name: 'Tool Registry', role: '工具 schema、权限、版本与执行器注册', io: '输入：工具调用 / 输出：标准化结果', deps: 'Guardrails、Executor', article: 'art-tool-system' },
  { id: 'context', name: 'Context Manager', role: '上下文选择、压缩、优先级与组装', io: '输入：多源信息 / 输出：ContextSnapshot', deps: 'Memory、Planner、Knowledge Base', article: 'art-context-engineering' },
  { id: 'state', name: 'State Store', role: '任务状态、事件日志与检查点', io: '输入：状态事件 / 输出：状态视图', deps: 'Runtime、Observability', article: 'art-agent-state-lifecycle' },
  { id: 'runtime', name: 'Runtime', role: '调度、并发、取消、恢复与隔离', io: '输入：任务 / 输出：执行结果', deps: 'State Store、Tool Registry', article: 'art-durable-execution' },
  { id: 'guard', name: 'Guardrails', role: '策略校验、风险分级与审批门控', io: '输入：动作 / 输出：允许或拒绝', deps: 'IAM、Tool Registry', article: 'art-agent-security' },
  { id: 'obs', name: 'Observability', role: 'Trace、Metric、Log 与轨迹回放', io: '输入：运行事件 / 输出：看板与告警', deps: '所有组件', article: 'art-agent-evaluation' },
]

export function ExplorerPage() {
  useDocumentTitle('Agent 架构探索器', '点击模块查看职责、输入输出、依赖关系和相关文章。')
  const [selected, setSelected] = useState(modules[0])
  const [view, setView] = useState<'single' | 'multi'>('single')
  const related = articles.find((a) => a.id === selected.article)

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>架构探索器</span></nav>
        <span className="eyebrow">Agent Architecture Explorer</span><h1>架构探索器</h1>
        <p>点击模块查看边界信息。切换单 Agent / Multi-Agent 视图，理解模块关系如何随架构变化。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <button type="button" className={`filter-chip ${view === 'single' ? 'active' : ''}`} onClick={() => setView('single')}>单 Agent 视图</button>
          <button type="button" className={`filter-chip ${view === 'multi' ? 'active' : ''}`} onClick={() => setView('multi')}>Multi-Agent 视图</button>
        </div>
        <div className="explorer">
          <div className="module-list">
            {modules.map((m) => (
              <button key={m.id} type="button" className={`module-btn ${selected.id === m.id ? 'active' : ''}`} onClick={() => setSelected(m)}>
                <strong>{m.name}</strong><span>{m.role}</span>
              </button>
            ))}
          </div>
          <div>
            <div className="card module-detail">
              <div className="badge">模块详情</div>
              <h3 style={{ marginTop: 12 }}>{selected.name}</h3>
              <p>{selected.role}</p>
              <div className="kv-list">
                <div className="kv-row"><strong>输入输出</strong><span>{selected.io}</span></div>
                <div className="kv-row"><strong>依赖关系</strong><span>{selected.deps}</span></div>
                <div className="kv-row"><strong>视图</strong><span>{view === 'single' ? '单 Agent：核心循环与工具执行' : '多 Agent：Supervisor 协调多个专业 Agent，共享状态与工具'}</span></div>
              </div>
              {related && <Link className="arrow-link" to={`/article/${related.slug}`}>阅读相关深度文章：{related.title} →</Link>}
            </div>
            <div style={{ marginTop: 18 }}>
              <ArchitectureDiagram id={view === 'single' ? 'agent-overview' : 'supervisor-architecture'} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
