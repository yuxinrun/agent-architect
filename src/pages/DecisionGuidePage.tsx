import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const questions = [
  { id: 'planning', title: '任务是否需要自主规划？', desc: '路径可枚举时优先确定性流程。', options: ['不需要', '局部动态规划', '高度动态'] },
  { id: 'multiStep', title: '是否需要多步骤执行？', desc: '步骤越多，状态与恢复越重要。', options: ['单步', '少量步骤', '多步骤'] },
  { id: 'longRunning', title: '是否需要长期运行？', desc: '超过请求周期就必须考虑持久化。', options: ['秒级', '分钟级', '小时或天级'] },
  { id: 'memory', title: '是否需要长期记忆？', desc: '记忆意味着写入、删除、隐私和检索治理。', options: ['不需要', '用户偏好', '复杂长期记忆'] },
  { id: 'multiAgent', title: '是否需要多个 Agent 协作？', desc: '拆分应基于职责和权限隔离。', options: ['单 Agent', '局部专业 Agent', '多 Agent 协作'] },
  { id: 'tools', title: '是否需要访问外部工具？', desc: '工具越多，权限、schema 和错误治理成本越高。', options: ['无工具', '少量工具', '大量工具'] },
  { id: 'sensitive', title: '是否涉及敏感操作？', desc: '资金、删除、发布、变更类操作需要严格边界。', options: ['无副作用', '可逆副作用', '不可逆动作'] },
  { id: 'approval', title: '是否需要人工审批？', desc: '审批会带来等待态和状态持久化需求。', options: ['不需要', '部分动作', '关键动作必须'] },
  { id: 'durable', title: '是否需要持久化执行？', desc: '崩溃恢复、重放和续跑是否属于硬要求。', options: ['不需要', '建议具备', '必须具备'] },
  { id: 'concurrency', title: '是否需要并发处理？', desc: '并发引入资源峰值与状态竞争。', options: ['串行', '有限并发', '高并发'] },
  { id: 'tenant', title: '是否需要多租户？', desc: '多租户要求数据、工具、配额和审计隔离。', options: ['单租户', '多租户'] },
  { id: 'latency', title: '对延迟的要求？', desc: '低延迟场景应减少模型与工具轮次。', options: ['严格', '中等', '宽松'] },
  { id: 'cost', title: '对成本的要求？', desc: '成本敏感时应引入预算账本和模型路由。', options: ['严格控制', '平衡', '质量优先'] },
  { id: 'reliability', title: '对可靠性的要求？', desc: '任务失败代价决定验证与冗余强度。', options: ['标准', '高可靠', '关键任务'] },
]

type Result = {
  architecture: string
  components: string[]
  executionMode: string
  multiAgent: string
  workflow: string
  memory: string
  durable: string
  security: string[]
  evaluation: string[]
  risks: string[]
  reasons: string[]
}

function recommend(a: Record<string, string>): Result {
  const dynamic = a.planning !== '不需要'
  const manySteps = a.multiStep === '多步骤'
  const needDurable = a.durable === '必须具备' || a.longRunning === '小时或天级' || a.approval === '关键动作必须'
  const needMemory = a.memory === '复杂长期记忆'
  const localMemory = a.memory === '用户偏好'
  const multi = a.multiAgent === '多 Agent 协作'
  const localAgent = a.multiAgent === '局部专业 Agent'
  const manyTools = a.tools === '大量工具'
  const sensitive = a.sensitive === '不可逆动作' || a.sensitive === '可逆副作用'
  const approval = a.approval === '关键动作必须'
  const tenant = a.tenant === '多租户'
  const strictLatency = a.latency === '严格'
  const tightCost = a.cost === '严格控制'
  const highReliability = a.reliability !== '标准'

  const architecture = dynamic
    ? (multi ? 'Supervisor + Worker 多 Agent 架构' : manySteps ? 'Planner-Executor + State Graph 架构' : '受控 ReAct Agent 架构')
    : (manySteps || a.multiStep === '少量步骤' ? '确定性 Workflow 骨架 + 局部 Agent 节点' : '普通函数 / 确定性服务')

  const components = [
    dynamic ? 'Agent Core + Planner' : '确定性 Workflow Engine',
    manyTools ? 'Tool Registry + Discovery' : '轻量 Tool Registry',
    needMemory || localMemory ? 'Memory / User Memory' : '会话上下文即可',
    needDurable ? 'Durable Runtime + Checkpoint' : 'In-memory Runtime',
    sensitive ? 'Policy Gate + Approval + Audit Log' : '基础 Guardrails',
    tenant ? 'Tenant Router + 配额隔离' : '单租户状态存储',
    highReliability ? 'Trace + Metrics + Regression Gate' : '基础日志',
  ]

  const security: string[] = []
  if (sensitive) security.push('动作风险分级与最小权限')
  if (approval) security.push('Human-in-the-Loop 审批门与等待态')
  if (manyTools) security.push('工具 schema 校验、权限策略和调用审计')
  if (tenant) security.push('租户级身份、数据与配额隔离')
  if (a.tools === '少量工具') security.push('工具白名单与超时限制')
  if (security.length === 0) security.push('基础输入校验与输出验证')

  const evaluation = [
    '任务成功率与停止条件达成率',
    '工具选择准确率与执行成功率',
    '轨迹正确性与无效步骤比例',
  ]
  if (needMemory) evaluation.push('记忆写入准确率、检索噪声与删除可验证性')
  if (multi) evaluation.push('重复工作率、冲突率与循环委派率')
  if (needDurable) evaluation.push('恢复成功率与检查点一致性')
  if (tightCost) evaluation.push('单位成功成本与重试成本')

  const risks = [
    dynamic ? '模型规划不稳定导致轨迹膨胀' : '需求变化导致流程僵化',
    manyTools ? '工具选择错误与权限过宽' : '工具能力不足',
    needDurable ? '检查点与外部副作用不一致' : '进程重启后进度丢失',
    multi ? '通信成本、重复工作与冲突' : '单 Agent 上下文瓶颈',
    strictLatency ? '多轮模型调用导致延迟超标' : '延迟可接受但成本需观察',
  ]
  if (tenant) risks.push('跨租户数据泄漏')
  if (sensitive) risks.push('不可逆动作缺少审批或补偿')

  const reasons = [
    dynamic ? '任务存在运行时不确定性，需要决策循环。' : '路径可枚举时，确定性流程降低故障面。',
    manySteps ? '多步骤任务需要显式状态与恢复点。' : '步骤有限时可保持轻量执行。',
    needDurable ? '长任务、审批等待或崩溃恢复属于硬约束。' : '短请求无需承担持久化复杂度。',
    needMemory ? '长期记忆需要完整生命周期治理。' : localMemory ? '用户偏好可用轻量结构化记忆。' : '暂不引入记忆系统，避免过早复杂化。',
    multi ? '多 Agent 提供职责与权限隔离，但必须有协调者。' : localAgent ? '局部专业 Agent 可作为工具复用，先于完整多 Agent。' : '单 Agent 是默认基线。',
    sensitive ? '敏感动作必须由策略、审批和审计约束。' : '低风险动作可降低审批延迟。',
    tenant ? '多租户要求身份、数据、工具和配额同时隔离。' : '单租户可简化治理。',
  ]

  return {
    architecture,
    components,
    executionMode: needDurable ? '异步事件驱动 + 检查点续跑' : manySteps ? '同步循环 + 显式状态' : '单请求同步执行',
    multiAgent: multi ? '需要：Supervisor + 明确 owner + 最大委派深度' : localAgent ? '可选：Agent-as-a-Tool 或 Handoff' : '不需要：先使用单 Agent',
    workflow: dynamic ? '需要：Agent 节点嵌入确定性骨架' : '需要：以确定性 Workflow 为主',
    memory: needMemory ? '需要：分层 Memory + 检索/删除/版本' : localMemory ? '轻量 User Memory' : '不需要长期记忆',
    durable: needDurable ? '必须具备：事件日志、Checkpoint、Resume' : a.durable === '建议具备' ? '建议具备：至少保存任务状态' : '暂不需要',
    security,
    evaluation,
    risks,
    reasons,
  }
}

export function DecisionGuidePage() {
  useDocumentTitle('架构决策工具 V2', '通过 14 个工程条件生成可解释的参考架构建议。')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result | null>(null)
  const completed = Object.keys(answers).length

  const markdown = useMemo(() => {
    if (!result) return ''
    return `# Agent 架构决策记录\n\n## 输入条件\n\n${questions.map((q) => `- ${q.title}：${answers[q.id] ?? '未选择'}`).join('\n')}\n\n## 参考架构\n\n${result.architecture}\n\n## 推荐组件\n\n${result.components.map((c) => `- ${c}`).join('\n')}\n\n## 执行模式\n\n- 执行模式：${result.executionMode}\n- Multi-Agent：${result.multiAgent}\n- Workflow：${result.workflow}\n- Memory：${result.memory}\n- Durable Execution：${result.durable}\n\n## 安全控制\n\n${result.security.map((s) => `- ${s}`).join('\n')}\n\n## 评测建议\n\n${result.evaluation.map((s) => `- ${s}`).join('\n')}\n\n## 主要风险\n\n${result.risks.map((s) => `- ${s}`).join('\n')}\n\n## 决策理由\n\n${result.reasons.map((s) => `- ${s}`).join('\n')}\n\n> 本记录由本地决策辅助工具生成，仅作为架构讨论输入，不代表唯一正确答案。\n`
  }, [answers, result])

  const exportMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'agent-architecture-decision.md'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="page-header"><div className="container page-header-inner">
        <nav className="breadcrumbs"><Link to="/">首页</Link><span>/</span><span>架构决策</span></nav>
        <span className="eyebrow">Architecture Decision Guide V2</span><h1>Agent 架构决策工具</h1>
        <p>通过 14 个工程条件生成带理由的参考架构。它帮助团队把约束翻译成架构讨论输入，不冒充唯一正确答案；全部计算在本地完成。</p>
      </div></div>
      <div className="container section">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div>
            {questions.map((q, i) => (
              <div className="decision-step" key={q.id}>
                <span className="section-index">Q{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{ marginTop: 6 }}>{q.title}</h3>
                <p className="text-small text-muted">{q.desc}</p>
                <div className="decision-options">
                  {q.options.map((option) => (
                    <button key={option} type="button" className={answers[q.id] === option ? 'selected' : ''} onClick={() => setAnswers({ ...answers, [q.id]: option })}>{option}</button>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary" disabled={completed < questions.length} onClick={() => setResult(recommend(answers))} style={{ marginTop: 8 }}>
              生成参考建议（{completed}/{questions.length}）
            </button>
            <button type="button" className="btn btn-outline" style={{ marginLeft: 8, marginTop: 8 }} onClick={() => { setAnswers({}); setResult(null) }}>重置条件</button>
          </div>
          <div>
            {!result ? (
              <div className="card">
                <h3>你会得到什么</h3>
                <ul className="text-muted">
                  <li>推荐架构类型与核心组件</li>
                  <li>Multi-Agent / Workflow / Memory / Durable 判断</li>
                  <li>安全控制、评测建议和主要风险</li>
                  <li>可导出的 Markdown 架构决策记录</li>
                </ul>
                <p className="text-small" style={{ marginTop: 16 }}>推荐结果基于你选择的约束生成，仍需结合原型验证、威胁建模和容量评估。</p>
              </div>
            ) : (
              <div className="result-panel">
                <h3>推荐架构</h3>
                <p style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{result.architecture}</p>
                <h3 style={{ marginTop: 20 }}>核心组件</h3><ul>{result.components.map((c) => <li key={c}>{c}</li>)}</ul>
                <h3 style={{ marginTop: 20 }}>执行与能力判断</h3>
                <div className="kv-list">
                  <div className="kv-row"><strong>执行模式</strong><span>{result.executionMode}</span></div>
                  <div className="kv-row"><strong>Multi-Agent</strong><span>{result.multiAgent}</span></div>
                  <div className="kv-row"><strong>Workflow</strong><span>{result.workflow}</span></div>
                  <div className="kv-row"><strong>Memory</strong><span>{result.memory}</span></div>
                  <div className="kv-row"><strong>Durable</strong><span>{result.durable}</span></div>
                </div>
                <h3 style={{ marginTop: 20 }}>安全控制</h3><ul>{result.security.map((s) => <li key={s}>{s}</li>)}</ul>
                <h3 style={{ marginTop: 20 }}>评测建议</h3><ul>{result.evaluation.map((s) => <li key={s}>{s}</li>)}</ul>
                <h3 style={{ marginTop: 20 }}>主要风险</h3><ul>{result.risks.map((s) => <li key={s}>{s}</li>)}</ul>
                <h3 style={{ marginTop: 20 }}>决策理由</h3><ul>{result.reasons.map((s) => <li key={s}>{s}</li>)}</ul>
                <div className="tag-row" style={{ marginTop: 20 }}>
                  <button type="button" className="btn btn-ghost" onClick={exportMarkdown}>导出 Markdown</button>
                  <Link className="btn btn-ghost" to="/architecture">查看架构方案</Link>
                  <Link className="btn btn-ghost" to="/blueprints">查看项目模板</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
