import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  quote?: string
  actions?: ReactNode
  children?: ReactNode
}

export default function PageHeader({ title, subtitle, quote, actions, children }: PageHeaderProps) {
  return (
    <header className="animate-in stagger-1">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="page-title">{title}</h1>
          {(quote || subtitle) && (
            <p className={`page-subtitle mt-0.5${quote ? ' italic' : ''}`}>
              {quote ? `\u201C${quote}\u201D` : subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </header>
  )
}
