import { useEffect } from 'react'
import { ArchitectureDiagram } from './ArchitectureDiagram'

export function DiagramViewer({ id, title, description, type }: { id: string; title: string; description: string; type?: string }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') document.body.classList.remove('diagram-open')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const open = () => document.body.classList.add('diagram-open')

  return (
    <figure className="diagram-block">
      <figcaption className="diagram-caption">
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <span className="diagram-type-badge">{type ?? '参考架构'}</span>
      </figcaption>
      <div className="diagram-scroll" onClick={open} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open()} aria-label={`放大查看 ${title}`}>
        <ArchitectureDiagram id={id} />
      </div>
      <div className="diagram-actions">
        <button type="button" className="text-action" onClick={open}>放大查看</button>
        <span>实线：控制/数据流 · 虚线：反馈/状态 · 颜色表示模块语义</span>
      </div>
    </figure>
  )
}
