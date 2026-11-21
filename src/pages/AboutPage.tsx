import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { contentStats } from '@/content'

export function AboutPage() {
  useDocumentTitle('关于本站', 'Agent 架构研究所的定位、内容原则与资料引用规范。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>关于本站</span></nav>
        <span className="eyebrow">About</span><h1>关于 Agent 架构研究所</h1>
        <p>从原理到架构，从架构到生产。Explore the Architecture of Intelligent Agents.</p>
      </div></div>
      <div className="container section">
        <div className="grid grid-2">
          <div className="card">
            <h2>定位</h2>
            <p style={{ marginTop: 10 }}>面向 AI Agent 工程师、全栈开发者、AI 应用架构师、技术负责人和研究人员的中文专业知识平台。我们研究系统架构、核心机制、设计模式、工程实现、开源项目和生产实践。</p>
            <p style={{ marginTop: 10 }}>核心理念：Agent 工程的难点不只是让模型调用工具，而是设计一个能够可靠感知、规划、执行、记忆、协作、恢复和持续运行的系统。</p>
          </div>
          <div className="card">
            <h2>内容原则</h2>
            <ul style={{ paddingLeft: 20, marginTop: 10 }}>
              <li>深入而非泛泛介绍，系统而非零散文章。</li>
              <li>工程化，不只讲模型能力。</li>
              <li>有架构图、流程图、代码和设计决策。</li>
              <li>覆盖从 Demo 到 Production 的完整路径。</li>
              <li>不宣传某种框架或模式为万能方案。</li>
              <li>未验证趋势不描述为确定事实。</li>
            </ul>
          </div>
          <div className="card">
            <h2>资料与引用规范</h2>
            <p style={{ marginTop: 10 }}>资料优先级：官方文档、官方 GitHub 仓库与源码、原始论文、会议论文集、作者技术文章、有技术深度的社区资料。</p>
            <p style={{ marginTop: 10 }}>不虚构论文、API、源码路径、性能数据或基准结果。重要判断提供依据；争议结论说明不同观点；未核实内容明确标注。</p>
          </div>
          <div className="card">
            <h2>首批内容规模</h2>
            <div className="kv-list" style={{ marginTop: 10 }}>
              <div className="kv-row"><strong>深度文章</strong><span>{contentStats.articles} 篇</span></div>
              <div className="kv-row"><strong>设计模式</strong><span>{contentStats.patterns} 个</span></div>
              <div className="kv-row"><strong>架构方案</strong><span>{contentStats.architectures} 个</span></div>
              <div className="kv-row"><strong>原创图谱</strong><span>{contentStats.diagrams} 张</span></div>
              <div className="kv-row"><strong>书籍/论文</strong><span>{contentStats.books} / {contentStats.papers}</span></div>
            </div>
          </div>
        </div>
        <div className="panel-dark" style={{ marginTop: 24 }}>
          <h3>长期目标</h3>
          <p>内容数量是长期目标。我们优先保证首批内容的准确性、完整性和实用性，不用重复文章或虚构资料填充数量。</p>
          <Link className="btn btn-ghost" style={{ marginTop: 18 }} to="/roadmap">查看学习路线</Link>
        </div>
      </div>
    </>
  )
}
