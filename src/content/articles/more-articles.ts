import type { Article } from '@/types/content'

type Input = Omit<Article, 'content' | 'references' | 'diagrams' | 'relatedArticles' | 'relatedPatterns' | 'relatedProjects'> & {
  sections: { title: string; body: string }[]
  diagrams?: string[]
  relatedArticles?: string[]
  relatedPatterns?: string[]
  relatedProjects?: string[]
  references?: Article['references']
}

const inputs: Input[] = [
  {
    id: 'art-agent-core', slug: 'agent-core-design', title: 'Agent Core 设计：目标、策略与执行边界',
    summary: 'Agent Core 应当协调组件而不是包办所有逻辑。本文定义 Core 的职责、接口和不应承担的责任。',
    category: 'architecture', tags: ['Agent Core', '架构', '控制流'], difficulty: 'intermediate', readingTime: 12,
    publishedAt: '2026-10-31', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    seoTitle: 'Agent Core 架构设计', seoDescription: '明确 Agent Core 的目标管理、策略执行和组件协调职责。',
    sections: [
      { title: '适用读者与前提', body: '适合正在把原型循环重构成可维护系统的工程师。需要了解状态机和依赖注入。' },
      { title: '真实工程问题', body: '当核心对象同时负责提示拼装、工具调用、状态写入和权限判断时，任何一项变化都会引发全局回归。' },
      { title: '核心结论', body: 'Agent Core 只做三件事：维护目标、选择下一步策略、协调组件边界。具体能力通过接口委托。' },
      { title: '职责边界', body: 'Core 持有 Goal、PolicyRef、Budget 和 StateRef；不直接读取数据库，不直接执行工具，不直接定义权限规则。' },
      { title: '关键接口', body: '最小接口可定义为 decide(state, context) → ActionCandidate，commit(stepResult) → State，shouldStop(state) → bool。' },
      { title: '失败模式', body: 'Core 持有长期凭证；Core 内部拼接所有上下文；Core 绕过 Guardrails 调用工具。' },
      { title: '实现建议', body: '把模型调用封装为 Policy 适配器，工具调用封装为 Executor 适配器，Core 保持可单测的纯逻辑。' },
    ],
    diagrams: ['agent-overview'], relatedArticles: ['art-agent-architecture-map'], relatedPatterns: ['pat-react'],
  },
  {
    id: 'art-router-architecture', slug: 'router-agent-architecture', title: 'Router-Agent 架构：入口分流与成本控制',
    summary: 'Router 通过任务分类把请求送到合适的模型、工具子集或 Agent，是成本优化和职责隔离的关键组件。',
    category: 'architecture', tags: ['Router', '架构', 'Model Routing', '成本'], difficulty: 'intermediate', readingTime: 13,
    publishedAt: '2026-10-30', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '要解决什么', body: '不同任务对能力、延迟和成本的要求不同。统一使用最强执行路径会造成浪费。' },
      { title: '核心机制', body: 'Router 基于规则、分类器或模型判断任务类型，映射到执行目标，并记录路由理由和置信度。' },
      { title: '状态要求', body: '路由决策必须可审计：输入摘要、规则版本、目标、置信度和兜底路径都要写入轨迹。' },
      { title: '权衡', body: '细粒度路由节省成本，但增加误路由和维护成本。建议从少量粗粒度类别开始。' },
      { title: '失败模式', body: '路由到无权限工具；误路由无兜底；路由依据与任务真实难度不一致。' },
      { title: '实现建议', body: '为每类任务定义典型样例和回归集，路由变更后对比误路由率与单任务成本。' },
    ],
    diagrams: ['layered-architecture'], relatedArticles: ['art-production-engineering'], relatedPatterns: ['pat-router', 'pat-model-routing'],
  },
  {
    id: 'art-state-machine-agent', slug: 'state-machine-agent', title: 'State Machine Agent：用显式状态约束自主性',
    summary: '状态机把“允许发生什么”写进系统，而不是写进提示词。它适合生命周期明确、审计要求高的 Agent 任务。',
    category: 'runtime', tags: ['State Machine', 'Runtime', '状态'], difficulty: 'intermediate', readingTime: 13,
    publishedAt: '2026-10-29', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '工程问题', body: '自由循环 Agent 会跳过必要步骤、重复执行或无法解释当前状态。' },
      { title: '核心设计', body: '定义有限状态、事件集合和转换表。模型只能在当前状态允许的动作空间内提出建议。' },
      { title: '控制与数据', body: '状态转换由引擎执行；模型输出是事件候选，不是状态写入指令。' },
      { title: '适用场景', body: '审批流、订单异常、工单分诊、有明确阶段的文档处理。' },
      { title: '失败模式', body: '状态爆炸；非法转换被静默忽略；状态与业务数据库不同步。' },
      { title: '实现建议', body: '从 6-8 个核心状态开始，把复杂分支放到子流程，不要在主状态机中堆满条件。' },
    ],
    diagrams: ['task-lifecycle'], relatedArticles: ['art-agent-state-lifecycle'], relatedPatterns: ['pat-state-machine'],
  },
  {
    id: 'art-event-driven-agent', slug: 'event-driven-agent', title: 'Event-Driven Agent：异步环境中的协作机制',
    summary: '事件驱动架构让 Agent 能够与外部系统解耦，但带来最终一致性、幂等和顺序问题。',
    category: 'runtime', tags: ['Event-Driven', 'Runtime', '异步'], difficulty: 'advanced', readingTime: 15,
    publishedAt: '2026-10-28', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '为什么需要', body: '当任务等待时间超过请求周期、来源系统多样且无法同步调用时，事件驱动是自然选择。' },
      { title: '核心结构', body: '事件生产者、事件总线、Agent 消费者、状态物化器和死信处理。' },
      { title: '关键语义', body: '事件是不可变事实；消费者必须幂等；状态是事件流的物化视图。' },
      { title: '权衡', body: '解耦和伸缩性提升，但调试和一致性解释成本上升。' },
      { title: '失败模式', body: '重复事件导致重复副作用；乱序事件覆盖新状态；缺少死信队列。' },
      { title: '实现建议', body: '事件 ID、聚合根 ID 和版本号必须进入状态；关键消费者要有重放测试。' },
    ],
    diagrams: ['runtime-architecture'], relatedArticles: ['art-durable-execution'], relatedPatterns: ['pat-event-driven'],
  },
  {
    id: 'art-agent-as-tool', slug: 'agent-as-a-tool', title: 'Agent-as-a-Tool：复用能力而不引入复杂协作',
    summary: '把子 Agent 封装成工具，是介于单 Agent 与多 Agent 之间的实用方案。',
    category: 'architecture', tags: ['Agent-as-a-Tool', '架构', '工具'], difficulty: 'intermediate', readingTime: 12,
    publishedAt: '2026-10-27', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '问题背景', body: '团队希望复用一个专业 Agent，但不想引入消息总线、共享记忆和复杂委派协议。' },
      { title: '机制', body: '子 Agent 实现工具接口，主 Agent 像调用普通工具一样调用它，并获得结构化结果。' },
      { title: '边界', body: '子 Agent 不应继承主 Agent 的全部权限；调用要有超时、预算和结果大小限制。' },
      { title: '适用场景', body: '研究助手、代码审查器、文档分析器。' },
      { title: '失败模式', body: '无限嵌套调用；子 Agent 失败被当作空结果；上下文重复注入。' },
      { title: '实现建议', body: '为子 Agent 工具定义输入输出 schema，并记录子运行 traceId。' },
    ],
    diagrams: ['tool-sequence'], relatedArticles: ['art-tool-system'], relatedPatterns: ['pat-agent-as-tool'],
  },
  {
    id: 'art-observability', slug: 'agent-observability', title: 'Agent Observability：Trace、Metric 与轨迹回放',
    summary: 'Agent 的不可预测性要求完整记录模型输入、工具调用、状态转换和成本事件。',
    category: 'evaluation', tags: ['Observability', 'Trace', 'Metrics'], difficulty: 'advanced', readingTime: 16,
    publishedAt: '2026-10-26', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '为什么不同', body: '传统服务的单次请求通常有稳定路径；Agent 的行为是轨迹，必须按轨迹观测。' },
      { title: '三类信号', body: 'Trace 记录一次运行的完整因果链；Metric 聚合成功率、延迟和成本；Log 记录细节事件。' },
      { title: '必录字段', body: 'runId、stepId、模型版本、提示版本、工具版本、状态哈希、预算消耗和错误分类。' },
      { title: '隐私', body: '输入快照可能包含敏感数据，需要脱敏和保留策略。' },
      { title: '失败模式', body: '只有模型调用日志；工具结果不入轨迹；指标无法按任务类型拆分。' },
      { title: '实现建议', body: '先用结构化 JSONL 记录事件，再接入现有观测平台；保证 traceId 贯穿全链路。' },
    ],
    diagrams: ['observability-architecture'], relatedArticles: ['art-agent-evaluation'], relatedPatterns: ['pat-generator-verifier'],
  },
  {
    id: 'art-cost-engineering', slug: 'agent-cost-engineering', title: 'Agent 成本工程：单位成功成本比 Token 单价更重要',
    summary: '成本控制不能只靠换便宜模型；步数、重试、上下文膨胀和工具调用共同决定总账。',
    category: 'production', tags: ['Cost', 'Budget', 'Production'], difficulty: 'advanced', readingTime: 15,
    publishedAt: '2026-10-25', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '核心指标', body: '推荐跟踪单位成功成本、单步成本、无效步骤成本和重试成本，而非只看每百万 token 价格。' },
      { title: '成本来源', body: '长上下文重复注入、过多工具 schema、无意义反思、循环重规划和外部 API 调用。' },
      { title: '控制手段', body: '预算账本、上下文缓存、模型路由、轨迹压缩、工具结果裁剪和最大步数。' },
      { title: '权衡', body: '压缩可能丢失信息；小模型可能增加重试；激进缓存可能引入过期上下文。' },
      { title: '失败模式', body: '只看平均成本；忽略失败任务的沉没成本；没有按任务类别归因。' },
      { title: '实现建议', body: '为每个任务类型建立成本基线和回归阈值，把成本纳入评测看板。' },
    ],
    diagrams: ['production-deployment'], relatedArticles: ['art-production-engineering'], relatedPatterns: ['pat-budget', 'pat-model-routing'],
  },
  {
    id: 'art-incident-analysis', slug: 'agent-incident-analysis', title: 'Agent 生产事故分析：从轨迹到架构改进',
    summary: 'Agent 事故往往不是单点 bug，而是上下文、工具、规划和权限共同作用的结果。',
    category: 'production', tags: ['Incident', 'Production', '可靠性'], difficulty: 'advanced', readingTime: 14,
    publishedAt: '2026-10-24', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '事故特征', body: '同样的输入可能得到不同轨迹；失败可能由外部系统变化触发；事后难以重建模型输入。' },
      { title: '证据链', body: '输入快照、上下文快照、模型与提示版本、工具响应、状态变更、审批记录和指标曲线。' },
      { title: '归因框架', body: '按规划、上下文、工具、记忆、权限、系统和外部依赖分类，不把原因笼统归为“模型不稳定”。' },
      { title: '改进路径', body: '每项事故至少产出一个架构改进项：增加验证器、收紧权限、补检查点或修正评测集。' },
      { title: '失败模式', body: '只修改提示；没有复现轨迹；事故复盘不进入回归测试。' },
      { title: '实现建议', body: '建立事故模板和轨迹回放工具，确保复盘结论可验证。' },
    ],
    diagrams: ['failure-recovery'], relatedArticles: ['art-production-engineering', 'art-agent-evaluation'], relatedPatterns: ['pat-retry'],
  },
  {
    id: 'art-agent-boundaries', slug: 'when-not-to-use-agent', title: '什么时候不应该使用 Agent',
    summary: 'Agent 是工程方案之一，不是默认答案。本文给出明确的反向判据和替代方案。',
    category: 'fundamentals', tags: ['Agent', '决策', 'Workflow'], difficulty: 'beginner', readingTime: 11,
    publishedAt: '2026-10-23', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
    sections: [
      { title: '核心结论', body: '当任务路径、输入输出和失败语义都能被明确定义时，优先使用普通函数、SQL、确定性 Workflow 或传统服务。' },
      { title: '反向判据', body: '低延迟硬 SLA；禁止不确定副作用；结果无法验证；工具权限无法隔离；团队缺少轨迹观测能力。' },
      { title: '替代方案', body: '规则引擎适合稳定决策；Workflow 适合固定路径；RAG 问答适合知识检索；传统服务适合强一致事务。' },
      { title: '渐进路径', body: '先实现确定性流程，在无法覆盖的异常节点引入受控 Agent 工具。' },
      { title: '失败模式', body: '为了技术潮流引入 Agent；把不可验证任务交给自主循环；没有降级路径。' },
      { title: '工程建议', body: '在架构评审中要求团队写下“为什么不是 Workflow”，这是控制复杂度最有效的问题之一。' },
    ],
    diagrams: ['single-vs-multi'], relatedArticles: ['art-agent-vs-workflow', 'art-hybrid-workflow-agent'], relatedPatterns: ['pat-state-machine'],
  },
]

export const moreArticles: Article[] = inputs.map((input) => ({
  id: input.id,
  slug: input.slug,
  title: input.title,
  summary: input.summary,
  category: input.category,
  tags: input.tags,
  difficulty: input.difficulty,
  readingTime: input.readingTime,
  publishedAt: input.publishedAt,
  updatedAt: input.updatedAt,
  author: input.author,
  seoTitle: input.seoTitle,
  seoDescription: input.seoDescription,
  status: 'published',
  relatedArticles: input.relatedArticles ?? [],
  relatedPatterns: input.relatedPatterns ?? [],
  relatedProjects: input.relatedProjects ?? [],
  diagrams: input.diagrams ?? [],
  references: input.references ?? [],
  content: input.sections.map((s) => `## ${s.title}\n\n${s.body}`).join('\n\n'),
}))
