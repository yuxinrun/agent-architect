import type { Difficulty, Reference } from './content'

export type TopicStatus = 'planned' | 'outline' | 'draft' | 'published' | 'needs-review'

export interface Topic {
  id: string
  slug: string
  title: string
  titleEn: string
  description: string
  categoryId: string
  tags: string[]
  difficulty: Difficulty
  status: TopicStatus
  articleIds: string[]
  diagramIds: string[]
  projectIds: string[]
  paperIds: string[]
  bookIds: string[]
  relatedTopicIds: string[]
  references: Reference[]
  lastVerifiedAt: string
  overview: string
  keyQuestions: string[]
  routes: string[]
  learningPath: string[]
}

export interface TopicDecision {
  question: string
  options: string
  recommendation: string
}

export interface TopicPitfall {
  symptom: string
  cause: string
  fix: string
}

export interface TopicMetric {
  name: string
  definition: string
  good: string
}

export interface TopicDetail {
  deepDive: string[]
  decisions: TopicDecision[]
  pitfalls: TopicPitfall[]
  metrics: TopicMetric[]
  prerequisites: string[]
  outcomes: string[]
}

export interface DomainMeta {
  id: string
  no: string
  name: string
  en: string
  path: string
  summary: string
  seoTitle: string
  seoDescription: string
  groups: string[]
}

export interface Blueprint {
  id: string
  name: string
  description: string
  tree: string[]
  architecture: string
  modules: { name: string; duty: string }[]
  interfaces: string[]
  dataModel: string[]
  stateManagement: string
  toolDesign: string
  errorHandling: string
  security: string
  testing: string
  deployment: string
  extension: string
  diagramId: string
  tags: string[]
}

export type KGNodeType =
  | 'Concept' | 'Architecture' | 'DesignPattern' | 'Mechanism' | 'Framework'
  | 'Protocol' | 'Component' | 'Tool' | 'Project' | 'Paper' | 'Book'
  | 'Application' | 'EngineeringPractice' | 'SecurityControl' | 'EvaluationMetric'

export type KGRelationType =
  | 'belongs_to' | 'implements' | 'depends_on' | 'related_to' | 'compares_with'
  | 'extends' | 'uses' | 'evaluated_by' | 'inspired_by' | 'implemented_by'
  | 'protects' | 'deployed_as'

export interface KGNode {
  id: string
  label: string
  type: KGNodeType
  x: number
  y: number
  href: string
  summary: string
  domainId: string
}

export interface KGRelation {
  source: string
  target: string
  type: KGRelationType
  label: string
}
