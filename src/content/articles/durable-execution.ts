import type { Article } from '@/types/content'

export const durableExecution: Article = {
  id: 'art-durable-execution', slug: 'durable-execution',
  title: 'Durable Execution：让 Agent 能够崩溃后继续',
  summary: '长时 Agent 必须面对进程重启、外部延迟和重复事件。本文分析事件日志、检查点、幂等和恢复边界。',
  category: 'runtime', tags: ['Runtime', 'Checkpoint', 'Recovery', 'Async'],
  difficulty: 'advanced', readingTime: 18, publishedAt: '2026-11-10', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent Durable Execution 架构与恢复机制',
  seoDescription: '理解检查点、事件日志、幂等键和恢复策略如何支撑长时间运行的 Agent。',
  diagrams: ['durable-execution', 'runtime-architecture', 'failure-recovery'],
  relatedArticles: ['art-agent-state-lifecycle', 'art-production-engineering'], relatedPatterns: ['pat-checkpoint', 'pat-retry'], relatedProjects: [],
  references: [{ title: 'Temporal durable execution documentation', url: 'https://docs.temporal.io/', publisher: 'Temporal', verification: 'to-verify' }],
  content: `
## 1. 工程问题

一次模型调用可能耗时数秒，工具调用可能耗时数分钟，人工审批可能耗时数天。把 Agent 实现为单个同步请求，会在任何中断面前丢失进度。

## 2. 持久化执行模型

将执行拆成事件和状态：事件不可变，状态可重建。每个外部副作用都绑定幂等键。运行时根据检查点恢复，而不是盲目重放整个轨迹。

## 3. 恢复边界

恢复边界应选择在状态稳定、副作用可确认的位置。例如工具完成后写入结果和下一步计划之前。不要在外部 API 调用过程中保存不完整状态。

## 4. 幂等策略

- 查询类：直接重试。
- 条件更新：带版本号或事务。
- 创建资源：客户端生成唯一键。
- 发送消息：先查外部回执。
- 不可逆动作：进入审批且只允许一次。

## 5. 取消与超时

取消信号必须持久化，并在每个长步骤边界检查。超时应区分模型超时、工具超时和整体任务超时。

## 6. 架构组件

任务队列、调度器、执行器、状态库、事件日志、恢复器、监控。队列只负责任务分发，不负责业务状态。

## 7. 失败模式

恢复后重复扣款；事件顺序导致旧状态覆盖新状态；检查点 schema 不兼容；取消后继续产生副作用。

## 8. 生产建议

把每个工具调用视为分布式事务边界，设计可查询的外部回执。对关键任务定期演练故障注入和恢复。
`,
}
