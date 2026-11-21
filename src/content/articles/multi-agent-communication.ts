import type { Article } from '@/types/content'

export const multiAgentCommunication: Article = {
  id: 'art-multi-agent-communication', slug: 'multi-agent-communication',
  title: '多 Agent 消息协议与冲突解决',
  summary: '多 Agent 系统失败通常不是因为模型不够强，而是因为消息语义、任务所有权和冲突处理没有设计好。',
  category: 'multi-agent', tags: ['Multi-Agent', 'Message Protocol', 'Conflict', 'Deadlock'],
  difficulty: 'advanced', readingTime: 17, publishedAt: '2026-11-01', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: '多 Agent 通信协议与协调机制',
  seoDescription: '设计消息格式、任务所有权、冲突解决、死锁预防与多 Agent 评测。',
  diagrams: ['agent-messages', 'supervisor-architecture', 'single-vs-multi'],
  relatedArticles: ['art-multi-agent-fundamentals', 'art-agent-evaluation'], relatedPatterns: ['pat-supervisor', 'pat-handoff'], relatedProjects: [],
  references: [{ title: 'AutoGen paper', url: 'https://arxiv.org/abs/2308.08155', publisher: 'arXiv', verification: 'to-verify' }],
  content: `
## 1. 消息不是对话文本

多 Agent 消息应是结构化事件，包含 sender、receiver、taskId、type、payload、correlationId 和 timestamp。自然语言内容只是 payload 的一部分。

## 2. 通信模式

点对点适合明确委派；广播适合公告，但容易制造噪声；共享黑板适合结果汇总，但需要并发控制。

## 3. 任务所有权

一个任务在同一时刻只能有一个 owner。认领操作应原子化，防止重复执行。结果提交需要校验 owner 身份。

## 4. 冲突解决

常见策略包括投票、权威角色裁决、证据优先级和人工仲裁。选择哪种策略取决于任务是否可验证。

## 5. 死锁与循环委派

设置最大跳数、委派深度和等待超时；维护访问路径；检测到循环时升级到 Supervisor 或人工。

## 6. 通信成本

每条消息都会消耗上下文和 token。应压缩中间消息，只保留结论、证据和状态变化。

## 7. 安全边界

Agent 之间传递的内容同样是不可信输入。低权限 Agent 不能通过消息诱导高权限 Agent 执行敏感操作。

## 8. 评测

统计消息数、重复工作率、冲突率、死锁率、总成本和最终成功率。缺少这些指标，很难判断多 Agent 是否真的有价值。

## 9. 结论

先设计协议和状态，再选择框架。对话只是表达方式，协调机制才是系统核心。
`,
}
