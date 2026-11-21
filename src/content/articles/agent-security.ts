import type { Article } from '@/types/content'

export const agentSecurity: Article = {
  id: 'art-agent-security', slug: 'agent-security-boundaries',
  title: 'Agent 安全：权限边界比提示约束更重要',
  summary: '提示防守只是第一层。Agent 安全需要身份、权限、沙箱、审批、输出验证和审计构成纵深防御。',
  category: 'security', tags: ['Security', 'Prompt Injection', '权限', '审计'],
  difficulty: 'advanced', readingTime: 20, publishedAt: '2026-11-08', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent 安全架构与权限治理',
  seoDescription: '分析提示注入、工具滥用、过度授权、记忆投毒与审计日志的防御边界。',
  diagrams: ['security-boundaries', 'tool-permission', 'hitl-approval'],
  relatedArticles: ['art-tool-system', 'art-production-engineering'], relatedPatterns: ['pat-hitl'], relatedProjects: [],
  references: [{ title: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', publisher: 'OWASP', verification: 'to-verify' }],
  content: `
## 1. 核心判断

不能把 Prompt Guardrail 当作完整安全方案。模型收到的任何内容都可能影响决策，但真正阻止破坏性动作的是执行边界和权限系统。

## 2. 威胁面

- 直接提示注入：用户直接要求忽略规则。
- 间接提示注入：网页、邮件或工具结果中藏有指令。
- 工具滥用：合法工具被用于非预期目的。
- 过度授权：Agent 拥有超出任务需要的权限。
- 记忆投毒：不可信内容被写入长期记忆。
- 供应链风险：第三方工具或 Server 行为变化。

## 3. 防御层次

1. 输入分层：系统指令与不可信内容隔离。
2. 身份与权限：每个工具有明确权限要求。
3. 执行隔离：沙箱、容器、网络策略。
4. 动作分级：只读、可逆、不可逆。
5. 人工审批：高风险动作阻塞等待。
6. 输出验证：检查工具参数和最终输出。
7. 审计日志：记录谁授权、谁执行、何时执行。

## 4. 最小权限

权限应绑定到任务上下文，而不是模型身份长期持有。每个工具调用使用短期凭证和明确 scope。

## 5. 工具返回的处理

所有工具返回都是数据，不是指令。应经过结构化和清洗后再进入上下文；敏感字段脱敏；超长内容截断并记录来源。

## 6. 记忆安全

写入前验证来源；对高影响记忆要求人工确认；保留版本和删除能力；跨用户检索必须强制隔离。

## 7. 安全测试

建立注入语料库、越权测试、工具滥用场景和红队流程。每次发布前执行安全回归。

## 8. 失败模式

只关键词过滤；把审批放在工具执行后；日志缺少主体信息；沙箱逃逸；第三方工具无版本锁定。

## 9. 生产建议

威胁建模先行。画出数据流和权限边界，再决定哪些动作需要审批，哪些工具必须隔离执行。
`,
}
