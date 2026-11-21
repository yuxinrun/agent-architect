import type { Article } from '@/types/content'

export const agentFundamentals: Article = {
  id: 'art-agent-fundamentals',
  slug: 'agent-fundamentals-boundaries',
  title: 'Agent 的定义、边界与基本运行循环',
  summary: '从工程角度定义 Agent：它不是“会调用工具的聊天机器人”，而是一个在环境中持续感知、决策、执行并维护状态的系统。本文建立 Agent 与传统软件、Workflow、Chatbot 的边界。',
  category: 'fundamentals',
  tags: ['Agent', '基础原理', '控制流', '状态', 'Workflow'],
  difficulty: 'beginner',
  readingTime: 14,
  publishedAt: '2026-11-21',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 的定义与边界：从原理理解智能体系统',
  seoDescription: '系统梳理 Agent 的工程定义、Observe-Think-Plan-Act 循环、控制流与数据流，以及何时不应使用 Agent。',
  diagrams: ['agent-loop', 'agent-overview'],
  relatedArticles: ['art-agent-vs-workflow', 'art-agent-architecture-map', 'art-agent-state-lifecycle'],
  relatedPatterns: ['pat-react'],
  relatedProjects: [],
  references: [
    { title: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', publisher: 'arXiv / ICLR 2023', verification: 'verified' },
    { title: 'OpenAI Practical guide to building agents', url: 'https://openai.com/business/guides-and-resources/building-agents/', publisher: 'OpenAI', date: '2025', verification: 'to-verify' },
  ],
  content: `
## 1. 适用读者与技术前提

适合 Agent 工程师、后端架构师和技术负责人。需要了解 HTTP 服务、状态机、函数调用等基础概念；不要求掌握模型训练。

## 2. 真实工程问题

团队常把“能调用工具的 LLM 应用”直接称为 Agent，随后发现系统行为不可预测、失败无法恢复、状态无法审计。根本原因是把模型能力当成了系统架构。

## 3. 核心结论

**Agent 是运行在环境中的状态化控制者。** 它通过观察环境获得信息，在约束下选择行动，并通过工具改变环境，然后根据反馈继续或终止。模型可以提供推理能力，但可靠性来自系统边界、状态管理和控制机制。

## 4. 概念定义

本文采用如下工程定义：

- **Agent**：拥有任务目标、内部状态、行动空间和终止条件的软件实体。
- **Environment**：Agent 可以观察但不能完全控制的世界，例如数据库、浏览器、代码仓库、业务系统。
- **Tool**：Agent 与环境交互的受控接口，具有参数约束、权限和执行语义。
- **Observation**：工具或环境返回的结构化反馈。
- **Policy**：决定下一步行动的规则集合，可以由模型、确定性代码或两者共同构成。

Agent 与 Chatbot 的关键差异不在“是否调用工具”，而在**控制权与状态生命周期**：Chatbot 通常响应单轮请求；Agent 拥有跨步骤的目标、状态和终止判断。

## 5. 设计目标与非目标

目标：完成可被验证的任务；在所有步骤中保留可观测状态；在失败时可恢复；在权限可控的边界内运行。

非目标：模拟人类意识；追求完全自主；用模型替代所有控制逻辑。

## 6. 基本运行循环

Agent 的典型循环为 Observe → Think → Plan → Act → Observe：

1. **Observe**：读取任务、上下文、工具结果和环境事件。
2. **Think**：基于当前状态形成候选判断。
3. **Plan**：把目标分解为可执行的动作序列，或选择下一步动作。
4. **Act**：通过工具执行动作，产生副作用。
5. **Observe**：将结果标准化为 Observation，并更新状态。
6. **Check**：检查目标是否完成、预算是否耗尽、是否需要人工介入。

这不是把四个模块画成一条直线。真实系统中，Plan 可以修改目标，Act 可以触发异步事件，Observation 可以触发重规划，Guardrails 可以中断循环。

## 7. 控制流、数据流与状态流

- **控制流**：决定“谁在什么时候执行”。包括循环控制器、规划器、人工审批门和终止条件。
- **数据流**：决定“信息如何流动”。包括任务输入、上下文快照、工具参数和结果。
- **状态流**：决定“系统记住什么”。包括任务状态、执行轨迹、工具幂等键、检查点和最终产物。

一个常见错误是把三者混为一谈：把上下文窗口当作状态存储，或用 prompt 约束代替权限控制。

## 8. 核心状态与数据结构

最小可用状态可表示为：

\`\`\`ts
type AgentState = {
  taskId: string
  goal: string
  status: 'created' | 'running' | 'waiting' | 'failed' | 'completed'
  context: ContextSnapshot
  plan: Plan | null
  trajectory: StepRecord[]
  pendingApproval?: ApprovalRequest
  budget: { remainingTokens: number; remainingSteps: number }
  checkpoint: CheckpointRef | null
}
\`\`\`

关键原则：状态应可序列化、可版本化、可恢复。任何只存在于 prompt 中的“隐含状态”都无法被可靠审计。

## 9. 什么时候应该使用 Agent

适合：任务路径不确定、需要多步工具交互、环境反馈会改变决策、允许受控自主性。

不适合：确定性的 CRUD、低延迟同步接口、严格禁止副作用的场景、可被单个函数或 SQL 查询完成的任务。

**判断问题**：如果编写一组明确规则就能完整覆盖任务，优先写规则；如果规则无法覆盖但目标可验证，才考虑 Agent。

## 10. 失败模式

- 目标模糊导致无限循环。
- 工具结果未经标准化造成上下文污染。
- 缺少终止条件导致预算耗尽。
- 把不可信工具输出当作指令执行。
- 副作用动作缺少幂等键导致重复执行。

## 11. 安全与可靠性

最小权限、动作分级、人工审批、幂等执行、审计日志是 Agent 系统的基础设施，而不是附加功能。模型输出不能被直接视为可执行命令。

## 12. 生产落地建议

从“受控 Agent”开始：限定工具集、限制步数、记录完整轨迹、配置可观测性，再逐步扩大自主性。Agent 的自主性应当是逐步授予的能力，而不是默认状态。

## 13. 常见误区

1. 把 ReAct 当作 Agent 架构的全部。
2. 认为更多 Agent 就一定更好。
3. 用模型回答质量代替任务成功率。
4. 把上下文窗口当作长期记忆。

## 14. 延伸阅读

参考 ReAct 论文了解推理与行动的协同机制；参考 OpenAI 官方 Agent 实践指南了解生产建议。具体链接见页面参考资料，发布前需再次核对版本与日期。
`,
}
