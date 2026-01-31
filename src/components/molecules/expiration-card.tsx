import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/formatters"

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
        "p-3 sm:p-4 hover:shadow-md transition-shadow",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className={cn("flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full shrink-0", iconBg)}>
          <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", iconColor)} />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:font-medium truncate">{clientName}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Póliza: {policyNumber}
              </p>
            </div>
            <Badge variant={variant} className="shrink-0 text-xs">
              {statusText}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
            Vencimiento: {formatDate(expirationDate)}
          </p>
        </div>
      </div>
    </Card>
  )
}
