import { Link } from 'react-router-dom'
import type { Article, Book, DesignPattern, OpenSourceProject, Paper } from '@/types/content'
import { articleHref } from '@/content'
import { difficultyLabels } from '@/data/taxonomy'

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={articleHref(article)} className="card card-hover card-link">
      <div className="section-index">{article.category.toUpperCase()}</div>
      <h3>{article.title}</h3>
      <p>{article.summary}</p>
      <div className="card-meta">
        <span className="badge gray">{difficultyLabels[article.difficulty]}</span>
        <span>{article.readingTime} 分钟</span>
        <span>{article.publishedAt}</span>
      </div>
    </Link>
  )
}

export function PatternCard({ pattern }: { pattern: DesignPattern }) {
  return (
    <Link to={`/patterns#${pattern.slug}`} className="card card-hover card-link">
      <div className="section-index">{pattern.category}</div>
      <h3>{pattern.name}</h3>
      <p>{pattern.problem}</p>
      <div className="card-meta"><span className="badge gray">{difficultyLabels[pattern.difficulty]}</span><span>{pattern.control}</span></div>
    </Link>
  )
}

export function ProjectCard({ project }: { project: OpenSourceProject }) {
  return (
    <div id={project.id} className="card">
      <div className="card-meta" style={{ marginTop: 0, marginBottom: 10 }}>
        <span className="badge">{project.category}</span>
        <span className={project.verificationStatus === 'verified' ? 'badge green' : 'badge amber'}>
          {project.verificationStatus === 'verified' ? '已核实' : '待核实'}
        </span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="card-meta">
        <span>{project.language}</span><span>版本：{project.versionReviewed}</span>
      </div>
      <div className="tag-row" style={{ marginTop: 14 }}>
        {project.coreModules.slice(0, 4).map((m) => <span key={m} className="tag">{m}</span>)}
      </div>
      <p className="text-small" style={{ marginTop: 14 }}><strong>架构要点：</strong>{project.architecture}</p>
      <p className="text-small" style={{ marginTop: 8 }}><strong>权衡：</strong>{project.tradeoffs}</p>
      <div className="tag-row" style={{ marginTop: 14 }}>
        <a className="arrow-link" href={project.officialUrl} target="_blank" rel="noreferrer">官方文档 ↗</a>
        <a className="arrow-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">源码仓库 ↗</a>
      </div>
    </div>
  )
}

export function BookCard({ book }: { book: Book }) {
  return (
    <div id={book.id} className="card card-hover">
      <div className="section-index">{book.category}</div>
      <h3>{book.title}</h3>
      <p className="text-small text-muted">{book.originalTitle}</p>
      <p style={{ marginTop: 10 }}>{book.summary}</p>
      <div className="card-meta"><span>{book.authors.join('、')}</span><span>{book.publisher}</span><span>{book.year}</span></div>
      <p className="text-small" style={{ marginTop: 12 }}><strong>为什么读：</strong>{book.whyRead}</p>
      <p className="text-small" style={{ marginTop: 8 }}><strong>Agent 关联：</strong>{book.agentRelevance}</p>
      <div className={book.verificationStatus === 'verified' ? 'badge green' : 'badge amber'} style={{ marginTop: 12 }}>
        {book.verificationStatus === 'verified' ? '出版信息已核实' : '版本信息待核实'}
      </div>
    </div>
  )
}

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article id={paper.id} className="card">
      <div className="card-meta" style={{ marginTop: 0, marginBottom: 10 }}>
        <span className="badge gray">{paper.year}</span><span>{paper.venue}</span>
        <span className={paper.verificationStatus === 'verified' ? 'badge green' : 'badge amber'}>
          {paper.verificationStatus === 'verified' ? '已核实' : '待核实'}
        </span>
      </div>
      <h3>{paper.title}</h3>
      <p className="text-small text-muted">{paper.authors}</p>
      <div className="kv-list">
        <div className="kv-row"><strong>研究问题</strong><span>{paper.problem}</span></div>
        <div className="kv-row"><strong>核心方法</strong><span>{paper.method}</span></div>
        <div className="kv-row"><strong>系统架构</strong><span>{paper.architecture}</span></div>
        <div className="kv-row"><strong>主要贡献</strong><span>{paper.contributions.join('；')}</span></div>
        <div className="kv-row"><strong>实验结果</strong><span>{paper.results}</span></div>
        <div className="kv-row"><strong>局限性</strong><span>{paper.limitations}</span></div>
        <div className="kv-row"><strong>工程启发</strong><span>{paper.engineeringInsights.join('；')}</span></div>
      </div>
      <a className="arrow-link" href={paper.url} target="_blank" rel="noreferrer">原始论文 ↗</a>
    </article>
  )
}
