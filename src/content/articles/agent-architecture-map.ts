import type { Article } from '@/types/content'

export const agentArchitectureMap: Article = {
  id: 'art-agent-architecture-map',
  slug: 'agent-architecture-map',
  title: 'Agent 系统架构全景：十一个组件的边界',
  summary: '系统拆解 Agent Core、Planner、Executor、Memory、Tool Registry、Context Manager、State Store、Runtime、Guardrails、Observability 与 Environment 的职责边界。',
  category: 'architecture',
  tags: ['架构', 'Agent Core', 'Runtime', 'Memory', 'Guardrails'],
  difficulty: 'intermediate',
  readingTime: 18,
  publishedAt: '2026-11-19',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 系统架构全景：核心组件与边界划分',
  seoDescription: '深入理解 Agent Core、Planner、Executor、Memory、Tool Registry 等组件的职责、依赖和控制关系。',
  diagrams: ['agent-overview', 'layered-architecture', 'runtime-architecture'],
  relatedArticles: ['art-agent-fundamentals', 'art-agent-state-lifecycle', 'art-context-engineering'],
  relatedPatterns: ['pat-react', 'pat-plan-execute'],
  relatedProjects: [],
  references: [
    { title: 'LangGraph documentation: graphs, state, and durability', url: 'https://langchain-ai.github.io/langgraph/', publisher: 'LangChain', verification: 'to-verify' },
    { title: 'Model Context Protocol specification', url: 'https://modelcontextprotocol.io/', publisher: 'MCP', verification: 'to-verify' },
  ],
  content: `
## 1. 工程问题

大多数 Agent 项目初期只有一个循环函数：读取消息、调用模型、解析工具调用、更新消息列表。随着工具、状态和团队规模增长，这个函数会变成无法测试的“上帝对象”。

## 2. 核心结论

架构设计的本质是**划分边界**：把推理、执行、状态、权限和观测分离，使每个部分可以独立测试、替换和演进。

## 3. 十一个核心组件

1. **Agent Core**：维护目标与决策策略，协调其他组件；不应直接持有业务权限。
2. **Planner**：把目标转成计划或候选动作；输出应是结构化、可验证的。
3. **Executor**：执行已批准的动作，处理超时、重试和幂等。
4. **Memory**：保存跨步骤或跨会话的信息；不等同于 Context Window。
5. **Tool Registry**：注册工具 schema、权限、执行器与超时策略。
6. **Context Manager**：根据当前任务构建上下文，负责选择、压缩与优先级。
7. **State Store**：持久化任务状态、检查点和事件日志。
8. **Runtime**：提供调度、并发、取消、恢复和隔离能力。
9. **Guardrails**：执行权限校验、输入输出验证和策略约束。
10. **Observability**：采集 trace、metric、log 和轨迹数据。
11. **Environment**：工具作用的外部世界，包含不可信输入。

## 4. 依赖关系原则

- Agent Core 依赖抽象接口，不依赖具体工具实现。
- Planner 不直接执行副作用。
- Executor 不自行决定业务目标。
- Memory 写入需要经过验证和来源标注。
- Guardrails 必须在工具执行前生效。
- Observability 贯穿所有组件，而不是只在模型调用处打点。

## 5. 控制流与数据流

控制流：Runtime 启动任务 → Agent Core 请求上下文 → Planner 产出动作 → Guardrails 校验 → Executor 调用工具 → Observation 回写状态 → 判断继续/终止。

数据流：任务输入、上下文快照、工具参数、工具结果和最终产物均通过明确的数据结构传递。禁止把关键状态隐藏在字符串 prompt 中。

## 6. 最小状态模型

\`\`\`ts
interface AgentRun {
  runId: string
  goal: Goal
  status: RunStatus
  plan?: Plan
  contextVersion: number
  stateRef: string
  trajectoryRef: string
  budget: Budget
  owner: Principal
}
\`\`\`

## 7. 复杂度与成本

单 Agent 最小架构可以在数天内实现，但缺少恢复和审计；完整平台架构需要状态服务、队列、权限系统和可观测性，成本显著增加。架构复杂度应与任务风险匹配。

## 8. 失败模式

- Planner 与 Executor 共享可变状态导致竞态。
- Tool Registry 只保存 schema，不保存权限与幂等策略。
- Memory 与 State Store 混用，无法区分事实和错误推断。
- Guardrails 只检查模型输出，不检查工具返回。

## 9. 实现建议

先定义接口契约，再实现组件。所有跨边界调用都应可追踪；所有工具执行都应有超时、幂等键和审计记录。

## 10. 与其他架构比较

分层架构强调层级边界；事件驱动架构强调异步解耦；Graph 架构强调显式状态转换。它们不是互斥关系，生产系统常组合使用。
`,
}
