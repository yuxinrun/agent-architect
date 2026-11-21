import { Link } from 'react-router-dom'
import { HeroArchitecture } from '@/components/diagrams/HeroArchitecture'
import { ArchitectureDiagram } from '@/components/diagrams/ArchitectureDiagram'
import { ArticleCard, PatternCard } from '@/components/common/ContentCards'
import { articles, patterns, architectures, books, papers, projects, contentStats } from '@/content'
import { navItems } from '@/data/navigation'
import { domains } from '@/data/domains'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const demoToProd = [
  { title: '可运行 Demo', desc: '一个循环、几个工具、内存状态。能展示能力，但无法保证可靠性。' },
  { title: '受控原型', desc: '加入步数预算、工具 schema、轨迹记录和基础权限校验。' },
  { title: '可恢复系统', desc: '引入状态机、检查点、幂等键、超时与失败分类。' },
  { title: '生产 Agent', desc: '模型路由、灰度发布、SLO、告警、审计和事故复盘。' },
]

export function HomePage() {
  useDocumentTitle()
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-eyebrow">AGENT ARCHITECT · 架构研究所</div>
            <h1>Agent Architect<span>构建可靠、可扩展、可演进的智能体系统。</span></h1>
            <p className="hero-lead">从 Agent 核心原理、架构模式到生产级工程实践，系统探索智能体系统的设计方法与技术边界。</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/architecture">探索架构 →</Link>
              <Link className="btn btn-ghost" to="/roadmap">阅读专题</Link>
              <Link className="btn btn-ghost" to="/patterns">设计模式</Link>
            </div>
            <div className="hero-meta">
              <span><strong>{contentStats.articles}</strong>深度文章</span>
              <span><strong>{contentStats.patterns}</strong>设计模式</span>
              <span><strong>{contentStats.diagrams}</strong>原创架构图</span>
              <span><strong>{contentStats.topics}</strong>技术主题</span>
              <span><strong>0</strong>外部图片依赖</span>
            </div>
          </div>
          <HeroArchitecture />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Architecture Overview</span><h2>Agent 架构全景</h2><p>Agent 系统不是模型加函数调用，而是控制流、数据流、状态与反馈关系共同构成的系统。</p></div>
            <Link className="arrow-link" to="/diagrams">查看全部图谱 →</Link>
          </div>
          <ArchitectureDiagram id="agent-overview" />
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Core Domains</span><h2>核心技术领域</h2><p>从基础原理到生产工程，形成完整的知识地图。</p></div></div>
          <div className="grid grid-4">
            {navItems.slice(0, 12).map((item) => (
              <Link key={item.id} to={item.path} className="card card-hover card-link">
                <div className="section-index">{item.icon} / {item.en}</div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Knowledge System V2</span><h2>16 个一级知识领域</h2><p>从理论、架构、机制、运行时到应用、研究与未来演进，形成 Agent 工程师的长期参考手册。</p></div>
            <Link className="arrow-link" to="/topic-catalog">查看 58 项主题覆盖矩阵 →</Link>
          </div>
          <div className="grid grid-4">
            {domains.map((d) => (
              <Link key={d.id} to={d.path} className="card card-hover card-link">
                <div className="section-index">{d.no} / {d.en}</div>
                <h3>{d.name}</h3>
                <p>{d.summary}</p>
              </Link>
            ))}
          </div>
          <div className="grid grid-3" style={{ marginTop: 18 }}>
            <Link to="/decision-guide" className="card card-hover"><h3>架构决策工具 V2</h3><p>14 个工程条件生成可解释建议，支持导出 Markdown。</p></Link>
            <Link to="/blueprints" className="card card-hover"><h3>Agent 项目蓝图</h3><p>10 类模板覆盖目录、接口、状态、工具、安全与部署。</p></Link>
            <Link to="/knowledge-graph" className="card card-hover"><h3>知识图谱 V2</h3><p>15 类节点、12 类关系，支持筛选、搜索与节点详情。</p></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Design Patterns</span><h2>设计模式精选</h2><p>每种模式都有明确的执行流程、控制权归属和代价，不应混为一谈。</p></div><Link className="arrow-link" to="/patterns">进入模式浏览器 →</Link></div>
          <div className="grid grid-3">{patterns.slice(0, 6).map((p) => <PatternCard key={p.id} pattern={p} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel-dark">
            <span className="eyebrow" style={{ color: '#7fa6ff' }}>Demo → Production</span>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>从 Demo 到 Production</h2>
            <p>真正的分水岭不是功能多少，而是系统能否在故障、变化和风险下持续正确运行。</p>
            <div className="grid grid-4" style={{ marginTop: 28 }}>
              {demoToProd.map((step, i) => (
                <div key={step.title} className="step-card">
                  <span className="section-index" style={{ color: '#7fa6ff' }}>0{i + 1}</span>
                  <h3 style={{ marginTop: 8 }}>{step.title}</h3>
                  <p style={{ marginTop: 8 }}>{step.desc}</p>
                </div>
              ))}
            </div>
            <Link className="btn btn-primary" style={{ marginTop: 26 }} to="/production">阅读生产工程指南</Link>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Architecture Studies</span><h2>经典架构专题</h2></div><Link className="arrow-link" to="/architecture">查看全部 →</Link></div>
          <div className="grid grid-3">
            {architectures.slice(0, 3).map((a) => (
              <Link key={a.id} to={`/architecture#${a.slug}`} className="card card-hover card-link">
                <div className="badge gray">{a.complexity}复杂度</div><h3 style={{ marginTop: 12 }}>{a.name}</h3><p>{a.goal}</p>
                <div className="card-meta"><span>{a.scenarios.slice(0, 2).join(' · ')}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Open Source</span><h2>开源 Agent 项目源码解析</h2><p>基于官方文档与源码路径组织分析，并明确版本和核实状态。</p></div><Link className="arrow-link" to="/cases">全部案例 →</Link></div>
          <div className="grid grid-2">
            {projects.slice(0, 2).map((p) => (
              <div key={p.id} className="card">
                <div className="badge">{p.category}</div><h3 style={{ marginTop: 12 }}>{p.name}</h3><p>{p.description}</p>
                <p className="text-small" style={{ marginTop: 12 }}>{p.analysis}</p>
                <Link className="arrow-link" to={`/cases#${p.id}`}>阅读拆解 →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Latest</span><h2>最新深度文章</h2></div><Link className="arrow-link" to="/fundamentals">全部文章 →</Link></div>
          <div className="grid grid-3">{articles.slice(0, 6).map((a) => <ArticleCard key={a.id} article={a} />)}</div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Books & Papers</span><h2>技术书籍与论文</h2><p>资料索引坚持来源真实、版本明确；未核实条目标注待核实。</p></div><div><Link className="arrow-link" to="/books">书籍 →</Link><Link className="arrow-link" to="/papers" style={{ marginLeft: 16 }}>论文 →</Link></div></div>
          <div className="grid grid-3">
            {books.slice(0, 3).map((b) => <div key={b.id} className="card"><div className="section-index">{b.category}</div><h3>{b.title}</h3><p>{b.summary}</p><div className="card-meta"><span>{b.authors.join('、')}</span><span>{b.year}</span></div></div>)}
            {papers.slice(0, 3).map((p) => <div key={p.id} className="card"><div className="section-index">{p.venue}</div><h3>{p.title}</h3><p>{p.problem}</p><a className="arrow-link" href={p.url} target="_blank" rel="noreferrer">原始论文 ↗</a></div>)}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Roadmap</span><h2>架构图谱与学习路线</h2><p>从 LLM 基础到生产工程，按阶段建立系统认知。</p></div><Link className="arrow-link" to="/roadmap">查看路线图 →</Link></div>
          <div className="grid grid-2">
            <Link to="/diagrams" className="card card-hover card-link"><h3>25 张原创架构图</h3><p>覆盖执行循环、记忆分层、工具时序、Runtime、评测闭环和安全边界。</p><span className="arrow-link">打开图谱 →</span></Link>
            <Link to="/decision-guide" className="card card-hover card-link"><h3>架构决策辅助工具</h3><p>通过工程问题梳理需求，生成带理由的参考架构建议，不冒充唯一正确答案。</p><span className="arrow-link">开始决策 →</span></Link>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Toolbox</span><h2>工程工具箱</h2></div></div>
          <div className="grid grid-4">
            <Link to="/explorer" className="card card-hover"><h3>架构探索器</h3><p>点击查看模块职责、依赖关系与相关文章。</p></Link>
            <Link to="/patterns" className="card card-hover"><h3>模式浏览器</h3><p>按问题、类别和难度筛选设计模式。</p></Link>
            <Link to="/knowledge-graph" className="card card-hover"><h3>知识图谱</h3><p>探索概念、模式、论文与文章之间的关联。</p></Link>
            <Link to="/saved" className="card card-hover"><h3>阅读清单</h3><p>收藏文章，形成自己的学习队列。</p></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel-dark">
            <span className="eyebrow" style={{ color: '#7fa6ff' }}>About</span>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>关于 Agent 架构研究所</h2>
            <p>Agent 工程的难点不只是让模型调用工具，而是设计一个能够可靠感知、规划、执行、记忆、协作、恢复和持续运行的系统。本站坚持深入、系统、工程化，不宣传任何框架或模式为万能方案。</p>
            <Link className="btn btn-ghost" style={{ marginTop: 22 }} to="/about">了解内容原则与引用规范</Link>
          </div>
        </div>
      </section>
    </>
  )
}
