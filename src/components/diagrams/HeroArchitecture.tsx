export function HeroArchitecture() {
  return (
    <div className="hero-architecture" role="img" aria-label="Agent 系统架构：用户任务经 Agent Core、规划、记忆、工具与环境形成反馈循环">
      <svg viewBox="0 0 820 480" className="hero-svg">
        <defs>
          <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B8CFF" />
            <stop offset="100%" stopColor="#68D5B7" />
          </linearGradient>
          <marker id="hero-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="#6F8BB0" />
          </marker>
          <radialGradient id="hero-glow">
            <stop offset="0%" stopColor="#2463EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2463EB" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="410" cy="230" r="190" fill="url(#hero-glow)" />
        <g className="hero-orbit" fill="none" stroke="#2B3E59" strokeWidth="1">
          <ellipse cx="410" cy="230" rx="310" ry="150" />
          <ellipse cx="410" cy="230" rx="220" ry="105" strokeDasharray="5 8" />
        </g>

        <g className="hero-node hero-node-core">
          <rect x="305" y="175" width="210" height="110" rx="18" fill="#2463EB" />
          <text x="410" y="218" textAnchor="middle" className="hero-label-main">Agent Core</text>
          <text x="410" y="244" textAnchor="middle" className="hero-label-sub">Control Loop · Policy</text>
          <text x="410" y="266" textAnchor="middle" className="hero-label-tiny">Goal · State · Budget</text>
        </g>

        <g className="hero-node"><rect x="48" y="195" width="150" height="70" rx="12" /><text x="123" y="227" textAnchor="middle" className="hero-label">User / Task</text><text x="123" y="247" textAnchor="middle" className="hero-label-tiny">intent + constraints</text></g>
        <g className="hero-node"><rect x="300" y="42" width="180" height="64" rx="12" /><text x="390" y="72" textAnchor="middle" className="hero-label">Planning</text><text x="390" y="91" textAnchor="middle" className="hero-label-tiny">decompose · select</text></g>
        <g className="hero-node"><rect x="585" y="70" width="180" height="64" rx="12" /><text x="675" y="100" textAnchor="middle" className="hero-label">Memory</text><text x="675" y="119" textAnchor="middle" className="hero-label-tiny">episodic · semantic</text></g>
        <g className="hero-node"><rect x="620" y="190" width="160" height="70" rx="12" /><text x="700" y="222" textAnchor="middle" className="hero-label">Tools</text><text x="700" y="242" textAnchor="middle" className="hero-label-tiny">registry · schema</text></g>
        <g className="hero-node"><rect x="610" y="330" width="180" height="70" rx="12" /><text x="700" y="362" textAnchor="middle" className="hero-label">Environment</text><text x="700" y="382" textAnchor="middle" className="hero-label-tiny">API · browser · code</text></g>
        <g className="hero-node"><rect x="334" y="380" width="170" height="64" rx="12" /><text x="419" y="410" textAnchor="middle" className="hero-label">Observation</text><text x="419" y="429" textAnchor="middle" className="hero-label-tiny">normalize · validate</text></g>
        <g className="hero-node"><rect x="56" y="350" width="150" height="70" rx="12" /><text x="131" y="382" textAnchor="middle" className="hero-label">Result</text><text x="131" y="402" textAnchor="middle" className="hero-label-tiny">verified output</text></g>
        <g className="hero-node hero-node-guard"><rect x="160" y="78" width="140" height="58" rx="12" /><text x="230" y="111" textAnchor="middle" className="hero-label">Guardrails</text></g>

        <g fill="none" stroke="url(#hero-line)" strokeWidth="2" markerEnd="url(#hero-arrow)">
          <path d="M198 230 C240 230 260 230 305 230" />
          <path d="M390 175 C390 140 390 120 390 106" />
          <path d="M480 106 C550 92 585 94 585 100" />
          <path d="M515 230 L620 225" />
          <path d="M700 260 C700 290 700 315 700 330" />
          <path d="M610 365 C530 420 505 412 504 410" />
          <path d="M334 410 C270 410 220 400 206 390" />
        </g>
        <path d="M675 134 C600 150 540 160 515 190" fill="none" stroke="#68D5B7" strokeWidth="1.6" strokeDasharray="6 6" markerEnd="url(#hero-arrow)" />
        <path d="M419 380 C410 340 410 300 410 285" fill="none" stroke="#F0B65C" strokeWidth="1.6" strokeDasharray="6 6" markerEnd="url(#hero-arrow)" />
        <path d="M230 136 C270 150 300 170 310 185" fill="none" stroke="#F07575" strokeWidth="1.6" strokeDasharray="4 5" markerEnd="url(#hero-arrow)" />
        <text x="530" y="157" className="hero-edge-text">memory read / write</text>
        <text x="425" y="342" className="hero-edge-text">feedback loop</text>
        <text x="205" y="162" className="hero-edge-text">policy gate</text>
      </svg>
    </div>
  )
}
