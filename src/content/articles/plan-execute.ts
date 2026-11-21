import type { Article } from '@/types/content'

export const planExecute: Article = {
  id: 'art-plan-execute',
  slug: 'plan-and-execute',
  title: 'Plan-and-Execute：规划与执行解耦的架构代价',
  summary: 'Plan-and-Execute 通过显式计划提升可控性和可审计性，但引入计划过期、重规划和执行反馈回流问题。本文讨论它何时优于 ReAct。',
  category: 'patterns',
  tags: ['Plan-and-Execute', 'Planning', '架构', '设计模式'],
  difficulty: 'intermediate',
  readingTime: 17,
  publishedAt: '2026-11-16',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Plan-and-Execute 架构：规划与执行解耦',
  seoDescription: '分析 Plan-and-Execute 的计划表示、执行反馈、重规划条件与成本权衡。',
  diagrams: ['planner-executor', 'plan-execute-flow'],
  relatedArticles: ['art-react-pattern', 'art-planning-fundamentals', 'art-agent-architecture-map'],
  relatedPatterns: ['pat-plan-execute', 'pat-react'],
  relatedProjects: [],
  references: [
    { title: 'Plan-and-Solve Prompting', url: 'https://arxiv.org/abs/2305.04091', publisher: 'arXiv', verification: 'to-verify' },
  ],
  content: `
## 1. 它解决什么问题

ReAct 的每一步都重新决策，长任务中容易目标漂移。Plan-and-Execute 先生成完整计划，再按计划执行，使目标、步骤和状态显式化。

## 2. 核心结构

- Planner：把目标转为有序步骤和约束。
- Executor：执行单个步骤并返回结构化结果。
- Replanner：根据反馈修订剩余步骤。
- Plan Store：持久化计划版本和执行状态。

## 3. 计划表示

计划不应只是自然语言列表，而应包含依赖关系、验收条件和预算：

\`\`\`ts
interface PlanStep {
  id: string
  goal: string
  dependsOn: string[]
  acceptance: string
  toolHints: string[]
  status: 'pending' | 'running' | 'done' | 'skipped' | 'failed'
}
\`\`

## 4. 控制流

生成计划 → 选择可执行步骤 → Guardrails 校验 → 执行 → 写入结果 → 判断是否重规划 → 完成验证。

重规划触发条件包括：步骤失败、环境变化、预算不足、依赖关系失效、发现更优路径。不能每执行一步都无条件重规划，否则成本可能超过 ReAct。

## 5. 优势与代价

优势：可解释、可审计、便于并行、适合长任务。代价：计划可能基于不完整信息；执行反馈需要回流；计划版本管理复杂；前期规划耗时。

## 6. 失败模式

- 把计划当成承诺，忽略环境变化。
- 执行器擅自修改计划。
- 没有步骤级验收条件，无法判断完成。
- 重规划导致无限扩展任务范围。

## 7. 与 ReAct 比较

ReAct 更适合短循环和探索性任务；Plan-and-Execute 更适合步骤可分解、需要审计和受预算约束的任务。二者也可组合：高层使用计划，局部步骤使用 ReAct。

## 8. 测试与评测

评测计划质量需要检查步骤完整性、依赖正确性、可执行性和冗余度。系统评测还需比较重规划次数、总 token 成本和任务成功率。

## 9. 生产建议

为计划设置版本、审批策略和执行快照；对高风险步骤增加人工审批；限制最大步骤数和重规划次数。
`,
}
