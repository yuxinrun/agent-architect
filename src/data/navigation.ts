import type { SectionId } from '@/types/content'
import { domains } from './domains'

export interface NavItem {
  id: SectionId
  name: string
  en: string
  path: string
  description: string
  icon: string
  group: 'foundation' | 'system' | 'engineering' | 'reference'
}

export const navItems: NavItem[] = [
  { id: 'fundamentals', name: '基础原理', en: 'Agent Fundamentals', path: '/fundamentals', description: '建立 Agent 系统的第一性原理：边界、循环、控制流与适用条件。', icon: '01', group: 'foundation' },
  { id: 'architecture', name: '整体架构', en: 'Agent Architecture', path: '/architecture', description: '系统研究单 Agent、多 Agent、运行时与平台架构的模块边界和权衡。', icon: '02', group: 'system' },
  { id: 'patterns', name: '设计模式', en: 'Agent Design Patterns', path: '/patterns', description: '从 ReAct 到 HITL，梳理模式的执行流程、控制权归属与工程代价。', icon: '03', group: 'system' },
  { id: 'planning', name: '规划与决策', en: 'Agent Planning', path: '/planning', description: '任务分解、重规划、约束感知规划与长程任务的决策机制。', icon: '04', group: 'system' },
  { id: 'memory', name: '记忆与状态', en: 'Agent Memory', path: '/memory', description: '区分记忆、上下文、状态与知识库，设计可控的记忆生命周期。', icon: '05', group: 'system' },
  { id: 'tool-use', name: '工具系统', en: 'Tool Use', path: '/tool-use', description: '工具注册、验证、权限、执行隔离、重试与结果标准化。', icon: '06', group: 'system' },
  { id: 'multi-agent', name: '多智能体', en: 'Multi-Agent Systems', path: '/multi-agent', description: '协作、委派、通信、冲突解决与多 Agent 复杂度控制。', icon: '07', group: 'system' },
  { id: 'runtime', name: '运行时', en: 'Agent Runtime', path: '/runtime', description: '异步执行、检查点、恢复、排队、限流与沙箱隔离。', icon: '08', group: 'engineering' },
  { id: 'context', name: '上下文工程', en: 'Context Engineering', path: '/context', description: '上下文选择、压缩、优先级、缓存与质量评估。', icon: '09', group: 'engineering' },
  { id: 'evaluation', name: '评测与可观测性', en: 'Agent Evaluation', path: '/evaluation', description: '轨迹评测、工具准确率、在线评估与全链路追踪。', icon: '10', group: 'engineering' },
  { id: 'security', name: '安全与治理', en: 'Agent Security', path: '/security', description: '权限边界、提示注入、工具滥用、审批与审计。', icon: '11', group: 'engineering' },
  { id: 'production', name: '生产工程', en: 'Production Engineering', path: '/production', description: '从 Demo 到生产：成本、延迟、可靠性、发布与事故分析。', icon: '12', group: 'engineering' },
  { id: 'cases', name: '架构案例', en: 'Architecture Case Studies', path: '/cases', description: '基于官方文档与源码的开源 Agent 项目架构拆解。', icon: '13', group: 'reference' },
  { id: 'books', name: '书籍导读', en: 'Books & Papers', path: '/books', description: 'Agent 架构相关的软件工程、ML 系统与 AI 工程书籍索引。', icon: '14', group: 'reference' },
  { id: 'papers', name: '论文解读', en: 'Papers', path: '/papers', description: 'Agent 研究论文的问题、方法、架构、贡献与工程启发。', icon: '15', group: 'reference' },
  { id: 'roadmap', name: '学习路线', en: 'Learning Roadmap', path: '/roadmap', description: '从 LLM 基础到生产工程的阶段化学习路径。', icon: '16', group: 'reference' },
]

export const domainNavItems: NavItem[] = domains.map((d) => ({
  id: d.id as SectionId,
  name: d.name,
  en: d.en,
  path: d.path,
  description: d.summary,
  icon: d.no,
  group: d.no <= '04' ? 'foundation' : d.no <= '09' ? 'system' : d.no <= '12' ? 'engineering' : 'reference',
}))

export const domainGroups: { id: string; label: string; items: NavItem[] }[] = [
  { id: 'core', label: '理论与架构', items: domainNavItems.slice(0, 4) },
  { id: 'capability', label: '能力与运行', items: domainNavItems.slice(4, 9) },
  { id: 'operations', label: '工程与运营', items: domainNavItems.slice(9, 12) },
  { id: 'extension', label: '应用与前沿', items: domainNavItems.slice(12) },
]

export const toolNavItems: NavItem[] = [
  { id: 'patterns', name: '设计模式', en: 'Design Patterns', path: '/patterns', description: '模式浏览器', icon: 'T1', group: 'system' },
  { id: 'roadmap', name: '学习路线', en: 'Roadmap', path: '/roadmap', description: '阶段化学习路线', icon: 'T2', group: 'reference' },
  { id: 'about', name: '关于本站', en: 'About', path: '/about', description: '内容与引用规范', icon: 'T3', group: 'reference' },
]

export const aboutNav: NavItem = {
  id: 'about', name: '关于本站', en: 'About', path: '/about',
  description: '了解 Agent 架构研究所的定位、内容原则与引用规范。', icon: '17', group: 'reference',
}

export const navGroups: { id: string; label: string; items: NavItem[] }[] = [
  { id: 'foundation', label: '基础', items: navItems.filter((i) => i.group === 'foundation') },
  { id: 'system', label: '系统架构', items: navItems.filter((i) => i.group === 'system') },
  { id: 'engineering', label: '工程实践', items: navItems.filter((i) => i.group === 'engineering') },
  { id: 'reference', label: '研究与资料', items: [...navItems.filter((i) => i.group === 'reference'), aboutNav] },
]

const normalizeKey = (value: string) => value.trim().replace(/^#/, '').replace(/^\/+/, '').toLowerCase()

const sectionAliases: Record<string, string> = {
  mcp: 'protocols', a2a: 'protocols', protocol: 'protocols', interoperability: 'protocols',
  agentengineering: 'engineering', engineeringpractice: 'engineering',
  architecture: 'architecture', agentarchitecture: 'architecture',
  agent: 'multi-agent', agents: 'multi-agent', multiagentsystems: 'multi-agent',
  agentworkflow: 'workflow', orchestration: 'workflow',
  agentframework: 'frameworks', framework: 'frameworks',
  mechanism: 'mechanisms', coremechanisms: 'mechanisms',
  memorycontext: 'memory-context', memory: 'memory-context', context: 'memory-context',
  agentsandbox: 'runtime', infrastructure: 'runtime',
  agentsecurity: 'security', governance: 'security',
  agentevaluation: 'evaluation', reliability: 'evaluation',
  agentproduction: 'production', productionengineering: 'production',
  applications: 'applications', agentapplications: 'applications',
  research: 'research', opensource: 'research',
  agentproduct: 'product', business: 'product',
  future: 'future', futureofagents: 'future',
}

export const getSection = (id: string): NavItem | undefined => {
  const key = normalizeKey(id)
  const canonical = sectionAliases[key] ?? key
  const all = [...domainNavItems, ...navItems, ...toolNavItems, aboutNav]
  return all.find((item) =>
    normalizeKey(item.id) === canonical ||
    normalizeKey(item.path) === canonical ||
    normalizeKey(item.id) === key ||
    normalizeKey(item.path) === key,
  )
}
