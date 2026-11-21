import { Link } from 'react-router-dom'
import { projects, books, papers } from '@/content'
import { BookCard, PaperCard, ProjectCard } from '@/components/common/ContentCards'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { searchIndex } from '@/content'
import { useFavorites, useReadingList } from '@/lib/storage'

export function CasesPage() {
  useDocumentTitle('开源项目架构案例', '基于官方文档与源码路径的 Agent 开源项目拆解。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>架构案例</span></nav>
        <span className="eyebrow">Architecture Case Studies</span><h1>开源项目架构案例</h1>
        <p>每个案例记录项目定位、核心抽象、模块、执行流程、状态管理、可靠性、安全边界、源码路径与核实状态。标注“待核实”表示尚未逐行核对指定版本源码。</p>
      </div></div>
      <div className="container section">
        <div className="panel-dark" style={{ marginBottom: 26 }}>
          <h3>关于源码分析的准确性</h3>
          <p>本站不把 README 推测写成内部实现。首批案例给出官方资料入口与典型源码目录，正式发布前需按版本逐项核对并补充行级引用。</p>
        </div>
        <div className="grid grid-2">{projects.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
      </div>
    </>
  )
}

export function BooksPage() {
  useDocumentTitle('技术书籍导读', 'Agent 架构相关的软件工程、ML 系统与 AI 工程书籍索引。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>书籍导读</span></nav>
        <span className="eyebrow">Books</span><h1>技术书籍导读</h1>
        <p>书籍信息按作者、书名、版本和出版 years 记录；未完全核实版本信息的条目标注待核实。</p>
      </div></div>
      <div className="container section"><div className="grid grid-2">{books.map((b) => <BookCard key={b.id} book={b} />)}</div></div>
    </>
  )
}

export function PapersPage() {
  useDocumentTitle('Agent 研究论文', '论文研究问题、方法、架构、贡献、局限与工程启发。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>论文解读</span></nav>
        <span className="eyebrow">Papers</span><h1>Agent 研究论文</h1>
        <p>所有链接指向 arXiv、会议或可靠原始来源。实验结果数值未逐项抄录时，明确提示以原文为准。</p>
      </div></div>
      <div className="container section"><div className="grid" style={{ gap: 20 }}>{papers.map((p) => <PaperCard key={p.id} paper={p} />)}</div></div>
    </>
  )
}

export function SavedPage() {
  useDocumentTitle('收藏与阅读清单', '查看本地保存的文章与内容入口。')
  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>阅读清单</span></nav>
        <span className="eyebrow">Reading List</span><h1>收藏与阅读清单</h1>
        <p>收藏和阅读清单保存在浏览器本地，不上传服务器。点击顶部栏的收藏图标也可以打开此面板。</p>
      </div></div>
      <div className="container section"><SavedContent /></div>
    </>
  )
}

function SavedContent() {
  const favorites = useFavorites()
  const reading = useReadingList()
  const ids = [...new Set([...favorites, ...reading])]
  const items = ids.map((id) => searchIndex.find((x) => x.id === id)).filter((x): x is (typeof searchIndex)[number] => Boolean(x))
  if (!items.length) return <div className="card" style={{ textAlign: 'center', padding: 60 }}><h3>还没有收藏内容</h3><p style={{ marginTop: 8 }}>打开任意文章详情页，点击“收藏文章”或“加入阅读清单”。</p><Link className="btn btn-primary" style={{ marginTop: 18 }} to="/fundamentals">浏览文章</Link></div>
  return <div className="grid grid-3">{items.map((item) => <Link key={item.id} className="card card-hover" to={item.href}><h3>{item.title}</h3><p>{item.summary.slice(0, 100)}…</p></Link>)}</div>
}
