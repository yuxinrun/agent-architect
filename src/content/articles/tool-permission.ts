import type { Article } from '@/types/content'

export const toolPermission: Article = {
  id: 'art-tool-permission', slug: 'tool-permission',
  title: '工具权限控制：Agent 行动边界的设计方法',
  summary: '工具权限必须独立于模型提示实现。本文给出动作分级、权限策略、审批门控、审计与沙箱的工程设计。',
  category: 'security', tags: ['Tool Calling', 'Permission', 'Security', 'HITL'],
  difficulty: 'advanced', readingTime: 16, publishedAt: '2026-11-06', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent 工具权限与审批边界设计',
  seoDescription: '设计基于身份、动作级别和任务上下文的工具权限系统。',
  diagrams: ['tool-permission', 'hitl-approval'],
  relatedArticles: ['art-tool-system', 'art-agent-security'], relatedPatterns: ['pat-hitl', 'pat-tool-calling'], relatedProjects: [],
  references: [{ title: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', publisher: 'OWASP', verification: 'to-verify' }],
  content: `
## 1. 权限模型

权限判断不应依赖模型是否“听话”。每次工具执行前都要基于主体、工具、参数、任务上下文和风险级别做决策。

## 2. 动作分级

- L0 只读：查询和检索。
- L1 可逆：创建草稿、临时缓存。
- L2 有影响：修改业务记录、发送通知。
- L3 不可逆：支付、删除、对外发布。

级别越高，验证越严格；L2 以上建议引入审批。

## 3. 策略结构

\`\`\`ts
interface ToolPolicy {
  tool: string
  principal: Principal
  scope: string[]
  maxRisk: RiskLevel
  requireApproval: boolean
  conditions: PolicyCondition[]
}
\`\`

## 4. 执行链路

参数验证 → 身份解析 → 策略匹配 → 风险分级 → 审批门控 → 获取短期凭证 → 执行 → 审计。

## 5. 审计内容

记录任务 ID、主体、工具版本、参数摘要、策略版本、审批人、执行结果和时间。敏感字段脱敏，但保留可追溯性。

## 6. 沙箱

代码执行、浏览器操作等能力应运行在隔离环境：限制文件系统、网络、CPU、内存和执行时间。沙箱不是权限系统的替代品，而是第二层防线。

## 7. 失败模式

权限缓存在长期 Agent 进程中过期；参数中隐藏高风险目标；审批只做 UI 不阻断后端；审计日志不完整。

## 8. 测试

对每个权限策略做拒绝路径测试；模拟参数变形；验证审批过期；检查跨租户越权。

## 9. 结论

最小权限、显式审批和完整审计构成 Agent 行动边界的三大支柱。
`,
}
