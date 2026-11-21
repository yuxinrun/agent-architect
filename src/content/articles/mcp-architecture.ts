import type { Article } from '@/types/content'

export const mcpArchitecture: Article = {
  id: 'art-mcp-architecture', slug: 'mcp-architecture',
  title: 'MCP 架构解析：工具互操作不等于工具治理',
  summary: 'MCP 标准化了工具与上下文的暴露方式，但权限、幂等、审计和信任边界仍由 Host 与应用负责。',
  category: 'tool-use', tags: ['MCP', 'Tool Calling', '协议', 'Security'],
  difficulty: 'intermediate', readingTime: 14, publishedAt: '2026-11-04', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'MCP Client-Server 架构与边界',
  seoDescription: '理解 MCP Host、Client、Server 的职责，以及它不解决的治理问题。',
  diagrams: ['mcp-architecture'],
  relatedArticles: ['art-tool-system', 'art-tool-permission'], relatedPatterns: ['pat-tool-calling'], relatedProjects: ['proj-mcp'],
  references: [{ title: 'Model Context Protocol specification', url: 'https://modelcontextprotocol.io/', publisher: 'MCP', verification: 'to-verify' }],
  content: `
## 1. 核心结构

MCP 通常由 Host、Client、Server 组成。Host 是 AI 应用，Client 维护与 Server 的连接，Server 暴露工具、资源和提示能力。

## 2. 解决的问题

工具发现、能力描述和调用协议的标准化，使不同应用可以复用同一批工具 Server。

## 3. 不解决的问题

MCP 不自动提供业务权限模型；不保证 Server 可信；不定义事务语义；不替代幂等键、审计和审批。

## 4. 调用流程

能力发现 → 工具 schema 注入 → 模型提出调用 → Host 权限校验 → Client 调用 Server → 结果清洗 → 回写轨迹。

## 5. 信任边界

Server 返回内容是数据而非指令。第三方 Server 应被视为不可信输入源，需限制网络、文件和数据访问范围。

## 6. 工程建议

为 MCP Server 建立版本锁定、权限清单、超时策略和错误码映射。在 Host 侧统一记录工具调用轨迹。

## 7. 与 A2A 的关系

MCP 面向工具与上下文连接；A2A 更关注 Agent 之间的互操作。两者解决的是不同边界问题，不能互相替代。

## 8. 结论

把 MCP 当作工具协议层，而不是 Agent 架构本身。
`,
}
