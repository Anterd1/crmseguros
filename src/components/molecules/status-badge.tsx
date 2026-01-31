import { Badge } from "@/components/ui/badge"

// Definir mapeos por tipo de entidad
export const STATUS_VARIANTS = {
  policy: {
    Activa: "default",
    Vencida: "destructive",
    Cancelada: "secondary",
  },
  payment: {
    Pagado: "default",
    Pendiente: "secondary",
    Vencido: "destructive",
  },
  claim: {
    Abierto: "destructive",
    "En Proceso": "secondary",
    Cerrado: "default",
  },
  commission: {
    Pagada: "default",
    Pendiente: "secondary",
  },
  prospect: {
    Nuevo: "default",
    Contactado: "secondary",
    Cotización: "default",
    Negociación: "secondary",
    Ganado: "default",
    Perdido: "destructive",
  },
} as const

type StatusVariantType = keyof typeof STATUS_VARIANTS

interface StatusBadgeProps {
  status: string
  type: StatusVariantType
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const variants = STATUS_VARIANTS[type]
  const variant = (variants as any)[status] || "secondary"
  return <Badge variant={variant as any}>{status}</Badge>
}
