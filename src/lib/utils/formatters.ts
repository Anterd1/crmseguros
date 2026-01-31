/**
 * Formatea un número como moneda mexicana (MXN)
 * @param amount - Cantidad a formatear
 * @returns String formateado como moneda
 */
export function formatCurrency(amount: number | null | undefined): string {
  return `$${(amount ?? 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Formatea una fecha en formato corto (dd/mm/yyyy)
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado como fecha
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Formatea una fecha en formato largo (dd de mes de yyyy)
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado como fecha larga
 */
export function formatDateLong(date: string | Date | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea una fecha y hora
 * @param date - Fecha a formatear (string ISO o Date)
 * @returns String formateado como fecha y hora
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calcula los días hasta una fecha objetivo
 * @param targetDate - Fecha objetivo (string ISO o Date)
 * @returns Número de días (negativo si ya pasó)
 */
export function calculateDaysUntil(targetDate: string | Date): number {
  const now = new Date()
  const target = new Date(targetDate)
  // Set to midnight to get accurate day count
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Formatea un número de teléfono mexicano
 * @param phone - Número de teléfono
 * @returns String formateado
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-'
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '')
  // Format as (XXX) XXX-XXXX for 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Formatea un RFC mexicano
 * @param rfc - RFC a formatear
 * @returns String formateado en mayúsculas
 */
export function formatRFC(rfc: string | null | undefined): string {
  if (!rfc) return '-'
  return rfc.toUpperCase()
}

/**
 * Formatea un porcentaje
 * @param value - Valor decimal (0.15 = 15%)
 * @param decimals - Número de decimales a mostrar
 * @returns String formateado como porcentaje
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 0): string {
  if (value === null || value === undefined) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Trunca un texto a cierta longitud
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns String truncado con ellipsis si es necesario
 */
export function truncate(text: string | null | undefined, maxLength: number = 50): string {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Formatea bytes a formato legible
 * @param bytes - Número de bytes
 * @returns String formateado (ej: "1.5 MB")
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '-'
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param text - Texto a capitalizar
 * @returns String capitalizado
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return '-'
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Obtiene las iniciales de un nombre
 * @param firstName - Nombre
 * @param lastName - Apellido (opcional)
 * @returns Iniciales en mayúsculas
 */
export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return `${first}${last}`
}
