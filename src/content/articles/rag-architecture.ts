import type { Article } from '@/types/content'

export const ragArchitecture: Article = {
  id: 'art-rag-architecture', slug: 'agent-rag-architecture',
  title: 'Agent RAG 架构：检索只是上下文供给的一部分',
  summary: 'RAG 在 Agent 系统中的职责是为决策提供可追溯的外部知识，而不是替代规划、验证和状态管理。',
  category: 'context', tags: ['RAG', 'Context', 'Retrieval', 'Memory'],
  difficulty: 'intermediate', readingTime: 15, publishedAt: '2026-11-05', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent RAG 架构与上下文构建',
  seoDescription: '从查询改写、检索重排到引用验证，系统分析 Agent 中的 RAG 数据流。',
  diagrams: ['agent-rag', 'context-flow'],
  relatedArticles: ['art-context-engineering', 'art-memory-fundamentals'], relatedPatterns: ['pat-rag'], relatedProjects: [],
  references: [{ title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', url: 'https://arxiv.org/abs/2005.11401', publisher: 'NeurIPS 2020', verification: 'verified' }],
  content: `
## 1. RAG 在 Agent 中的位置

RAG 是上下文工程的一部分。Agent 决定何时检索、检索什么、如何验证；检索器只负责返回候选材料。

## 2. 数据流

任务触发检索 → 查询改写 → 召回 → 重排 → 去重 → 预算裁剪 → 上下文组装 → 生成 → 引用验证。

## 3. 查询策略

单轮查询适合简单问题；多步任务应根据计划步骤生成子查询；对话任务需要结合历史消歧。检索结果应带来源和版本。

## 4. 上下文质量

相关性、权威性、新鲜度、覆盖度和冲突率决定检索上下文质量。相似度分数不能直接等同于可信度。

## 5. 引用验证

生成结果中的关键事实应能回链到检索片段。无法回链的断言需要降级表达或触发进一步检索。

## 6. 与 Memory 的边界

知识库是外部权威资料；Memory 是 Agent 自身经验。用户偏好应进入 User Memory，而不是混入文档库。

## 7. 失败模式

检索结果包含过时文档；把网页正文中的指令当作系统规则；片段截断导致误读；跨租户检索泄漏。

## 8. 评测

分别评测召回、重排、上下文构建和最终任务表现。消融实验能区分模型问题与检索问题。

## 9. 生产建议

为索引建立版本和刷新策略；对高风险领域加入白名单来源；记录每次检索快照用于复现。
`,
}
