import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}
