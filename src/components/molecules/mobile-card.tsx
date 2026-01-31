import { Card } from "@/components/ui/card"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileCardField {
  label: string
  value: ReactNode
  className?: string
}

interface MobileCardProps {
  title: string | ReactNode
  badge?: ReactNode
  fields: MobileCardField[]
  actions?: ReactNode
}

export function MobileCard({ title, badge, fields, actions }: MobileCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          {typeof title === 'string' ? (
            <p className="font-semibold text-sm truncate">{title}</p>
          ) : title}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      
      <div className="grid gap-2 text-sm">
        {fields.map((field, idx) => (
          <div key={idx} className={cn("truncate", field.className)}>
            <span className="text-muted-foreground text-xs">{field.label}:</span>{" "}
            <span className="text-sm">{field.value}</span>
          </div>
        ))}
      </div>
      
      {actions && (
        <div className="mt-4 flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </Card>
  )
}
