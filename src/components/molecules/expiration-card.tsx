import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpirationCardProps {
  policyNumber: string
  clientName: string
  expirationDate: string
  daysUntilExpiration: number
  onClick?: () => void
}

export function ExpirationCard({
  policyNumber,
  clientName,
  expirationDate,
  daysUntilExpiration,
  onClick,
}: ExpirationCardProps) {
  // Determine variant and styling based on days
  const getVariantAndColor = () => {
    if (daysUntilExpiration < 0) {
      return {
        variant: "destructive" as const,
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
        icon: AlertCircle,
      }
    } else if (daysUntilExpiration <= 30) {
      return {
        variant: "default" as const,
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        icon: Clock,
      }
    } else {
      return {
        variant: "secondary" as const,
        iconBg: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
        icon: Calendar,
      }
    }
  }

  const { variant, iconBg, iconColor, icon: Icon } = getVariantAndColor()

  const statusText = daysUntilExpiration < 0
    ? "Vencida"
    : daysUntilExpiration === 0
    ? "Vence hoy"
    : `${daysUntilExpiration} días`

  return (
    <Card
      className={cn(
        "p-4 hover:shadow-md transition-shadow",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium truncate">{clientName}</p>
              <p className="text-sm text-muted-foreground truncate">
                Póliza: {policyNumber}
              </p>
            </div>
            <Badge variant={variant} className="shrink-0">
              {statusText}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Vencimiento: {new Date(expirationDate).toLocaleDateString('es-MX')}
          </p>
        </div>
      </div>
    </Card>
  )
}
