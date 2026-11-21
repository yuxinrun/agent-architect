import { useId } from 'react'
import type { DiagramMeta } from '@/types/content'
import { diagrams } from '@/data/diagrams'
import { v2Graphs } from '@/data/diagrams-v2'
import { cn } from '@/lib/utils'

type Node = { id: string; label: string; sub?: string; x: number; y: number; w?: number; h?: number; kind?: 'input' | 'core' | 'plan' | 'memory' | 'tool' | 'env' | 'output' | 'guard' | 'storage' }
type Edge = { from: string; to: string; label?: string; dashed?: boolean; reverse?: boolean; curved?: boolean }

const palette: Record<NonNullable<Node['kind']>, { fill: string; stroke: string; text: string }> = {
  input: { fill: '#E8F0FF', stroke: '#2463EB', text: '#123B82' },
  core: { fill: '#2463EB', stroke: '#1748B8', text: '#FFFFFF' },
  plan: { fill: '#E6F7F2', stroke: '#159C7B', text: '#0B6B55' },
  memory: { fill: '#F1ECFF', stroke: '#7A5AD6', text: '#4C32A3' },
  tool: { fill: '#FFF2E3', stroke: '#D97706', text: '#8A4B06' },
  env: { fill: '#EAF1F7', stroke: '#65849F', text: '#2E4A61' },
  output: { fill: '#E7F8EE', stroke: '#2B9E5F', text: '#166B3C' },
  guard: { fill: '#FFEAEA', stroke: '#D64545', text: '#9B2020' },
  storage: { fill: '#EEF2F6', stroke: '#536B82', text: '#293E52' },
}

const graphMap: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  ...v2Graphs,
  'agent-overview': {
    nodes: [
      { id: 'u', label: 'User / Task', x: 40, y: 120, kind: 'input' },
      { id: 'c', label: 'Agent Core', sub: 'control loop', x: 220, y: 110, kind: 'core' },
      { id: 'p', label: 'Planner', x: 410, y: 40, kind: 'plan' },
      { id: 'm', label: 'Memory', x: 400, y: 180, kind: 'memory' },
      { id: 'ctx', label: 'Context Manager', x: 220, y: 250, kind: 'storage' },
      { id: 'g', label: 'Guardrails', x: 590, y: 110, kind: 'guard' },
      { id: 't', label: 'Tools', x: 760, y: 110, kind: 'tool' },
      { id: 'e', label: 'Environment', x: 930, y: 110, kind: 'env' },
      { id: 'o', label: 'Observation', x: 760, y: 250, kind: 'storage' },
      { id: 'r', label: 'Result', x: 950, y: 270, kind: 'output' },
    ],
    edges: [
      { from: 'u', to: 'c', label: 'task' }, { from: 'c', to: 'p', label: 'goal' },
      { from: 'p', to: 'c', label: 'plan', reverse: true }, { from: 'c', to: 'ctx', label: 'context req' },
      { from: 'ctx', to: 'm', label: 'retrieve' }, { from: 'm', to: 'ctx', label: 'facts', reverse: true },
      { from: 'c', to: 'g', label: 'action' }, { from: 'g', to: 't', label: 'approved' },
      { from: 't', to: 'e', label: 'effect' }, { from: 'e', to: 'o', label: 'feedback', curved: true },
      { from: 'o', to: 'c', label: 'observe', dashed: true }, { from: 'o', to: 'r', label: 'final' },
    ],
  },
  'agent-loop': {
    nodes: [
      { id: 'o', label: 'Observe', x: 420, y: 30, kind: 'input' },
      { id: 't', label: 'Think', x: 650, y: 110, kind: 'core' },
      { id: 'p', label: 'Plan', x: 620, y: 280, kind: 'plan' },
      { id: 'a', label: 'Act', x: 360, y: 280, kind: 'tool' },
      { id: 'e', label: 'Environment', x: 120, y: 150, kind: 'env' },
      { id: 's', label: 'State / Budget', x: 440, y: 410, kind: 'storage' },
    ],
    edges: [
      { from: 'o', to: 't' }, { from: 't', to: 'p', label: 'candidates' }, { from: 'p', to: 'a', label: 'action' },
      { from: 'a', to: 'e', label: 'tool call' }, { from: 'e', to: 'o', label: 'feedback', reverse: true },
      { from: 's', to: 't', label: 'state', dashed: true }, { from: 'a', to: 's', label: 'events', dashed: true },
    ],
  },
  'layered-architecture': {
    nodes: [
      { id: 'i', label: '交互层', sub: 'UI / API / Events', x: 70, y: 50, w: 200, h: 70, kind: 'input' },
      { id: 'o', label: '编排层', sub: 'Planner / Router / State', x: 310, y: 50, w: 220, h: 70, kind: 'core' },
      { id: 'a', label: '能力层', sub: 'Model / Memory / Context', x: 570, y: 50, w: 230, h: 70, kind: 'plan' },
      { id: 'e', label: '执行层', sub: 'Tools / Sandbox / Runtime', x: 70, y: 220, w: 330, h: 70, kind: 'tool' },
      { id: 'g', label: '基础设施层', sub: 'Queue / DB / Observability', x: 450, y: 220, w: 350, h: 70, kind: 'storage' },
    ],
    edges: [
      { from: 'i', to: 'o' }, { from: 'o', to: 'a' }, { from: 'a', to: 'e' },
      { from: 'e', to: 'g', label: 'events' }, { from: 'g', to: 'o', label: 'state', dashed: true },
    ],
  },
  'planner-executor': {
    nodes: [
      { id: 'goal', label: 'Goal + Constraints', x: 40, y: 150, kind: 'input' },
      { id: 'planner', label: 'Planner', x: 230, y: 70, kind: 'plan' },
      { id: 'store', label: 'Plan Store', x: 230, y: 250, kind: 'storage' },
      { id: 'sched', label: 'Scheduler', x: 430, y: 150, kind: 'core' },
      { id: 'exec', label: 'Executor', x: 620, y: 90, kind: 'tool' },
      { id: 're', label: 'Replanner', x: 620, y: 270, kind: 'guard' },
      { id: 'res', label: 'Step Result', x: 850, y: 150, kind: 'output' },
    ],
    edges: [
      { from: 'goal', to: 'planner' }, { from: 'planner', to: 'store', label: 'plan vN' },
      { from: 'store', to: 'sched' }, { from: 'sched', to: 'exec', label: 'step' },
      { from: 'exec', to: 'res' }, { from: 'res', to: 're', label: 'feedback', curved: true },
      { from: 're', to: 'store', label: 'plan vN+1', dashed: true },
    ],
  },
  'react-flow': {
    nodes: [
      { id: 'task', label: 'Task', x: 40, y: 150, kind: 'input' },
      { id: 'thought', label: 'Thought', x: 220, y: 80, kind: 'core' },
      { id: 'action', label: 'Action', x: 430, y: 80, kind: 'tool' },
      { id: 'obs', label: 'Observation', x: 640, y: 80, kind: 'storage' },
      { id: 'check', label: 'Done?', x: 850, y: 80, kind: 'plan' },
      { id: 'final', label: 'Result', x: 850, y: 260, kind: 'output' },
    ],
    edges: [
      { from: 'task', to: 'thought' }, { from: 'thought', to: 'action' }, { from: 'action', to: 'obs' },
      { from: 'obs', to: 'check' }, { from: 'check', to: 'final', label: 'yes' },
      { from: 'check', to: 'thought', label: 'no', dashed: true, curved: true },
    ],
  },
  'plan-execute-flow': {
    nodes: [
      { id: 'goal', label: 'Goal', x: 60, y: 80, kind: 'input' },
      { id: 'plan', label: 'Generate Plan', x: 260, y: 80, kind: 'plan' },
      { id: 'queue', label: 'Step Queue', x: 470, y: 80, kind: 'storage' },
      { id: 'exec', label: 'Execute', x: 670, y: 80, kind: 'tool' },
      { id: 'verify', label: 'Verify', x: 850, y: 80, kind: 'guard' },
      { id: 'replan', label: 'Replan', x: 670, y: 280, kind: 'core' },
      { id: 'done', label: 'Complete', x: 880, y: 280, kind: 'output' },
    ],
    edges: [
      { from: 'goal', to: 'plan' }, { from: 'plan', to: 'queue' }, { from: 'queue', to: 'exec' },
      { from: 'exec', to: 'verify' }, { from: 'verify', to: 'done', label: 'pass' },
      { from: 'verify', to: 'replan', label: 'fail', dashed: true }, { from: 'replan', to: 'queue', label: 'new plan', curved: true },
    ],
  },
  'reflection-architecture': {
    nodes: [
      { id: 'task', label: 'Task', x: 40, y: 150, kind: 'input' },
      { id: 'gen', label: 'Generator', x: 220, y: 90, kind: 'core' },
      { id: 'draft', label: 'Draft', x: 430, y: 90, kind: 'storage' },
      { id: 'rev', label: 'Reviewer', x: 620, y: 90, kind: 'guard' },
      { id: 'gate', label: 'Pass?', x: 820, y: 90, kind: 'plan' },
      { id: 'out', label: 'Final', x: 900, y: 270, kind: 'output' },
    ],
    edges: [
      { from: 'task', to: 'gen' }, { from: 'gen', to: 'draft' }, { from: 'draft', to: 'rev' },
      { from: 'rev', to: 'gate' }, { from: 'gate', to: 'out', label: 'yes' },
      { from: 'gate', to: 'gen', label: 'no', dashed: true, curved: true },
    ],
  },
  'memory-layers': {
    nodes: [
      { id: 'wm', label: 'Working Memory', sub: 'current step', x: 390, y: 30, w: 230, h: 60, kind: 'core' },
      { id: 'stm', label: 'Short-Term', sub: 'run context', x: 180, y: 140, w: 200, h: 60, kind: 'plan' },
      { id: 'ep', label: 'Episodic', sub: 'events + time', x: 430, y: 140, w: 200, h: 60, kind: 'memory' },
      { id: 'sm', label: 'Semantic', sub: 'facts', x: 680, y: 140, w: 200, h: 60, kind: 'memory' },
      { id: 'pm', label: 'Procedural', sub: 'strategies', x: 210, y: 270, w: 200, h: 60, kind: 'tool' },
      { id: 'um', label: 'User Memory', sub: 'preferences', x: 470, y: 270, w: 200, h: 60, kind: 'input' },
      { id: 'kb', label: 'External KB', sub: 'authoritative', x: 730, y: 270, w: 200, h: 60, kind: 'storage' },
    ],
    edges: [
      { from: 'wm', to: 'stm', label: 'recent' }, { from: 'stm', to: 'ep', label: 'consolidate' },
      { from: 'ep', to: 'sm', label: 'abstract' }, { from: 'ep', to: 'pm', label: 'learn' },
      { from: 'um', to: 'wm', label: 'preferences', dashed: true }, { from: 'kb', to: 'wm', label: 'retrieve', dashed: true },
    ],
  },
  'context-flow': {
    nodes: [
      { id: 'src', label: 'Sources', x: 30, y: 150, kind: 'input' },
      { id: 'filter', label: 'Filter / Dedupe', x: 200, y: 150, kind: 'storage' },
      { id: 'rank', label: 'Rank', x: 370, y: 150, kind: 'plan' },
      { id: 'compact', label: 'Compress', x: 540, y: 150, kind: 'core' },
      { id: 'assemble', label: 'Assemble', x: 710, y: 150, kind: 'tool' },
      { id: 'cache', label: 'Cache', x: 710, y: 300, kind: 'storage' },
      { id: 'model', label: 'Model', x: 900, y: 150, kind: 'output' },
    ],
    edges: [
      { from: 'src', to: 'filter' }, { from: 'filter', to: 'rank' }, { from: 'rank', to: 'compact' },
      { from: 'compact', to: 'assemble' }, { from: 'assemble', to: 'model', label: 'snapshot' },
      { from: 'cache', to: 'assemble', label: 'stable prefix', dashed: true },
    ],
  },
  'tool-sequence': {
    nodes: [
      { id: 'm', label: 'Model', x: 80, y: 60, kind: 'core' },
      { id: 'r', label: 'Agent Runtime', x: 310, y: 60, kind: 'plan' },
      { id: 'reg', label: 'Tool Registry', x: 540, y: 60, kind: 'storage' },
      { id: 'api', label: 'External API', x: 770, y: 60, kind: 'env' },
      { id: 'v', label: 'Validate', x: 310, y: 250, kind: 'guard' },
      { id: 'o', label: 'Normalize', x: 540, y: 250, kind: 'tool' },
    ],
    edges: [
      { from: 'm', to: 'r', label: '1. tool call' }, { from: 'r', to: 'v', label: '2. schema' },
      { from: 'v', to: 'reg', label: '3. permission' }, { from: 'reg', to: 'api', label: '4. execute' },
      { from: 'api', to: 'o', label: '5. raw result', curved: true }, { from: 'o', to: 'm', label: '6. observation', dashed: true, curved: true },
    ],
  },
  'mcp-architecture': {
    nodes: [
      { id: 'host', label: 'MCP Host', sub: 'AI application', x: 80, y: 150, kind: 'core' },
      { id: 'client', label: 'MCP Client', x: 310, y: 150, kind: 'plan' },
      { id: 'server1', label: 'MCP Server A', sub: 'tools', x: 560, y: 60, kind: 'tool' },
      { id: 'server2', label: 'MCP Server B', sub: 'resources', x: 560, y: 240, kind: 'tool' },
      { id: 'data', label: 'Local / Remote Data', x: 820, y: 150, kind: 'env' },
      { id: 'policy', label: 'Host Policy + Audit', x: 310, y: 310, kind: 'guard' },
    ],
    edges: [
      { from: 'host', to: 'client' }, { from: 'client', to: 'server1', label: 'tools/list' },
      { from: 'client', to: 'server2', label: 'resources/read' }, { from: 'server1', to: 'data' },
      { from: 'server2', to: 'data' }, { from: 'policy', to: 'client', label: 'gate', dashed: true },
    ],
  },
  'supervisor-architecture': {
    nodes: [
      { id: 'goal', label: 'Goal', x: 40, y: 170, kind: 'input' },
      { id: 'sup', label: 'Supervisor', x: 230, y: 150, kind: 'core' },
      { id: 'state', label: 'Task Graph / State', x: 230, y: 310, kind: 'storage' },
      { id: 'a1', label: 'Research Agent', x: 520, y: 50, kind: 'plan' },
      { id: 'a2', label: 'Code Agent', x: 520, y: 170, kind: 'tool' },
      { id: 'a3', label: 'Review Agent', x: 520, y: 290, kind: 'guard' },
      { id: 'tools', label: 'Shared Tools', x: 800, y: 170, kind: 'env' },
      { id: 'out', label: 'Result', x: 940, y: 310, kind: 'output' },
    ],
    edges: [
      { from: 'goal', to: 'sup' }, { from: 'sup', to: 'state' }, { from: 'sup', to: 'a1', label: 'delegate' },
      { from: 'sup', to: 'a2' }, { from: 'sup', to: 'a3' }, { from: 'a1', to: 'tools' },
      { from: 'a2', to: 'tools' }, { from: 'a3', to: 'out' }, { from: 'tools', to: 'state', label: 'results', dashed: true },
    ],
  },
  'agent-messages': {
    nodes: [
      { id: 'a', label: 'Agent A', x: 60, y: 60, kind: 'core' },
      { id: 'b', label: 'Agent B', x: 780, y: 60, kind: 'plan' },
      { id: 'c', label: 'Agent C', x: 420, y: 300, kind: 'tool' },
      { id: 'bus', label: 'Message Bus', sub: 'typed events', x: 420, y: 100, w: 220, h: 70, kind: 'storage' },
      { id: 'mem', label: 'Shared Memory', x: 780, y: 300, kind: 'memory' },
    ],
    edges: [
      { from: 'a', to: 'bus', label: 'task.request' }, { from: 'bus', to: 'b', label: 'task.assign' },
      { from: 'b', to: 'bus', label: 'result', dashed: true }, { from: 'bus', to: 'c', label: 'peer msg' },
      { from: 'c', to: 'mem', label: 'write' }, { from: 'mem', to: 'a', label: 'read', dashed: true, curved: true },
    ],
  },
  'runtime-architecture': {
    nodes: [
      { id: 'api', label: 'Task API', x: 40, y: 90, kind: 'input' },
      { id: 'queue', label: 'Task Queue', x: 230, y: 90, kind: 'storage' },
      { id: 'sched', label: 'Scheduler', x: 420, y: 90, kind: 'plan' },
      { id: 'exec', label: 'Execution Engine', x: 610, y: 90, kind: 'core' },
      { id: 'tools', label: 'Tools / Sandbox', x: 820, y: 90, kind: 'tool' },
      { id: 'state', label: 'State + Events', x: 420, y: 280, kind: 'memory' },
      { id: 'obs', label: 'Observability', x: 760, y: 280, kind: 'output' },
    ],
    edges: [
      { from: 'api', to: 'queue' }, { from: 'queue', to: 'sched' }, { from: 'sched', to: 'exec' },
      { from: 'exec', to: 'tools' }, { from: 'exec', to: 'state', label: 'checkpoint' },
      { from: 'state', to: 'obs', label: 'events' }, { from: 'obs', to: 'sched', label: 'metrics', dashed: true },
    ],
  },
  'durable-execution': {
    nodes: [
      { id: 'start', label: 'Run Start', x: 40, y: 90, kind: 'input' },
      { id: 'event', label: 'Event Log', x: 230, y: 90, kind: 'storage' },
      { id: 'step', label: 'Execute Step', x: 430, y: 90, kind: 'core' },
      { id: 'cp', label: 'Checkpoint', x: 620, y: 90, kind: 'plan' },
      { id: 'crash', label: 'Crash / Restart', x: 620, y: 280, kind: 'guard' },
      { id: 'resume', label: 'Resume from CP', x: 390, y: 280, kind: 'tool' },
      { id: 'done', label: 'Complete', x: 850, y: 90, kind: 'output' },
    ],
    edges: [
      { from: 'start', to: 'event' }, { from: 'event', to: 'step' }, { from: 'step', to: 'cp' },
      { from: 'cp', to: 'done' }, { from: 'step', to: 'crash', label: 'failure', dashed: true },
      { from: 'crash', to: 'resume' }, { from: 'resume', to: 'step', label: 'replay', dashed: true, curved: true },
    ],
  },
  'hitl-approval': {
    nodes: [
      { id: 'action', label: 'Risky Action', x: 40, y: 150, kind: 'tool' },
      { id: 'gate', label: 'Policy Gate', x: 220, y: 150, kind: 'guard' },
      { id: 'wait', label: 'Waiting', x: 410, y: 150, kind: 'storage' },
      { id: 'human', label: 'Human Review', x: 600, y: 70, kind: 'input' },
      { id: 'exec', label: 'Execute', x: 790, y: 70, kind: 'core' },
      { id: 'comp', label: 'Compensate / Stop', x: 790, y: 260, kind: 'plan' },
    ],
    edges: [
      { from: 'action', to: 'gate' }, { from: 'gate', to: 'wait', label: 'require' },
      { from: 'wait', to: 'human', label: 'approval req' }, { from: 'human', to: 'exec', label: 'approve' },
      { from: 'human', to: 'comp', label: 'reject', dashed: true }, { from: 'exec', to: 'wait', label: 'audit', dashed: true, curved: true },
    ],
  },
  'evaluation-loop': {
    nodes: [
      { id: 'ds', label: 'Dataset', x: 40, y: 100, kind: 'input' },
      { id: 'run', label: 'Agent Run', x: 230, y: 100, kind: 'core' },
      { id: 'trace', label: 'Trace Store', x: 430, y: 100, kind: 'storage' },
      { id: 'metric', label: 'Metrics', x: 620, y: 100, kind: 'plan' },
      { id: 'judge', label: 'Judge + Human', x: 800, y: 100, kind: 'guard' },
      { id: 'fix', label: 'Improve', x: 500, y: 300, kind: 'tool' },
      { id: 'regress', label: 'Regression', x: 230, y: 300, kind: 'output' },
    ],
    edges: [
      { from: 'ds', to: 'run' }, { from: 'run', to: 'trace' }, { from: 'trace', to: 'metric' },
      { from: 'metric', to: 'judge' }, { from: 'judge', to: 'fix', label: 'findings' },
      { from: 'fix', to: 'regress' }, { from: 'regress', to: 'ds', label: 'new cases', dashed: true, curved: true },
    ],
  },
  'observability-architecture': {
    nodes: [
      { id: 'agent', label: 'Agent Runtime', x: 60, y: 150, kind: 'core' },
      { id: 'sdk', label: 'Instrumentation', x: 250, y: 150, kind: 'plan' },
      { id: 'trace', label: 'Traces', x: 450, y: 60, kind: 'storage' },
      { id: 'metric', label: 'Metrics', x: 450, y: 170, kind: 'tool' },
      { id: 'log', label: 'Logs', x: 450, y: 280, kind: 'env' },
      { id: 'dash', label: 'Dashboards / Alerts', x: 750, y: 150, kind: 'output' },
    ],
    edges: [
      { from: 'agent', to: 'sdk' }, { from: 'sdk', to: 'trace' }, { from: 'sdk', to: 'metric' },
      { from: 'sdk', to: 'log' }, { from: 'trace', to: 'dash' }, { from: 'metric', to: 'dash' },
      { from: 'log', to: 'dash' },
    ],
  },
  'security-boundaries': {
    nodes: [
      { id: 'user', label: 'Untrusted Input', x: 40, y: 150, kind: 'guard' },
      { id: 'ctx', label: 'Context Isolation', x: 220, y: 150, kind: 'storage' },
      { id: 'agent', label: 'Agent Core', x: 410, y: 150, kind: 'core' },
      { id: 'policy', label: 'Policy + IAM', x: 600, y: 70, kind: 'plan' },
      { id: 'sandbox', label: 'Sandbox', x: 600, y: 240, kind: 'tool' },
      { id: 'approve', label: 'Approval', x: 800, y: 70, kind: 'guard' },
      { id: 'audit', label: 'Audit Log', x: 880, y: 250, kind: 'output' },
    ],
    edges: [
      { from: 'user', to: 'ctx', label: 'data only' }, { from: 'ctx', to: 'agent' },
      { from: 'agent', to: 'policy' }, { from: 'policy', to: 'sandbox', label: 'scope' },
      { from: 'policy', to: 'approve', label: 'high risk' }, { from: 'sandbox', to: 'audit' },
      { from: 'approve', to: 'audit' },
    ],
  },
  'production-deployment': {
    nodes: [
      { id: 'client', label: 'Clients', x: 30, y: 160, kind: 'input' },
      { id: 'gw', label: 'API Gateway', x: 190, y: 160, kind: 'guard' },
      { id: 'queue', label: 'Task Queue', x: 360, y: 160, kind: 'storage' },
      { id: 'worker', label: 'Agent Workers', x: 540, y: 160, kind: 'core' },
      { id: 'model', label: 'Model Gateway', x: 750, y: 60, kind: 'plan' },
      { id: 'tools', label: 'Tools', x: 750, y: 250, kind: 'tool' },
      { id: 'state', label: 'State DB', x: 930, y: 160, kind: 'memory' },
    ],
    edges: [
      { from: 'client', to: 'gw' }, { from: 'gw', to: 'queue' }, { from: 'queue', to: 'worker' },
      { from: 'worker', to: 'model' }, { from: 'worker', to: 'tools' }, { from: 'worker', to: 'state' },
      { from: 'model', to: 'state', label: 'usage', dashed: true },
    ],
  },
  'task-lifecycle': {
    nodes: [
      { id: 'created', label: 'Created', x: 60, y: 40, kind: 'input' },
      { id: 'planned', label: 'Planned', x: 260, y: 40, kind: 'plan' },
      { id: 'running', label: 'Running', x: 460, y: 40, kind: 'core' },
      { id: 'waiting', label: 'Waiting', x: 660, y: 40, kind: 'storage' },
      { id: 'completed', label: 'Completed', x: 860, y: 40, kind: 'output' },
      { id: 'failed', label: 'Failed', x: 460, y: 250, kind: 'guard' },
      { id: 'cancelled', label: 'Cancelled', x: 700, y: 250, kind: 'env' },
    ],
    edges: [
      { from: 'created', to: 'planned' }, { from: 'planned', to: 'running' },
      { from: 'running', to: 'waiting' }, { from: 'waiting', to: 'running', label: 'resume', reverse: true },
      { from: 'running', to: 'completed' }, { from: 'running', to: 'failed', label: 'error' },
      { from: 'waiting', to: 'cancelled', label: 'cancel' },
    ],
  },
  'failure-recovery': {
    nodes: [
      { id: 'err', label: 'Tool Error', x: 40, y: 150, kind: 'guard' },
      { id: 'classify', label: 'Classify', x: 220, y: 150, kind: 'plan' },
      { id: 'retry', label: 'Retry + Backoff', x: 420, y: 70, kind: 'tool' },
      { id: 'idemp', label: 'Idempotency Check', x: 420, y: 250, kind: 'storage' },
      { id: 'fallback', label: 'Fallback / Human', x: 650, y: 160, kind: 'core' },
      { id: 'resume', label: 'Resume', x: 860, y: 160, kind: 'output' },
    ],
    edges: [
      { from: 'err', to: 'classify' }, { from: 'classify', to: 'retry', label: 'transient' },
      { from: 'classify', to: 'idemp', label: 'uncertain' }, { from: 'retry', to: 'fallback' },
      { from: 'idemp', to: 'fallback' }, { from: 'fallback', to: 'resume' },
    ],
  },
  'agent-rag': {
    nodes: [
      { id: 'q', label: 'Task / Query', x: 40, y: 150, kind: 'input' },
      { id: 'rewrite', label: 'Query Rewrite', x: 210, y: 150, kind: 'plan' },
      { id: 'retrieve', label: 'Retriever', x: 380, y: 150, kind: 'core' },
      { id: 'rerank', label: 'Rerank', x: 550, y: 150, kind: 'tool' },
      { id: 'ctx', label: 'Context Snapshot', x: 720, y: 150, kind: 'memory' },
      { id: 'gen', label: 'Generate', x: 890, y: 150, kind: 'output' },
      { id: 'kb', label: 'Knowledge Base', x: 380, y: 310, kind: 'storage' },
      { id: 'verify', label: 'Citation Verify', x: 890, y: 310, kind: 'guard' },
    ],
    edges: [
      { from: 'q', to: 'rewrite' }, { from: 'rewrite', to: 'retrieve' }, { from: 'kb', to: 'retrieve' },
      { from: 'retrieve', to: 'rerank' }, { from: 'rerank', to: 'ctx' }, { from: 'ctx', to: 'gen' },
      { from: 'gen', to: 'verify' }, { from: 'verify', to: 'ctx', label: 'retry', dashed: true, curved: true },
    ],
  },
  'tool-permission': {
    nodes: [
      { id: 'call', label: 'Tool Call', x: 40, y: 150, kind: 'input' },
      { id: 'schema', label: 'Schema Validate', x: 210, y: 150, kind: 'storage' },
      { id: 'iam', label: 'Identity + Policy', x: 390, y: 150, kind: 'plan' },
      { id: 'risk', label: 'Risk Level', x: 570, y: 150, kind: 'guard' },
      { id: 'approve', label: 'Approval', x: 750, y: 70, kind: 'input' },
      { id: 'exec', label: 'Isolated Exec', x: 750, y: 230, kind: 'tool' },
      { id: 'audit', label: 'Audit', x: 930, y: 150, kind: 'output' },
    ],
    edges: [
      { from: 'call', to: 'schema' }, { from: 'schema', to: 'iam' }, { from: 'iam', to: 'risk' },
      { from: 'risk', to: 'approve', label: 'L2+' }, { from: 'risk', to: 'exec', label: 'L0/L1' },
      { from: 'approve', to: 'exec' }, { from: 'exec', to: 'audit' },
    ],
  },
  'single-vs-multi': {
    nodes: [
      { id: 'task1', label: 'Task', x: 40, y: 90, kind: 'input' },
      { id: 'single', label: 'Single Agent', x: 220, y: 90, w: 180, h: 60, kind: 'core' },
      { id: 'tools1', label: 'Tools', x: 440, y: 90, kind: 'tool' },
      { id: 'task2', label: 'Task', x: 40, y: 280, kind: 'input' },
      { id: 'sup', label: 'Supervisor', x: 220, y: 280, kind: 'plan' },
      { id: 'w1', label: 'Worker A', x: 420, y: 230, kind: 'tool' },
      { id: 'w2', label: 'Worker B', x: 420, y: 330, kind: 'memory' },
      { id: 'shared', label: 'Shared State', x: 640, y: 280, kind: 'storage' },
    ],
    edges: [
      { from: 'task1', to: 'single' }, { from: 'single', to: 'tools1' },
      { from: 'task2', to: 'sup' }, { from: 'sup', to: 'w1' }, { from: 'sup', to: 'w2' },
      { from: 'w1', to: 'shared' }, { from: 'w2', to: 'shared' },
    ],
  },
}

function nodeCenter(node: Node) {
  const w = node.w ?? 150
  const h = node.h ?? 54
  return { x: node.x + w / 2, y: node.y + h / 2, w, h }
}

export function ArchitectureDiagram({ id, className, compact = false }: { id: string; className?: string; compact?: boolean }) {
  const graph = graphMap[id]
  const meta: DiagramMeta | undefined = diagrams.find((d) => d.id === id)
  const markerId = useId().replace(/:/g, '')
  if (!graph) return <div className="diagram-missing">未找到图表：{id}</div>

  const width = 1200
  const height = compact ? 380 : 420

  return (
    <div className={cn('diagram-frame', className)} data-compact={compact}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={meta?.title ?? id} className="diagram-svg">
        <defs>
          <marker id={`arrow-${markerId}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7C8DA3" />
          </marker>
          <pattern id={`grid-${markerId}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E8EDF4" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="#FBFCFE" />
        <rect width={width} height={height} fill={`url(#grid-${markerId})`} />
        {graph.edges.map((edge, i) => {
          const from = graph.nodes.find((n) => n.id === edge.from)
          const to = graph.nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null
          const a = nodeCenter(from)
          const b = nodeCenter(to)
          const x1 = edge.reverse ? b.x : a.x
          const y1 = edge.reverse ? b.y : a.y
          const x2 = edge.reverse ? a.x : b.x
          const y2 = edge.reverse ? a.y : b.y
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          const d = edge.curved
            ? `M ${x1} ${y1} Q ${midX} ${Math.min(y1, y2) - 70} ${x2} ${y2}`
            : `M ${x1} ${y1} L ${x2} ${y2}`
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <path d={d} fill="none" stroke="#7C8DA3" strokeWidth="1.8" strokeDasharray={edge.dashed ? '6 5' : undefined} markerEnd={`url(#arrow-${markerId})`} />
              {edge.label && (
                <text x={midX} y={midY - 7} textAnchor="middle" className="diagram-edge-label">
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}
        {graph.nodes.map((node) => {
          const w = node.w ?? 150
          const h = node.h ?? 54
          const color = palette[node.kind ?? 'storage']
          return (
            <g key={node.id}>
              <rect x={node.x} y={node.y} width={w} height={h} rx="9" fill={color.fill} stroke={color.stroke} strokeWidth="1.6" />
              <text x={node.x + w / 2} y={node.sub ? node.y + h / 2 - 3 : node.y + h / 2 + 5} textAnchor="middle" className="diagram-node-label" fill={color.text}>
                {node.label}
              </text>
              {node.sub && <text x={node.x + w / 2} y={node.y + h / 2 + 15} textAnchor="middle" className="diagram-node-sub" fill={color.text}>{node.sub}</text>}
            </g>
          )
        })}
        <g transform={`translate(24, ${height - 40})`} className="diagram-legend">
          <rect x="0" y="-13" width="930" height="26" rx="6" fill="#FFFFFF" stroke="#E3E9F1" />
          <circle cx="16" cy="0" r="5" fill="#2463EB" /><text x="26" y="4">核心</text>
          <circle cx="90" cy="0" r="5" fill="#159C7B" /><text x="100" y="4">规划</text>
          <circle cx="164" cy="0" r="5" fill="#7A5AD6" /><text x="174" y="4">记忆</text>
          <circle cx="238" cy="0" r="5" fill="#D97706" /><text x="248" y="4">工具</text>
          <circle cx="312" cy="0" r="5" fill="#D64545" /><text x="322" y="4">策略/防护</text>
          <circle cx="406" cy="0" r="5" fill="#536B82" /><text x="416" y="4">存储/观测</text>
          <line x1="510" y1="0" x2="540" y2="0" stroke="#7C8DA3" strokeWidth="2" /><text x="548" y="4">控制/数据流</text>
          <line x1="660" y1="0" x2="690" y2="0" stroke="#7C8DA3" strokeWidth="2" strokeDasharray="5 4" /><text x="698" y="4">反馈/状态</text>
          <text x="800" y="4">{meta?.type ?? '参考架构'}</text>
        </g>
      </svg>
    </div>
  )
}
