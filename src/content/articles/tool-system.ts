import type { Article } from '@/types/content'

export const toolSystem: Article = {
  id: 'art-tool-system',
  slug: 'tool-system-design',
  title: 'Agent 工具系统设计：从 Schema 到安全执行',
  summary: '工具系统是 Agent 的行动接口。本文系统讨论工具注册、发现、选择、参数验证、权限、超时、幂等、结果标准化与可观测性。',
  category: 'tool-use',
  tags: ['Tool Calling', 'MCP', '权限', '工具系统'],
  difficulty: 'advanced',
  readingTime: 20,
  publishedAt: '2026-11-15',
  updatedAt: '2026-11-21',
  author: 'Agent 架构研究所',
  seoTitle: 'Agent 工具系统架构设计',
  seoDescription: '设计安全、稳定、可扩展、可观测的 Agent 工具系统，覆盖注册、权限、重试与结果标准化。',
  diagrams: ['tool-sequence', 'tool-permission', 'mcp-architecture'],
  relatedArticles: ['art-react-pattern', 'art-tool-permission', 'art-mcp-architecture'],
  relatedPatterns: ['pat-tool-calling', 'pat-retry'],
  relatedProjects: [],
  references: [
    { title: 'Model Context Protocol specification', url: 'https://modelcontextprotocol.io/', publisher: 'MCP', verification: 'to-verify' },
    { title: 'OpenAI function calling documentation', url: 'https://platform.openai.com/docs/guides/function-calling', publisher: 'OpenAI', verification: 'to-verify' },
  ],
  content: `
## 1. 工程问题

模型生成的工具参数只是候选值。若直接调用业务 API，会出现参数越界、权限绕过、重复副作用、错误结果污染上下文等问题。

## 2. 工具系统分层

工具系统至少包含四层：

1. **Schema 层**：描述工具名称、参数、返回结构和语义边界。
2. **Registry 层**：管理版本、权限、超时、重试策略和实现映射。
3. **Execution 层**：执行调用，处理隔离、取消、幂等和错误分类。
4. **Observation 层**：把结果标准化为模型可消费且可追溯的结构。

## 3. 工具定义

\`\`\`ts
interface ToolDefinition {
  name: string
  version: string
  description: string
  inputSchema: JsonSchema
  outputSchema: JsonSchema
  permission: PermissionRequirement
  timeoutMs: number
  retryPolicy: RetryPolicy
  idempotent: boolean
  sideEffect: 'none' | 'reversible' | 'irreversible'
  handler: ToolHandler
}
\`\`

## 4. 调用流程

模型提出调用 → Schema 验证 → 权限校验 → 风险分级 → 获取幂等键 → 执行 → 超时/错误分类 → 结果标准化 → 写入轨迹。

工具返回应区分 success、validation_error、permission_denied、timeout、external_error 和 cancelled。不要用一段模糊字符串表达所有错误。

## 5. 工具发现与选择

工具数量增多时，不能把全部 schema 塞进上下文。可按任务标签、权限和工具描述做检索，动态暴露候选工具。工具描述应写清楚“何时使用、何时不要使用、副作用和风险”。

## 6. MCP 与协议边界

MCP 解决工具发现与协议互操作问题，但不自动解决权限模型、审计、幂等和业务事务语义。Host、Client、Server 的边界必须明确，服务端返回内容仍应视为不可信输入。

## 7. 幂等与重试

只读工具可安全重试；写操作必须使用幂等键或先查询状态。不可逆动作应进入审批流程。重试策略要区分网络错误、限流和业务错误。

## 8. 失败模式

- 工具描述与实际行为不一致。
- 结果过大导致上下文爆炸。
- 工具输出包含指令型文本造成注入。
- 权限检查发生在执行之后。
- 多个工具共享可变全局状态。

## 9. 测试与评测

对每个工具建立 schema 单测、权限测试、超时模拟、幂等测试和结果结构测试。评测 Agent 时单独统计工具选择准确率和工具执行成功率。

## 10. 生产建议

工具系统应像 API 网关一样治理：注册、版本、权限、配额、监控、审计和弃用策略缺一不可。
`,
}
