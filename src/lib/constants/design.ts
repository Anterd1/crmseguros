// Colores de estado de sales pipeline
export const PIPELINE_STAGES = [
  { id: 'Nuevo', label: 'Nuevo', color: 'bg-blue-500' },
  { id: 'Contactado', label: 'Contactado', color: 'bg-yellow-500' },
  { id: 'Cotización', label: 'Cotización', color: 'bg-purple-500' },
  { id: 'Negociación', label: 'Negociación', color: 'bg-orange-500' },
  { id: 'Ganado', label: 'Ganado', color: 'bg-green-500' },
] as const

// Mapeos de estados - exportar desde StatusBadge para mantener sincronizado
export { STATUS_VARIANTS } from '@/components/molecules/status-badge'

// Tipos de documentos
export const DOCUMENT_TYPES = {
  POLIZA: 'Póliza',
  IDENTIFICACION: 'Identificación',
  COMPROBANTE_DOMICILIO: 'Comprobante de Domicilio',
  RECLAMACION: 'Reclamación',
  PAGO: 'Comprobante de Pago',
  OTRO: 'Otro',
} as const

// Tipos de cliente
export const CLIENT_TYPES = {
  FISICA: 'Física',
  MORAL: 'Moral',
} as const

// Estados de reclamo
export const CLAIM_STATUS = {
  ABIERTO: 'Abierto',
  EN_PROCESO: 'En Proceso',
  CERRADO: 'Cerrado',
} as const

// Estados de pago
export const PAYMENT_STATUS = {
  PAGADO: 'Pagado',
  PENDIENTE: 'Pendiente',
  VENCIDO: 'Vencido',
} as const

// Estados de póliza
export const POLICY_STATUS = {
  ACTIVA: 'Activa',
  VENCIDA: 'Vencida',
  CANCELADA: 'Cancelada',
} as const

// Frecuencias de pago
export const PAYMENT_FREQUENCIES = {
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
} as const

// Tipos de póliza
export const POLICY_TYPES = {
  VIDA: 'Vida',
  GMM: 'GMM',
  AUTOS: 'Autos',
  HOGAR: 'Hogar',
  RC: 'Responsabilidad Civil',
  DANOS: 'Daños',
} as const
