import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { books, papers, projects } from '@/content'
import { BookCard, PaperCard, ProjectCard } from '@/components/common/ContentCards'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const paperFields = [
  'Agent Fundamentals', 'Agent Planning', 'Agent Memory', 'Tool Use', 'Multi-Agent',
  'Agentic RAG', 'Coding Agents', 'Browser Agents', 'Agent Evaluation', 'Agent Safety', 'Agent Runtime', 'Autonomous Systems',
]

function fieldOf(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('swe') || t.includes('software')) return 'Coding Agents'
  if (t.includes('browser') || t.includes('webarena') || t.includes('computer')) return 'Browser Agents'
  if (t.includes('memory') || t.includes('memgpt')) return 'Agent Memory'
  if (t.includes('tool')) return 'Tool Use'
  if (t.includes('agentbench') || t.includes('gaia') || t.includes('benchmark') || t.includes('tau')) return 'Agent Evaluation'
  if (t.includes('react') || t.includes('thought')) return 'Agent Planning'
  if (t.includes('rag') || t.includes('raptor')) return 'Agentic RAG'
  if (t.includes('voyager') || t.includes('generative')) return 'Autonomous Systems'
  return 'Agent Fundamentals'
}

export function OpenSourcePage() {
  useDocumentTitle('Open Source Agent Projects', '按框架、多 Agent、Coding、Browser、Runtime、协议等类别组织开源项目分析。')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [])
  const filtered = projects.filter((p) =>
    (category === 'all' || p.category === category) &&
    (!query || `${p.name}${p.description}${p.coreModules.join('')}`.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>开源项目中心</span></nav>
        <span className="eyebrow">Open Source Agent Projects</span><h1>开源 Agent 项目中心</h1>
        <p>所有条目标注官方仓库、当前核实版本与核实状态。未逐行核对指定版本源码的项目统一标记为“待核实”，不虚构源码路径或 API。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索项目…" aria-label="搜索项目" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="按类别筛选"><option value="all">全部类别</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <span className="text-small text-muted">{filtered.length} / {projects.length}</span>
        </div>
        <div className="grid grid-2">{filtered.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
      </div>
    </>
  )
}

export function ResearchCenterPage() {
  useDocumentTitle('Agent Research Center', '论文、书籍与开源项目研究中心，按领域筛选并追踪来源。')
  const [tab, setTab] = useState<'papers' | 'books' | 'projects'>('papers')
  const [field, setField] = useState('all')
  const [query, setQuery] = useState('')
  const filteredPapers = papers.filter((p) =>
    (field === 'all' || fieldOf(p.title) === field) &&
    (!query || `${p.title}${p.authors}${p.problem}`.toLowerCase().includes(query.toLowerCase())),
  )
  const filteredBooks = books.filter((b) => !query || `${b.title}${b.authors.join('')}${b.summary}`.toLowerCase().includes(query.toLowerCase()))
  const filteredProjects = projects.filter((p) => !query || `${p.name}${p.description}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>研究中心</span></nav>
        <span className="eyebrow">Agent Research Center</span><h1>Agent 论文与研究中心</h1>
        <p>论文链接优先指向 arXiv、会议官网或作者机构页面。实验结果以原文为准；未核对出版的书籍版本和未核对源码的项目均标记待核实。</p>
      </div></div>
      <div className="container section">
        <div className="filter-bar">
          <button type="button" className={`filter-chip ${tab === 'papers' ? 'active' : ''}`} onClick={() => setTab('papers')}>论文 {papers.length}</button>
          <button type="button" className={`filter-chip ${tab === 'books' ? 'active' : ''}`} onClick={() => setTab('books')}>书籍 {books.length}</button>
          <button type="button" className={`filter-chip ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>项目 {projects.length}</button>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索研究资料…" aria-label="搜索研究资料" />
          {tab === 'papers' && (
            <select value={field} onChange={(e) => setField(e.target.value)} aria-label="按研究领域筛选"><option value="all">全部研究领域</option>{paperFields.map((f) => <option key={f}>{f}</option>)}</select>
          )}
        </div>
        {tab === 'papers' && <div className="grid" style={{ gap: 20 }}>{filteredPapers.map((p) => <div key={p.id}><div className="section-index" style={{ marginBottom: 6 }}>{fieldOf(p.title)}</div><PaperCard paper={p} /></div>)}</div>}
        {tab === 'books' && <div className="grid grid-2">{filteredBooks.map((b) => <BookCard key={b.id} book={b} />)}</div>}
        {tab === 'projects' && <div className="grid grid-2">{filteredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}</div>}
      </div>
    </>
  )
}
