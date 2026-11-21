import type { Article } from '@/types/content'

export const contextEngineering: Article = {
  id: 'art-context-engineering',
  slug: 'context-engineering',
  title: 'Context Engineering：为 Agent 构建可控的信息环境',
  summary: 'Prompt Engineering 关注表达，Context Engineering 关注信息供给。本文讨论上下文选择、压缩、优先级、组装、缓存和质量评估。',
  category: 'context',
  tags: ['Context', 'Prompt', 'RAG', '缓存'],
  difficulty: 'advanced',
  readingTime: 18,
  publishedAt: '2026-11-13',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: '上下文工程：Agent 的上下文构建与治理',
  seoDescription: '系统介绍 Context Engineering 的数据流、预算控制、压缩策略、指令层级和质量评估。',
  diagrams: ['context-flow', 'agent-rag'],
  relatedArticles: ['art-memory-fundamentals', 'art-rag-architecture', 'art-agent-architecture-map'],
  relatedPatterns: ['pat-rag', 'pat-budget'],
  relatedProjects: [],
  references: [
    { title: 'Effective context engineering for AI agents', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', publisher: 'Anthropic Engineering', date: '2025', verification: 'to-verify' },
  ],
  content: `
## 1. 职责边界

Prompt Engineering 关注“如何写指令”；Context Engineering 关注“模型在决策时看到什么、以什么顺序看到、看到多少、来自哪里”。在高阶 Agent 中，后者对系统行为影响更大。

## 2. 上下文来源

任务描述、系统策略、工具 schema、近期轨迹、检索结果、记忆记录、环境状态和外部事件。每一类信息应有来源标识和可信度。

## 3. 构建流程

采集 → 过滤 → 去重 → 排序 → 压缩 → 预算分配 → 组装 → 缓存 → 质量评估。

上下文不是越多越好。无关信息会稀释关键指令，冲突信息会降低决策稳定性。

## 4. 指令层级

明确优先级：系统策略 > 任务约束 > 工具契约 > 检索资料 > 对话内容 > 工具返回。低优先级内容不能覆盖高优先级规则。这个层级需要在提示结构和执行策略中同时体现。

## 5. 压缩策略

- 截断：简单但可能丢失关键结论。
- 摘要：节省空间但可能引入幻觉。
- 结构化提炼：保留实体、状态、决策和未完成事项。
- 分层检索：只加载当前步骤相关片段。

## 6. 缓存与成本

稳定前缀可缓存，动态部分应后置。频繁变化的少量内容不要放在长前缀中间，否则会破坏缓存命中。

## 7. 质量评估

评估维度包括相关性、完整性、新鲜度、冲突率、来源可追溯性、token 效率和任务贡献度。可以通过消融实验比较不同上下文策略对成功率的影响。

## 8. 失败模式

- 把不可信工具返回放在高优先级位置。
- 摘要没有保留来源引用。
- 所有工具 schema 全量注入。
- 上下文版本与状态版本不一致。

## 9. 实现建议

为每个上下文构建结果生成 ContextSnapshot，记录来源、版本、token 数和构建策略。快照写入轨迹，便于复现模型输入。
`,
}
