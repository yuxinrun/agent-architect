import raw from './knowledge-graph.json'
import type { KGNode, KGRelation } from '@/types/v2'

export const kgNodes = raw.nodes as KGNode[]
export const kgRelations = raw.relations as KGRelation[]

export const kgNodeTypes = [...new Set(kgNodes.map((n) => n.type))]
export const kgRelationTypes = [...new Set(kgRelations.map((r) => r.type))]
export const kgNodeById = new Map(kgNodes.map((n) => [n.id, n]))

export const relationsOf = (nodeId: string) =>
  kgRelations.filter((r) => r.source === nodeId || r.target === nodeId)
