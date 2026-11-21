import type { Article } from '@/types/content'

export const multiAgentFundamentals: Article = {
  id: 'art-multi-agent-fundamentals',
  slug: 'multi-agent-fundamentals',
  title: '多 Agent 系统：什么时候拆分才真正有价值',
  summary: '多 Agent 不是默认答案。本文从职责边界、通信成本、冲突解决和评测复杂度分析何时应该拆分 Agent。',
  category: 'multi-agent',
  tags: ['Multi-Agent', 'Supervisor', '协作', '架构'],
  difficulty: 'intermediate',
  readingTime: 16,
  publishedAt: '2026-11-12',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: '多 Agent 系统架构：是否应该拆分 Agent',
  seoDescription: '分析多 Agent 的收益、通信成本、职责边界、循环委派与评测复杂度。',
  diagrams: ['supervisor-architecture', 'agent-messages', 'single-vs-multi'],
  relatedArticles: ['art-agent-architecture-map', 'art-tool-system', 'art-agent-evaluation'],
  relatedPatterns: ['pat-supervisor', 'pat-handoff'],
  relatedProjects: [],
  references: [
    { title: 'AutoGen: Enabling next-gen LLM applications via multi-agent conversation', url: 'https://arxiv.org/abs/2308.08155', publisher: 'arXiv', verification: 'to-verify' },
  ],
  content: `
## 1. 为什么需要多个 Agent

多 Agent 的核心价值不是“更像团队”，而是**隔离职责、上下文和权限**。当单一 Agent 的上下文被不同任务目标污染，或不同任务需要不同工具权限时，拆分才有工程意义。

## 2. 拆分判据

满足以下至少两项时再考虑拆分：

1. 子任务需要显著不同的工具集或权限。
2. 子任务上下文可以独立且不会频繁互相依赖。
3. 子任务可并行且有明确合并规则。
4. 不同角色需要不同模型或提示策略。
5. 单点失败影响范围需要隔离。

## 3. 常见架构

- Supervisor-Worker：中心协调者分发任务，适合职责清晰。
- Hierarchical：多层委派，适合大型任务树。
- Peer-to-Peer：Agent 直接协商，灵活但难调试。
- Debate：多视角辩论，适合判断类任务但成本高。
- Handoff：按条件转移控制权，适合客服或分诊场景。

## 4. 通信成本

多 Agent 的代价主要在消息往返、上下文重复、状态同步和冲突处理。若子任务之间需要频繁交换细节，拆分可能降低整体性能。

## 5. 防止重复工作

每个子任务必须绑定唯一 taskId 和所有权；共享结果写入共享状态前要查重；Supervisor 维护任务依赖图，避免多个 Agent 同时认领同一任务。

## 6. 循环委派

必须设置最大跳数、访问记录和回退策略。Agent 看到自己或循环路径再次出现时，应停止委派并上报。

## 7. 状态与记忆

共享记忆适合稳定事实；任务状态应由协调者或状态服务持有；私有记忆不应自动广播。所有跨 Agent 消息应带来源、任务 ID 和时间戳。

## 8. 评测

多 Agent 不能只看最终答案。还要统计消息数、重复工作率、委派深度、冲突次数、单 Agent 贡献度和总 token 成本。

## 9. 失败模式

职责定义重叠；Agent 互相等待导致死锁；消息协议不统一；错误在 Agent 间放大；一个 Agent 的输出被另一个当作权威指令。

## 10. 结论

先优化单 Agent 的上下文、工具和状态。只有当边界和收益可以被清晰说明时，再引入多 Agent。
`,
}
