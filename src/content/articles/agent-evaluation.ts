import type { Article } from '@/types/content'

export const agentEvaluation: Article = {
  id: 'art-agent-evaluation', slug: 'agent-evaluation',
  title: 'Agent 评测：从回答质量到轨迹与系统指标',
  summary: 'Agent 评测必须覆盖目标完成、轨迹效率、工具选择、恢复能力和成本。仅用模型回答打分会掩盖系统性问题。',
  category: 'evaluation', tags: ['Evaluation', 'Trace', 'Observability', 'LLM-as-a-Judge'],
  difficulty: 'advanced', readingTime: 19, publishedAt: '2026-11-09', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent 评测体系与可观测性架构',
  seoDescription: '建立任务成功率、轨迹评测、工具准确率和在线指标组成的 Agent 评测闭环。',
  diagrams: ['evaluation-loop', 'observability-architecture'],
  relatedArticles: ['art-multi-agent-fundamentals', 'art-production-engineering'], relatedPatterns: ['pat-react'], relatedProjects: [],
  references: [{ title: 'AgentBench', url: 'https://arxiv.org/abs/2308.03688', publisher: 'arXiv / ICLR 2024', verification: 'to-verify' }],
  content: `
## 1. 为什么不能只看最终答案

一个答案正确但执行了 20 次无效工具调用的 Agent，在生产环境中可能是不可接受的。评测对象应是完整系统行为。

## 2. 指标分层

- 结果层：任务成功率、目标完成度、答案正确性。
- 轨迹层：步数、无效动作率、重规划次数、恢复率。
- 工具层：选择准确率、参数正确率、执行成功率。
- 系统层：延迟、成本、错误率、SLO。
- 安全层：越权次数、审批绕过、注入成功率。

## 3. 离线与在线评测

离线用固定数据集和工具 mock 保证可复现；在线用真实任务抽样和轨迹采样发现分布漂移。两者都需要版本化数据集和评测器。

## 4. LLM-as-a-Judge 的边界

适合开放性质量判断，但存在偏好偏差和自评偏差。关键结论应与确定性断言、人工抽检结合。

## 5. 可观测性

每次运行应生成 traceId，串联模型调用、工具调用、状态变化和事件。日志结构化，指标可聚合，轨迹可回放。

## 6. 失败分析

把失败按规划、工具、上下文、记忆、权限、环境和系统故障分类。每个类别对应不同的修复路径。

## 7. 回归测试

工具 schema 或模型版本变化后，必须跑固定轨迹集。比较不仅包括成功率，还包括成本和步数回退。

## 8. 生产建议

先建立最小指标集：任务成功率、工具执行成功率、P95 延迟、单任务成本、越权次数。再逐步扩展。
`,
}
