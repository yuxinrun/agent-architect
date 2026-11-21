export const difficultyLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
}

export const difficultyOrder = ['beginner', 'intermediate', 'advanced'] as const

export const commonTags = [
  'Agent', '架构', '控制流', '状态', 'Planning', 'Memory', 'Tool Calling', 'Multi-Agent',
  'Runtime', 'Context', 'Evaluation', 'Security', 'Production', 'ReAct', 'MCP', 'RAG',
]

export const contentTypes = [
  { id: 'article', label: '深度文章' },
  { id: 'architecture', label: '架构方案' },
  { id: 'design-pattern', label: '设计模式' },
  { id: 'case-study', label: '案例研究' },
  { id: 'book', label: '书籍' },
  { id: 'paper', label: '论文' },
  { id: 'diagram', label: '架构图' },
  { id: 'tutorial', label: '教程' },
]

export const techStacks = [
  'LangGraph', 'LangChain', 'AutoGen', 'CrewAI', 'OpenAI Agents SDK', 'PydanticAI',
  'LlamaIndex', 'MCP', 'A2A', 'Python', 'TypeScript',
]
