import type { Article } from '@/types/content'

export const hybridWorkflowAgent: Article = {
  id: 'art-hybrid-workflow-agent', slug: 'hybrid-workflow-agent',
  title: 'Workflow + Agent 混合架构：用确定性骨架约束自主性',
  summary: '生产系统通常不是纯 Agent。本文讨论如何以 Workflow 保证关键路径，同时只在必要节点引入 Agent。',
  category: 'architecture', tags: ['Architecture', 'Workflow', 'Agent', 'Guardrails'],
  difficulty: 'intermediate', readingTime: 15, publishedAt: '2026-11-03', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Workflow 与 Agent 混合架构设计',
  seoDescription: '在确定性流程中引入受控 Agent 节点，平衡可预测性与灵活性。',
  diagrams: ['layered-architecture', 'agent-overview'],
  relatedArticles: ['art-agent-vs-workflow', 'art-agent-architecture-map'], relatedPatterns: ['pat-state-machine'], relatedProjects: [],
  references: [{ title: 'Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', publisher: 'Anthropic', verification: 'to-verify' }],
  content: `
## 1. 为什么需要混合架构

纯 Workflow 无法处理非结构化输入和异常；纯 Agent 难以保证关键路径的确定性。混合架构把二者放在合适的位置。

## 2. 结构

确定性节点负责校验、状态转换、支付和权限；Agent 节点负责理解、分类、生成和有限决策。二者通过明确契约交互。

## 3. Agent 节点契约

输入输出 schema、允许工具、预算、超时、失败降级和审计字段必须在流程定义中声明。

## 4. 失败隔离

Agent 节点失败不能破坏事务边界。它应返回结构化失败结果，由 Workflow 决定重试、转人工或终止。

## 5. 适用场景

客服工单、订单异常处理、文档审核、代码变更流水线等既有确定步骤又有判断步骤的任务。

## 6. 失败模式

Agent 节点拥有过宽工具权限；流程等待不可控的模型输出；Agent 直接修改流程状态；失败结果没有降级路径。

## 7. 评测

分别评测流程可靠性和 Agent 节点质量。端到端成功率应能分解到每个节点的贡献。

## 8. 结论

混合架构不是妥协，而是生产系统常见的理性选择。
`,
}
