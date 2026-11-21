import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { domainGroups, toolNavItems } from '@/data/navigation'
import { searchIndex } from '@/content'
import type { SearchItem } from '@/types/content'
import { useFavorites, useReadingList } from '@/lib/storage'

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const results: SearchItem[] = query.trim()
    ? searchIndex.filter((item) => {
        const text = [item.title, item.summary, ...item.tags, ...item.keywords].join(' ').toLowerCase()
        return text.includes(query.trim().toLowerCase())
      }).slice(0, 30)
    : searchIndex.filter((item) => item.type === 'article').slice(0, 12)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-label="全站搜索">
        <div className="search-input-row">
          <span aria-hidden>⌕</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索架构、模式、文章、项目、论文…" />
          <span className="search-hint">ESC</span>
        </div>
        <div className="search-results">
          {results.length === 0 && <div className="search-empty">没有找到匹配内容，试试“Memory”“ReAct”或“Runtime”。</div>}
          {results.map((item) => (
            <Link key={`${item.type}-${item.id}`} to={item.href} className="search-result" onClick={onClose}>
              <strong>{item.title}</strong>
              <p>{item.type} · {item.summary.slice(0, 96)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function SavedPanel({ onClose }: { onClose: () => void }) {
  const favorites = useFavorites()
  const reading = useReadingList()
  const savedIds = [...new Set([...favorites, ...reading])]
  const items = savedIds.map((id) => searchIndex.find((item) => item.id === id)).filter((x): x is SearchItem => Boolean(x))

  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="search-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-label="收藏与阅读清单">
        <div className="search-input-row"><strong>收藏与阅读清单</strong><button type="button" className="text-action" style={{ marginLeft: 'auto' }} onClick={onClose}>关闭</button></div>
        <div className="search-results">
          {items.length === 0 && <div className="search-empty">还没有收藏内容。在文章详情页点击“收藏”或“加入阅读清单”。</div>}
          {items.map((item) => (
            <Link key={item.id} to={item.href} className="search-result" onClick={onClose}>
              <strong>{favorites.includes(item.id) ? '★ ' : '· '}{item.title}</strong>
              <p>{item.summary.slice(0, 100)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [location.pathname])

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="返回首页">
            <span className="brand-mark">AA</span>
            <span className="brand-text">Agent Architect<small>AGENT 架构研究所</small></span>
          </Link>
          <nav className="header-nav" aria-label="主导航">
            <NavLink to="/engineering" className={({ isActive }) => isActive ? 'active' : ''}>工程</NavLink>
            <NavLink to="/architecture" className={({ isActive }) => isActive ? 'active' : ''}>架构</NavLink>
            <NavLink to="/workflow" className={({ isActive }) => isActive ? 'active' : ''}>编排</NavLink>
            <NavLink to="/protocols" className={({ isActive }) => isActive ? 'active' : ''}>协议</NavLink>
            <NavLink to="/topic-catalog" className={({ isActive }) => isActive ? 'active' : ''}>主题</NavLink>
            <NavLink to="/knowledge-graph" className={({ isActive }) => isActive ? 'active' : ''}>图谱</NavLink>
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={() => setSavedOpen(true)} aria-label="收藏与阅读清单">☆</button>
            <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="搜索">⌕</button>
            <button type="button" className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开菜单">☰</button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu show">
            {domainGroups.map((group) => (
              <div className="mobile-menu-group" key={group.id}>
                <h4>{group.label}</h4>
                <div className="mobile-menu-grid">
                  {group.items.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}
                </div>
              </div>
            ))}
            <div className="mobile-menu-group">
              <h4>工具与资料</h4>
              <div className="mobile-menu-grid">
                <Link to="/topic-catalog">主题覆盖矩阵</Link>
                <Link to="/decision-guide">架构决策</Link>
                <Link to="/blueprints">项目蓝图</Link>
                <Link to="/open-source">开源项目</Link>
                <Link to="/research-center">研究中心</Link>
                <Link to="/diagrams">架构图谱</Link>
                <Link to="/patterns">模式浏览器</Link>
                <Link to="/roadmap">学习路线</Link>
                {toolNavItems.map((item) => <Link key={item.id} to={item.path}>{item.name}</Link>)}
              </div>
            </div>
          </div>
        )}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h4>Agent Architect</h4>
            <p>从原理到架构，从架构到生产。</p>
            <p>Explore the Architecture of Intelligent Agents.</p>
          </div>
          <div><h4>知识领域</h4><Link to="/engineering">工程实践</Link><Link to="/architecture">架构设计</Link><Link to="/multi-agent">多智能体</Link><Link to="/workflow">工作流</Link><Link to="/frameworks">开发框架</Link></div>
          <div><h4>核心与运行</h4><Link to="/mechanisms">核心机制</Link><Link to="/memory-context">记忆与上下文</Link><Link to="/runtime">运行时</Link><Link to="/security">安全治理</Link><Link to="/evaluation">评测可靠性</Link></div>
          <div><h4>应用与资料</h4><Link to="/applications">应用领域</Link><Link to="/research-center">研究中心</Link><Link to="/product">产品商业化</Link><Link to="/future">未来演进</Link><Link to="/topic-catalog">主题矩阵</Link></div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Agent 架构研究所 · 内容以原始资料为准，标注“待核实”的条目需发布前复核。</span>
          <span>本地资源 · 无外部图片依赖</span>
        </div>
      </footer>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {savedOpen && <SavedPanel onClose={() => setSavedOpen(false)} />}
    </>
  )
}
