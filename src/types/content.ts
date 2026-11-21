export type ContentType =
  | 'article'
  | 'architecture'
  | 'design-pattern'
  | 'case-study'
  | 'book'
  | 'paper'
  | 'diagram'
  | 'tutorial'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type SectionId =
  | 'fundamentals'
  | 'architecture'
  | 'patterns'
  | 'planning'
  | 'memory'
  | 'tool-use'
  | 'multi-agent'
  | 'runtime'
  | 'context'
  | 'evaluation'
  | 'security'
  | 'production'
  | 'cases'
  | 'books'
  | 'papers'
  | 'roadmap'
  | 'about'
  | 'engineering'
  | 'workflow'
  | 'frameworks'
  | 'protocols'
  | 'mechanisms'
  | 'memory-context'
  | 'applications'
  | 'research'
  | 'product'
  | 'future'

export interface Reference {
  title: string
  url?: string
  publisher?: string
  date?: string
  note?: string
  verification?: 'verified' | 'to-verify'
}

export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  category: SectionId
  tags: string[]
  difficulty: Difficulty
  readingTime: number
  publishedAt: string
  updatedAt: string
  author: string
  content: string
  references: Reference[]
  relatedArticles: string[]
  relatedPatterns: string[]
  relatedProjects: string[]
  diagrams: string[]
  seoTitle?: string
  seoDescription?: string
  status?: 'published' | 'draft'
}

export interface DesignPattern {
  id: string
  name: string
  slug: string
  category: string
  problem: string
  solution: string
  workflow: string[]
  advantages: string[]
  disadvantages: string[]
  tradeoffs: string
  useCases: string[]
  antiPatterns: string[]
  diagrams: string[]
  examples: { language: string; title: string; code: string }[]
  references: Reference[]
  relatedArticles: string[]
  difficulty: Difficulty
  control: string
  state: string
}

export interface Architecture {
  id: string
  name: string
  slug: string
  goal: string
  scenarios: string[]
  modules: { name: string; responsibility: string; inputs: string[]; outputs: string[] }[]
  dependencies: string[]
  controlFlow: string[]
  dataFlow: string[]
  stateFlow: string[]
  diagram: string
  advantages: string[]
  disadvantages: string[]
  complexity: string
  cost: string
  failureModes: string[]
  implementation: string
  comparison: string
  relatedArticles: string[]
  difficulty: Difficulty
}

export interface OpenSourceProject {
  id: string
  name: string
  description: string
  officialUrl: string
  repositoryUrl: string
  language: string
  category: string
  versionReviewed: string
  architecture: string
  coreModules: string[]
  executionFlow: string[]
  stateManagement: string
  toolSystem: string
  memoryDesign: string
  extensionPoints: string[]
  reliability: string
  security: string
  sourcePaths: string[]
  analysis: string
  tradeoffs: string
  comparison: string
  scenarios: string[]
  learningValue: string
  references: Reference[]
  lastVerifiedAt: string
  verificationStatus: 'verified' | 'to-verify'
}

export interface Book {
  id: string
  title: string
  originalTitle: string
  authors: string[]
  edition: string
  publisher: string
  year: string
  category: string
  summary: string
  whyRead: string
  agentRelevance: string
  readingTips: string[]
  relatedArticles: string[]
  reference: Reference
  verificationStatus: 'verified' | 'to-verify'
}

export interface Paper {
  id: string
  title: string
  authors: string
  year: string
  venue: string
  url: string
  problem: string
  method: string
  architecture: string
  contributions: string[]
  experiments: string
  results: string
  limitations: string
  engineeringInsights: string[]
  relatedPatterns: string[]
  verificationStatus: 'verified' | 'to-verify'
}

export interface DiagramMeta {
  id: string
  title: string
  type: '概念模型' | '参考架构' | '特定项目实现'
  description: string
  component: string
  tags: string[]
}

export interface SearchItem {
  id: string
  type: ContentType
  title: string
  summary: string
  section: SectionId | 'knowledge'
  href: string
  tags: string[]
  difficulty: Difficulty
  keywords: string[]
}
