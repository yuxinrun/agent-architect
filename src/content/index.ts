import type { Article, SearchItem } from '@/types/content'
import { agentFundamentals } from './articles/agent-fundamentals'
import { agentVsWorkflow } from './articles/agent-vs-workflow'
import { agentArchitectureMap } from './articles/agent-architecture-map'
import { agentStateLifecycle } from './articles/agent-state-lifecycle'
import { reactPattern } from './articles/react-pattern'
import { planExecute } from './articles/plan-execute'
import { toolSystem } from './articles/tool-system'
import { memoryFundamentals } from './articles/memory-fundamentals'
import { contextEngineering } from './articles/context-engineering'
import { multiAgentFundamentals } from './articles/multi-agent-fundamentals'
import { planningFundamentals } from './articles/planning-fundamentals'
import { durableExecution } from './articles/durable-execution'
import { agentEvaluation } from './articles/agent-evaluation'
import { agentSecurity } from './articles/agent-security'
import { productionEngineering } from './articles/production-engineering'
import { toolPermission } from './articles/tool-permission'
import { ragArchitecture } from './articles/rag-architecture'
import { mcpArchitecture } from './articles/mcp-architecture'
import { hybridWorkflowAgent } from './articles/hybrid-workflow-agent'
import { reflectionPattern } from './articles/reflection-pattern'
import { multiAgentCommunication } from './articles/multi-agent-communication'
import { moreArticles } from './articles/more-articles'
import { v2Articles } from './articles/v2-articles'
import { v3TopicArticles } from './articles/v3-topic-articles'
import { corePatterns } from './patterns/core-patterns'
import { extraPatterns } from './patterns/extra-patterns'
import { coreArchitectures } from './architectures/core-architectures'
import { coreProjects } from './projects/core-projects'
import { extraProjects } from './projects/extra-projects'
import { coreBooks } from './books/core-books'
import { corePapers } from './papers/core-papers'
import { extraPapers } from './papers/extra-papers'
import { diagrams } from '@/data/diagrams'
import { navItems, domainNavItems } from '@/data/navigation'
import { topics } from '@/data/topic-catalog'

export const articles: Article[] = [
  agentFundamentals, agentVsWorkflow, agentArchitectureMap, agentStateLifecycle,
  reactPattern, planExecute, toolSystem, memoryFundamentals, contextEngineering,
  multiAgentFundamentals, planningFundamentals, durableExecution, agentEvaluation,
  agentSecurity, productionEngineering, toolPermission, ragArchitecture, mcpArchitecture,
  hybridWorkflowAgent, reflectionPattern, multiAgentCommunication, ...moreArticles, ...v2Articles, ...v3TopicArticles,
]

export const patterns = [...corePatterns, ...extraPatterns]
export const architectures = coreArchitectures
export const projects = [...coreProjects, ...extraProjects]
export const papers = [...corePapers, ...extraPapers]

export { coreBooks as books }

export const publishedArticles = articles.filter((a) => a.status !== 'draft')

export const getArticle = (slugOrId: string) =>
  articles.find((a) => a.slug === slugOrId || a.id === slugOrId)

export const getRelatedArticles = (article: Article) =>
  article.relatedArticles
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is Article => Boolean(a))

export const articleHref = (article: Article) => `/article/${article.slug}`

export const searchIndex: SearchItem[] = [
  ...publishedArticles.map((a) => ({
    id: a.id, type: 'article' as const, title: a.title, summary: a.summary,
    section: a.category, href: `/article/${a.slug}`, tags: a.tags, difficulty: a.difficulty,
    keywords: [a.title, a.summary, ...a.tags],
  })),
  ...patterns.map((p) => ({
    id: p.id, type: 'design-pattern' as const, title: p.name, summary: p.problem,
    section: 'patterns' as const, href: `/patterns#${p.slug}`, tags: [p.category, p.control], difficulty: p.difficulty,
    keywords: [p.name, p.problem, p.category, ...p.useCases],
  })),
  ...architectures.map((a) => ({
    id: a.id, type: 'architecture' as const, title: a.name, summary: a.goal,
    section: 'architecture' as const, href: `/architecture#${a.slug}`, tags: a.scenarios, difficulty: a.difficulty,
    keywords: [a.name, a.goal, ...a.scenarios],
  })),
  ...projects.map((p) => ({
    id: p.id, type: 'case-study' as const, title: p.name, summary: p.description,
    section: 'cases' as const, href: `/open-source#${p.id}`, tags: [p.category, p.language], difficulty: 'intermediate' as const,
    keywords: [p.name, p.description, p.category],
  })),
  ...coreBooks.map((b) => ({
    id: b.id, type: 'book' as const, title: b.title, summary: b.summary,
    section: 'books' as const, href: `/books#${b.id}`, tags: [b.category, ...b.authors], difficulty: 'beginner' as const,
    keywords: [b.title, b.originalTitle, ...b.authors],
  })),
  ...papers.map((p) => ({
    id: p.id, type: 'paper' as const, title: p.title, summary: p.problem,
    section: 'papers' as const, href: `/research-center#${p.id}`, tags: [p.venue, p.year], difficulty: 'advanced' as const,
    keywords: [p.title, p.authors, p.problem],
  })),
  ...diagrams.map((d) => ({
    id: d.id, type: 'diagram' as const, title: d.title, summary: d.description,
    section: 'knowledge' as const, href: `/diagrams#${d.id}`, tags: d.tags, difficulty: 'intermediate' as const,
    keywords: [d.title, d.description, ...d.tags],
  })),
  ...topics.map((t) => ({
    id: t.id, type: 'article' as const, title: t.title, summary: t.description,
    section: t.categoryId as SearchItem['section'], href: `/topic/${t.slug}`, tags: t.tags, difficulty: t.difficulty,
    keywords: [t.title, t.titleEn, t.description, ...t.tags],
  })),
  ...[...navItems, ...domainNavItems].map((n) => ({
    id: `section-${n.id}`, type: 'article' as const, title: `${n.name} · ${n.en}`, summary: n.description,
    section: n.id, href: n.path, tags: [n.en], difficulty: 'beginner' as const,
    keywords: [n.name, n.en, n.description],
  })),
]

export const contentStats = {
  articles: publishedArticles.length,
  patterns: patterns.length,
  architectures: architectures.length,
  projects: projects.length,
  books: coreBooks.length,
  papers: papers.length,
  diagrams: diagrams.length,
  topics: topics.length,
  domains: domainNavItems.length,
}
