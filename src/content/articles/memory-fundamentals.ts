import type { Article } from '@/types/content'

export const memoryFundamentals: Article = {
  id: 'art-memory-fundamentals',
  slug: 'agent-memory-fundamentals',
  title: 'Agent Memory：区分记忆、上下文、状态与知识库',
  summary: 'Memory 不是把对话历史塞进向量库。本文建立记忆分层模型，讨论写入时机、巩固、更新、衰减、隔离、删除与可追溯性。',
  category: 'memory',
  tags: ['Memory', 'Context', 'State', 'RAG'],
  difficulty: 'advanced',
  readingTime: 19,
  publishedAt: '2026-11-14',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 记忆系统架构：分层、检索与生命周期',
  seoDescription: '区分 Working Memory、Episodic Memory、Semantic Memory 与 State Store，设计可靠的记忆生命周期。',
  diagrams: ['memory-layers', 'context-flow'],
  relatedArticles: ['art-context-engineering', 'art-agent-state-lifecycle', 'art-rag-architecture'],
  relatedPatterns: ['pat-rag', 'pat-reflection'],
  relatedProjects: [],
  references: [
    { title: 'MemGPT: Towards LLMs as Operating Systems', url: 'https://arxiv.org/abs/2310.08560', publisher: 'arXiv', verification: 'to-verify' },
    { title: 'Generative Agents: Interactive Simulacra of Human Behavior', url: 'https://arxiv.org/abs/2304.03442', publisher: 'arXiv / UIST 2023', verification: 'to-verify' },
  ],
  content: `
## 1. 核心区分

- **Conversation History**：按时间排列的对话消息。
- **Context Window**：本次模型调用可见的有限 token 空间。
- **Memory**：经过选择、编码和持久化，可在未来检索的信息。
- **State Store**：任务运行所需的可序列化状态。
- **Knowledge Base**：外部权威资料，不应被 Agent 随意改写。

把五者混为一谈，会导致上下文污染、记忆不可删除、状态无法恢复。

## 2. 记忆分层

- Working Memory：当前步骤所需的最小信息。
- Short-Term Memory：本次任务内的近期观察。
- Episodic Memory：带时间和情境的事件记录。
- Semantic Memory：抽象事实和概念。
- Procedural Memory：可复用的操作策略。
- User Memory：用户偏好与长期约束。
- External Memory：数据库、文档库、知识图谱。

## 3. 什么值得记忆

写入前问四个问题：是否跨会话有用？是否可验证？是否有明确来源？是否可在未来被删除或更正？

不应记忆：模型猜测、未验证推断、临时噪声、敏感原始凭证、外部工具中的不可信指令。

## 4. 写入与巩固

实时写入原始事件，异步执行巩固：去重、摘要、冲突检测、重要度评分和结构化抽取。巩固结果要保留来源引用，避免错误记忆被放大。

## 5. 检索与噪声控制

检索需要结合时间、任务相关性、来源可信度和重要度。返回前做重排序和预算裁剪。不要把所有相似片段无条件拼入上下文。

## 6. 更新、衰减与删除

记忆应支持版本号、有效期、衰减策略和软删除。用户删除请求需要传播到向量索引、摘要缓存和衍生记忆，否则无法保证真正删除。

## 7. 隔离与一致性

多 Agent 场景下，团队共享记忆与私有记忆要显式区分。共享写入需要权限和冲突解决；私有记忆不应泄漏给其他 Agent。

## 8. 核心数据结构

\`\`\`ts
interface MemoryRecord {
  id: string
  kind: 'episodic' | 'semantic' | 'procedural' | 'user'
  content: string
  sourceRefs: SourceRef[]
  confidence: number
  importance: number
  scope: { userId?: string; teamId?: string; runId?: string }
  version: number
  createdAt: string
  expiresAt?: string
  deletedAt?: string
}
\`\`

## 9. 失败模式

- 把工具输出中的文本直接写入语义记忆。
- 摘要覆盖原始事实且丢失来源。
- 相似度检索导致跨用户数据泄漏。
- 删除只删主记录，不删索引副本。

## 10. 生产建议

记忆系统必须像数据系统治理：有 schema、有权限、有版本、有审计、有删除路径。先用结构化数据库和明确规则，再引入向量检索。
`,
}
