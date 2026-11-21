import type { Article } from '@/types/content'

export const agentStateLifecycle: Article = {
  id: 'art-agent-state-lifecycle',
  slug: 'agent-state-lifecycle',
  title: 'Agent 状态与任务生命周期：从 Created 到 Completed',
  summary: '任务状态不是消息列表。本文给出 Agent 任务的状态机、事件日志、检查点与恢复语义，并说明如何处理 Waiting、Failed 和 Cancelled。',
  category: 'fundamentals',
  tags: ['状态', 'Runtime', 'Checkpoint', '生命周期'],
  difficulty: 'intermediate',
  readingTime: 15,
  publishedAt: '2026-11-18',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 任务生命周期与状态管理',
  seoDescription: '设计可恢复、可审计的 Agent 任务状态机，理解 Waiting、Failed、Checkpoint 与 Resume 的语义。',
  diagrams: ['task-lifecycle', 'durable-execution'],
  relatedArticles: ['art-agent-fundamentals', 'art-durable-execution', 'art-memory-fundamentals'],
  relatedPatterns: ['pat-checkpoint', 'pat-hitl'],
  relatedProjects: [],
  references: [
    { title: 'Temporal documentation: durable execution', url: 'https://docs.temporal.io/', publisher: 'Temporal', verification: 'to-verify' },
  ],
  content: `
## 1. 工程问题

一个 Agent 任务可能运行数分钟甚至数天，期间需要等待模型、调用外部 API、暂停等待人工审批或遭遇进程重启。没有明确状态机时，系统无法回答“任务现在在哪里、能否安全重试”。

## 2. 状态机

基础状态：

- Created：任务已接收，尚未开始。
- Planned：目标已分解为计划。
- Running：正在执行动作。
- Waiting：等待外部事件或人工审批。
- Failed：发生不可继续错误。
- Cancelled：被用户或系统取消。
- Completed：目标达成并通过验证。

转换必须由事件驱动，而不是由模型自由修改。例如 approve 事件才能将 Waiting 转为 Running。

## 3. 事件日志与检查点

事件日志记录“发生了什么”，检查点记录“恢复到哪里”。二者不可互相替代：

- 事件日志适合审计、回放和问题定位。
- 检查点适合快速恢复执行。
- 状态视图是当前状态的物化结果。

## 4. 幂等与恢复

每个副作用动作都应携带幂等键。恢复时根据动作记录和外部系统回查决定是否跳过，而不是盲目重放。

## 5. 核心数据结构

\`\`\`ts
type TaskEvent =
  | { type: 'created'; runId: string; at: string }
  | { type: 'plan.ready'; planId: string; at: string }
  | { type: 'tool.called'; tool: string; idempotencyKey: string; at: string }
  | { type: 'approval.requested'; approvalId: string; at: string }
  | { type: 'approval.granted'; approvalId: string; at: string }
  | { type: 'run.failed'; reason: string; at: string }

interface Checkpoint {
  runId: string
  stepIndex: number
  stateHash: string
  createdAt: string
}
\`\`\`

## 6. 失败模式

- 把 Waiting 实现为线程 sleep，进程重启后丢失。
- 失败后从第一步重放，造成重复副作用。
- 取消只停止前端轮询，后端继续执行。
- 状态更新与工具执行不在同一事务边界内。

## 7. 生产建议

将长任务建模为“状态机 + 事件日志 + 恢复策略”。人工审批使用持久化的 ApprovalRequest；外部调用使用幂等键；取消信号需要在每个长步骤检查。
`,
}
