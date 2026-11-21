import type { Article } from '@/types/content'

export const agentVsWorkflow: Article = {
  id: 'art-agent-vs-workflow',
  slug: 'agent-vs-workflow-vs-chatbot',
  title: 'Agent、Workflow 与 Chatbot：三种控制范式的边界',
  summary: 'Agent 不是 Workflow 的升级版，也不是 Chatbot 的别名。三者的差异体现在控制权归属、状态模型、失败语义和可预测性上。',
  category: 'fundamentals',
  tags: ['Agent', 'Workflow', 'Chatbot', '控制流'],
  difficulty: 'beginner',
  readingTime: 11,
  publishedAt: '2026-11-20',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 与 Workflow、Chatbot 的区别',
  seoDescription: '从控制权、状态、失败语义和工程成本四个维度区分 Agent、Workflow 与 Chatbot。',
  diagrams: ['agent-loop'],
  relatedArticles: ['art-agent-fundamentals', 'art-agent-architecture-map', 'art-hybrid-workflow-agent'],
  relatedPatterns: ['pat-state-machine'],
  relatedProjects: [],
  references: [
    { title: 'Workflow patterns for agentic systems', url: 'https://www.anthropic.com/engineering/building-effective-agents', publisher: 'Anthropic Engineering', date: '2024', verification: 'to-verify' },
  ],
  content: `
## 1. 真实工程问题

同一个“自动处理客服工单”需求，可以被实现成 Chatbot、Workflow 或 Agent。选错范式会导致系统要么过度复杂，要么无法处理真实变化。

## 2. 核心结论

- **Chatbot**：以对话为中心，控制权主要在用户和响应生成器。
- **Workflow**：以预定义路径为中心，控制权在流程定义。
- **Agent**：以目标为中心，控制权在运行时决策者，但受约束边界限制。

## 3. 对比维度

| 维度 | Chatbot | Workflow | Agent |
| --- | --- | --- | --- |
| 目标表达 | 用户消息 | 流程节点 | 任务目标 + 约束 |
| 控制流 | 请求/响应 | 显式 DAG | 运行时决策循环 |
| 状态 | 会话历史 | 流程实例状态 | 任务状态 + 轨迹 + 记忆 |
| 可预测性 | 中 | 高 | 中低 |
| 适合失败 | 重试请求 | 补偿事务 | 重规划/恢复 |
| 工程重点 | 对话体验 | 编排和幂等 | 控制、状态、边界 |

## 4. 为什么不能只看“是否调用工具”

Workflow 可以调用工具，Agent 也可以执行固定步骤。真正的区别是：**动作序列是否在运行时由系统根据状态决定**。如果所有分支都由开发者预先枚举，它仍然是 Workflow。

## 5. 混合架构更常见

生产系统经常采用“确定性骨架 + 局部自主”：关键路径由 Workflow 保证，模糊步骤交给 Agent。例如：订单校验 → Agent 判断异常原因 → 审批 → 发货。这样的系统既可控又能处理非结构化输入。

## 6. 决策准则

按以下顺序判断：

1. 路径是否完全已知？已知则 Workflow。
2. 是否需要多轮环境反馈？需要则考虑 Agent。
3. 是否允许不确定执行时间？不允许则避免开放循环。
4. 动作是否有副作用？有则增加审批、幂等和审计。

## 7. 失败模式

把 Agent 放进强一致事务链路；把 Workflow 的动态分支全部交给模型；把 Chatbot 的对话历史当作任务状态。

## 8. 工程建议

先用 Workflow 画出可控边界，仅在必须处理不确定性的节点引入 Agent，并为该节点定义输入输出契约、预算和失败降级策略。
`,
}
