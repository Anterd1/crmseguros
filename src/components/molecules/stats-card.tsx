import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: { value: number; isPositive: boolean }
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={cn("text-[10px] sm:text-xs", trend.isPositive ? "text-green-600" : "text-red-600")}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </p>
        )}
      </CardContent>
    </Card>
  )
}
