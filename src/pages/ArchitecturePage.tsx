import { Link } from 'react-router-dom'
import { architectures, articles } from '@/content'
import { DiagramViewer } from '@/components/diagrams/DiagramViewer'
import { ArticleCard } from '@/components/common/ContentCards'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { diagrams } from '@/data/diagrams'
import { difficultyLabels } from '@/data/taxonomy'
import { topicsByDomain } from '@/data/topic-catalog'
import { domainById } from '@/data/domains'

export function ArchitecturePage() {
  const domain = domainById.get('architecture')
  const domainTopics = topicsByDomain('architecture')
  useDocumentTitle(domain?.seoTitle ?? 'Agent 整体架构', domain?.seoDescription)

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>整体架构</span></nav>
        <span className="eyebrow">Agent Architecture</span><h1>Agent 整体架构</h1>
        <p>每种架构都必须回答目标、场景、模块职责、依赖、控制流、数据流、状态流转、优势缺点、复杂度、失败模式与实现建议。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <Link className="arrow-link" to="/topic-catalog" style={{ margin: 0 }}>查看主题覆盖矩阵 →</Link>
          <Link className="arrow-link" to="/decision-guide" style={{ margin: 0 }}>架构决策工具 →</Link>
          <Link className="arrow-link" to="/blueprints" style={{ margin: 0 }}>项目工程模板 →</Link>
          <span className="text-small text-muted">一级领域：{domain?.no} {domain?.en}</span>
        </div>
        <div className="section-heading"><div><span className="eyebrow">Architecture Topics</span><h2>架构专题</h2><p>本领域的二级专题入口，进入后可查看文章、图谱、项目与参考资料的关联。</p></div></div>
        <div className="grid grid-3" style={{ marginBottom: 36 }}>
          {domainTopics.map((t) => <Link key={t.id} to={`/topic/${t.slug}`} className="card card-hover card-link"><div className="badge gray">{t.status}</div><h3 style={{ marginTop: 10 }}>{t.title}</h3><p>{t.description}</p></Link>)}
        </div>
        <div className="section-heading"><div><span className="eyebrow">Reference Architectures</span><h2>架构方案库</h2><p>以下为概念模型或参考架构，不代表某个开源项目的真实实现。</p></div></div>
        <div className="grid" style={{ gap: 22 }}>
          {architectures.map((a) => {
            const meta = diagrams.find((d) => d.id === a.diagram)
            return (
              <section key={a.id} id={a.slug} className="card" style={{ scrollMarginTop: 90 }}>
                <div className="card-meta" style={{ marginTop: 0, marginBottom: 10 }}>
                  <span className="badge">{difficultyLabels[a.difficulty]}</span><span>复杂度：{a.complexity}</span><span>成本：{a.cost}</span>
                </div>
                <h2 style={{ fontSize: 24 }}>{a.name}</h2>
                <p style={{ marginTop: 8 }}>{a.goal}</p>
                <div className="grid grid-2" style={{ marginTop: 18 }}>
                  <div>
                    <h3 style={{ fontSize: 16 }}>模块职责</h3>
                    <div className="kv-list">
                      {a.modules.map((m) => <div className="kv-row" key={m.name}><strong>{m.name}</strong><span>{m.responsibility}<br /><small className="text-muted">输入：{m.inputs.join('、')} → 输出：{m.outputs.join('、')}</small></span></div>)}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16 }}>控制流 / 数据流 / 状态流</h3>
                    <div className="kv-list">
                      <div className="kv-row"><strong>控制流</strong><span>{a.controlFlow.join(' → ')}</span></div>
                      <div className="kv-row"><strong>数据流</strong><span>{a.dataFlow.join(' → ')}</span></div>
                      <div className="kv-row"><strong>状态流</strong><span>{a.stateFlow.join(' → ')}</span></div>
                      <div className="kv-row"><strong>依赖</strong><span>{a.dependencies.join('；')}</span></div>
                    </div>
                  </div>
                </div>
                {meta && <DiagramViewer id={a.diagram} title={meta.title} description={meta.description} type={meta.type} />}
                <div className="grid grid-2">
                  <div><h3 style={{ fontSize: 16 }}>优势</h3><ul>{a.advantages.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  <div><h3 style={{ fontSize: 16 }}>缺点与失败模式</h3><ul>{[...a.disadvantages, ...a.failureModes].map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}</ul></div>
                </div>
                <div className="kv-list" style={{ marginTop: 14 }}>
                  <div className="kv-row"><strong>实现建议</strong><span>{a.implementation}</span></div>
                  <div className="kv-row"><strong>比较</strong><span>{a.comparison}</span></div>
                </div>
                <div className="tag-row" style={{ marginTop: 14 }}>
                  {a.relatedArticles.map((id) => {
                    const art = articles.find((x) => x.id === id)
                    return art ? <Link key={id} className="tag" to={`/article/${art.slug}`}>{art.title}</Link> : null
                  })}
                </div>
              </section>
            )
          })}
        </div>
        <div style={{ marginTop: 44 }}>
          <h2>架构深度文章</h2>
          <div className="grid grid-3" style={{ marginTop: 16 }}>{articles.filter((a) => a.category === 'architecture').map((a) => <ArticleCard key={a.id} article={a} />)}</div>
        </div>
      </div>
    </>
  )
}
