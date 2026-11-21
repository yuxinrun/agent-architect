import type { Article } from '@/types/content'

export const planningFundamentals: Article = {
  id: 'art-planning-fundamentals', slug: 'planning-fundamentals',
  title: 'Agent Planning：任务分解、重规划与不确定性',
  summary: '规划质量直接决定任务成功率、成本和可控性。本文区分模型内部推理与系统外部可观测计划，并给出规划状态模型。',
  category: 'planning', tags: ['Planning', 'Task Decomposition', 'Replanning', 'Budget'],
  difficulty: 'advanced', readingTime: 17, publishedAt: '2026-11-11', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent 规划系统：分解、重规划与预算约束',
  seoDescription: '研究任务分解、计划验证、动态重规划和长程任务的工程机制。',
  diagrams: ['planner-executor', 'plan-execute-flow'],
  relatedArticles: ['art-plan-execute', 'art-react-pattern', 'art-durable-execution'], relatedPatterns: ['pat-plan-execute'], relatedProjects: [],
  references: [{ title: 'Tree of Thoughts', url: 'https://arxiv.org/abs/2305.10601', publisher: 'arXiv / NeurIPS 2023', verification: 'to-verify' }],
  content: `
## 1. 规划不是“让模型想得更多”

模型内部推理过程不可直接审计；系统规划必须是可序列化、可验证、可版本化的外部结构。二者的边界必须清楚。

## 2. 规划系统的输入

目标、约束、当前状态、可用工具、预算、历史失败和环境不确定性。缺少约束的规划会生成看似合理但不可执行的步骤。

## 3. 任务分解原则

每个步骤应有明确输入、输出和验收条件。步骤间依赖应显式表达。分解粒度过粗会导致执行失控，过细则增加调度成本。

## 4. 重规划触发

步骤失败、目标变化、外部状态变化、预算异常、发现新信息。重规划必须保留旧版本，以便审计和回滚。

## 5. 不确定性处理

对不可预测结果，使用试探性步骤和验证步骤；不要假设工具调用一定成功。长程任务需要分层计划：里程碑、子计划和动作。

## 6. 规划质量评测

指标包括步骤可执行率、依赖正确率、冗余率、重规划次数、单位成功成本。不能只评价计划文本是否“看起来合理”。

## 7. 失败模式

计划范围蔓延；忽略工具能力边界；把推测写成事实；没有预算意识；规划与执行状态不同步。

## 8. 工程建议

从最小计划结构开始，只记录目标、依赖、验收和状态。只有当数据证明规划质量成为瓶颈时，再引入搜索或树搜索策略。
`,
}
