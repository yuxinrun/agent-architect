import type { Article } from '@/types/content'

export const productionEngineering: Article = {
  id: 'art-production-engineering', slug: 'agent-production-engineering',
  title: '从 Demo 到 Production：Agent 系统的工程化路径',
  summary: '生产化不是加一个部署脚本，而是围绕成本、延迟、可靠性、安全、发布和事故响应建立完整体系。',
  category: 'production', tags: ['Production', 'Cost', 'Reliability', 'Deployment'],
  difficulty: 'advanced', readingTime: 21, publishedAt: '2026-11-07', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Agent 生产级工程实践路线图',
  seoDescription: '系统梳理 Agent 部署、模型路由、成本控制、可靠性、发布策略与事故分析。',
  diagrams: ['production-deployment', 'observability-architecture', 'failure-recovery'],
  relatedArticles: ['art-durable-execution', 'art-agent-evaluation', 'art-agent-security'], relatedPatterns: ['pat-budget'], relatedProjects: [],
  references: [{ title: 'Release It!', publisher: 'Pragmatic Bookshelf', verification: 'verified' }],
  content: `
## 1. Demo 与生产的差距

Demo 关注“能否完成一次”；生产关注“在真实流量、故障和变更下是否持续可靠”。差距体现在状态、权限、成本、观测和演进五个方面。

## 2. 部署架构

请求网关 → 任务队列 → Agent Worker → 模型网关/工具服务 → 状态库 → 观测系统。控制面负责配置和版本，执行面保持无状态可水平扩展。

## 3. 模型路由与回退

按任务复杂度选择模型；关键路径配置备选模型；回退时重新校验上下文兼容性。不要默认所有任务使用最强模型。

## 4. 成本控制

设置任务级 token 和步数预算；缓存稳定上下文；压缩轨迹；对小任务使用小模型；监控单位成功成本而非单纯 token 成本。

## 5. 延迟优化

并行独立工具调用；使用流式输出改善感知延迟；拆分同步和异步路径；减少不必要的模型轮次。

## 6. 可靠性

超时、重试、熔断、舱壁、幂等、队列背压和降级策略必须覆盖模型与工具两类依赖。

## 7. 发布与回滚

Agent 配置、提示、工具 schema 和模型版本都需要版本化。采用灰度发布，对比成功率和成本指标后再扩大流量。

## 8. 人工升级

当置信度低、涉及高风险动作或连续失败时，升级到人工队列。人工处理结果应回流为评测数据。

## 9. 事故分析

记录完整轨迹、配置版本和输入快照；按规划、工具、上下文、权限、系统故障分类；形成可执行的架构改进项。

## 10. 落地顺序

先可观测，再可恢复；先权限边界，再扩大自主性；先单场景稳定，再平台化。
`,
}
