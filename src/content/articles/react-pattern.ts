import type { Article } from '@/types/content'

export const reactPattern: Article = {
  id: 'art-react-pattern',
  slug: 'react-pattern-deep-dive',
  title: 'ReAct 深度解析：推理与行动的协同循环',
  summary: 'ReAct 不是“让模型多想几步”，而是把推理轨迹、工具行动和环境观察组织成可追踪的决策循环。本文分析其控制流、状态需求、失败边界与工程实现。',
  category: 'patterns',
  tags: ['ReAct', '设计模式', 'Planning', 'Tool Calling'],
  difficulty: 'intermediate',
  readingTime: 16,
  publishedAt: '2026-11-17',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'ReAct 模式深度解析：流程、状态与工程边界',
  seoDescription: '理解 ReAct 的 Thought-Action-Observation 循环、终止条件、失败模式与实现要点。',
  diagrams: ['react-flow', 'agent-loop'],
  relatedArticles: ['art-plan-execute', 'art-tool-system', 'art-planning-fundamentals'],
  relatedPatterns: ['pat-react', 'pat-reflection'],
  relatedProjects: [],
  references: [
    { title: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', publisher: 'arXiv / ICLR 2023', verification: 'verified' },
  ],
  content: `
## 1. 它解决什么问题

单纯 Chain-of-Thought 无法接触外部世界；单纯工具调用缺少显式推理和纠错。ReAct 将推理与行动交替进行，使模型能根据观察调整下一步。

## 2. 核心机制

每一步包含 Thought、Action、Observation：

1. Thought：根据当前目标与观察形成下一步判断。
2. Action：选择一个工具及参数。
3. Observation：执行工具并标准化返回。
4. 判断是否结束或进入下一轮。

工程上，Thought 不应被视为可靠事实来源；真正可信的是工具结果和经过验证的状态。

## 3. 控制权归属

控制权在循环控制器，而不是一次模型调用。循环控制器负责步数上限、预算、终止条件和异常中断。模型只提供候选动作。

## 4. 状态需求

至少需要任务状态、最近观察、压缩后的轨迹和预算状态。完整轨迹会随步数增长，必须通过摘要或窗口策略控制上下文。

\`\`\`python
for step in range(max_steps):
    prompt = assemble(task, observations[-k:], compact(trajectory))
    decision = model.decide(prompt)
    if decision.final:
        return validate(decision.answer)
    result = tools.execute(decision.tool, decision.args,
                           idempotency_key=step_key(run_id, step))
    observation = normalize(result)
    trajectory.append(step_record(decision, observation))
\`\`\`

## 5. 适用边界

适合需要多步查询、搜索、验证和工具交互的任务。不适合高吞吐低延迟路径、所有分支已知的流程，或需要严格形式化保证的控制任务。

## 6. 失败模式

- 工具返回错误被模型当作正常事实。
- 循环缺少最大步数和成本上限。
- 轨迹未压缩导致上下文膨胀。
- 模型重复调用同一工具且没有进展检测。
- 观察结果包含提示注入内容。

## 7. 工程代价

ReAct 实现简单，但调试成本会随循环步数上升。必须记录每一步输入、决策、工具结果和状态变更，否则难以复现失败。

## 8. 测试与评测

评测不只看最终答案，还要看工具选择准确率、无效步骤比例、恢复率和轨迹效率。可设置固定工具 mock 做确定性回归测试。

## 9. 常见误区

把 ReAct 当作唯一 Agent 架构；把 Thought 文本直接暴露给最终用户；没有动作验证就执行工具；忽略失败观察的标准化。
`,
}
