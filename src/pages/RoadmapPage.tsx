import { Link } from 'react-router-dom'
import { articles, books, papers, patterns, projects } from '@/content'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const stages = [
  { name: 'LLM 基础', desc: '理解上下文窗口、Token、Embedding 与模型能力边界。', tags: ['Context', 'RAG'], section: '/context' },
  { name: 'Agent 基本机制', desc: 'Observe、Think、Plan、Act 循环，以及 Agent 与 Workflow 的边界。', tags: ['Agent', 'Control Flow'], section: '/fundamentals' },
  { name: 'Tool Calling', desc: 'Schema、Registry、权限、幂等与结果标准化。', tags: ['MCP', 'Permission'], section: '/tool-use' },
  { name: 'Planning', desc: '任务分解、计划验证、重规划与预算约束。', tags: ['Plan-and-Execute'], section: '/planning' },
  { name: 'Memory', desc: '记忆分层、巩固、检索噪声、删除与隔离。', tags: ['Episodic', 'Semantic'], section: '/memory' },
  { name: 'Context Engineering', desc: '上下文选择、压缩、优先级与缓存。', tags: ['Context Budget'], section: '/context' },
  { name: 'Design Patterns', desc: '掌握不同模式的控制权、状态和失败处理。', tags: ['ReAct', 'HITL'], section: '/patterns' },
  { name: 'Multi-Agent', desc: '拆分判据、通信协议、冲突与复杂度控制。', tags: ['Supervisor', 'Handoff'], section: '/multi-agent' },
  { name: 'Runtime', desc: '异步、检查点、取消、恢复与沙箱。', tags: ['Durable Execution'], section: '/runtime' },
  { name: 'Evaluation', desc: '任务成功率、轨迹评测、工具指标与可观测性。', tags: ['Trace', 'Metrics'], section: '/evaluation' },
  { name: 'Security', desc: '注入、权限、审批、审计与威胁建模。', tags: ['IAM', 'Sandbox'], section: '/security' },
  { name: 'Production Engineering', desc: '成本、延迟、可靠性、发布与事故分析。', tags: ['SLO', 'Fallback'], section: '/production' },
]

export function RoadmapPage() {
  useDocumentTitle('Agent 学习路线', '从 LLM 基础到生产工程的阶段化学习路径。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>学习路线</span></nav>
        <span className="eyebrow">Learning Roadmap</span><h1>Agent 架构学习路线</h1>
        <p>每个阶段关联文章、模式、书籍、论文与开源项目。路线是认知顺序建议，不是必须线性执行的流程。</p>
      </div></div>
      <div className="container section">
        <div className="roadmap-track">
          {stages.map((stage, i) => (
            <section key={stage.name} className="roadmap-stage">
              <div className="stage-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3>{stage.name}</h3>
                <p>{stage.desc}</p>
                <div className="tag-row">
                  {stage.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  <Link className="tag" to={stage.section}>进入栏目 →</Link>
                  {articles[i] && <Link className="tag" to={`/article/${articles[i].slug}`}>推荐文章：{articles[i].title.slice(0, 14)}…</Link>}
                  {patterns[i] && <Link className="tag" to={`/patterns#${patterns[i].slug}`}>模式：{patterns[i].name}</Link>}
                  {books[i % books.length] && <Link className="tag" to={`/books#${books[i % books.length].id}`}>书籍：{books[i % books.length].title.slice(0, 12)}…</Link>}
                  {papers[i % papers.length] && <Link className="tag" to={`/papers#${papers[i % papers.length].id}`}>论文：{papers[i % papers.length].title.slice(0, 18)}…</Link>}
                  {projects[i % projects.length] && <Link className="tag" to={`/cases#${projects[i % projects.length].id}`}>项目：{projects[i % projects.length].name}</Link>}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
