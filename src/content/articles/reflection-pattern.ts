import type { Article } from '@/types/content'

export const reflectionPattern: Article = {
  id: 'art-reflection-pattern', slug: 'reflection-and-reflexion',
  title: 'Reflection 与 Reflexion：反馈回路的两种实现',
  summary: 'Reflection 是当前任务内的结果修订，Reflexion 更强调跨尝试的经验记忆。二者有相似流程，但状态边界不同。',
  category: 'patterns', tags: ['Reflection', 'Reflexion', 'Memory', 'Evaluation'],
  difficulty: 'intermediate', readingTime: 14, publishedAt: '2026-11-02', updatedAt: '2026-11-21', author: 'Agent 架构研究所',
  seoTitle: 'Reflection 与 Reflexion 模式对比',
  seoDescription: '比较结果修订与经验记忆两种反馈机制的状态需求和适用场景。',
  diagrams: ['reflection-architecture'],
  relatedArticles: ['art-react-pattern', 'art-memory-fundamentals'], relatedPatterns: ['pat-reflection'], relatedProjects: [],
  references: [
    { title: 'Reflexion: Language Agents with Verbal Reinforcement Learning', url: 'https://arxiv.org/abs/2303.11366', publisher: 'arXiv / NeurIPS 2023', verification: 'verified' },
    { title: 'Self-Refine', url: 'https://arxiv.org/abs/2303.17651', publisher: 'arXiv', verification: 'to-verify' },
  ],
  content: `
## 1. 二者差异

Reflection：生成 → 评估 → 修订，反馈主要服务于当前输出。Reflexion：失败 → 反思 → 经验记忆 → 下一轮尝试，反馈跨任务或跨尝试持久化。

## 2. 为什么区分

如果反馈只在当前上下文中使用，它是上下文工程问题；如果反馈需要持久化并被未来任务检索，它就是记忆系统问题。

## 3. 评估器设计

评估器应输出结构化问题列表和建议，而不是笼统分数。评估标准来自任务验收条件，不能只凭模型偏好。

## 4. 状态模型

Reflection 保存草稿版本和评审记录；Reflexion 额外保存经验记录、来源尝试和置信度。

## 5. 失败模式

同源偏差：生成器和评估器共享同样盲点。错误经验：失败反思归纳出错误策略。无限修订：没有质量阈值和轮次上限。

## 6. 适用场景

Reflection 适合代码、文档和方案修订；Reflexion 适合允许重复尝试且有明确失败信号的任务。

## 7. 工程建议

把评估器配置独立于生成器；限制修订轮次；经验记忆写入前验证并标注来源。
`,
}
