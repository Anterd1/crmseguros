# Guía de Estilos - GCP Seguros CRM

## Tabla de Contenidos
1. [Sistema de Diseño](#sistema-de-diseño)
2. [Estructura de Componentes](#estructura-de-componentes)
3. [Guía de Estilos CSS](#guía-de-estilos-css)
4. [Patrones de Componentes](#patrones-de-componentes)
5. [Separación de Responsabilidades](#separación-de-responsabilidades)
6. [Buenas Prácticas](#buenas-prácticas)
7. [Convenciones de Código](#convenciones-de-código)

---

## 1. Sistema de Diseño

### Colores

El proyecto utiliza un sistema de diseño basado en variables CSS con OKLCH definidas en `src/app/globals.css`:

#### Variables Principales
```css
--background     /* Fondo principal */
--foreground     /* Texto principal */
--primary        /* Color primario (Navy Blue) */
--secondary      /* Color secundario */
--muted          /* Colores atenuados */
--accent         /* Color de acento */
--destructive    /* Alertas y errores */
--border         /* Bordes */
--input          /* Inputs */
--ring           /* Focus rings */
```

#### Variables de Sidebar
```css
--sidebar
--sidebar-foreground
--sidebar-primary
--sidebar-accent
--sidebar-border
--sidebar-ring
```

#### Variables de Charts
```css
--chart-1 a --chart-5  /* Colores para gráficos */
```

**Regla Importante**: Siempre usar variables del sistema en lugar de colores hardcodeados.

✅ **Correcto:**
```tsx
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive" />
```

❌ **Incorrecto:**
```tsx
<div className="bg-blue-500" />
<div className="bg-red-500" />
```

### Tipografía

Escala de tamaños de texto de Tailwind:
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

**Evitar tamaños arbitrarios** como `text-[11px]` o `text-[0.7rem]` a menos que sea absolutamente necesario.

### Espaciado

Usar la escala de espaciado de Tailwind:
- `gap-1` a `gap-12`: 0.25rem a 3rem
- `p-1` a `p-12`: padding
- `m-1` a `m-12`: margin

### Border Radius

El sistema usa `--radius: 1.5rem` (24px) con variantes:
- `rounded-sm`: calc(var(--radius) - 4px)
- `rounded-md`: calc(var(--radius) - 2px)
- `rounded-lg`: var(--radius)
- `rounded-xl`: calc(var(--radius) + 4px)

### Breakpoints Responsive

```css
sm: 640px    /* Tablet pequeña */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop pequeño */
xl: 1280px   /* Desktop */
2xl: 1536px  /* Desktop grande */
```

---

## 2. Estructura de Componentes

### Atomic Design Híbrido

El proyecto sigue un enfoque híbrido de Atomic Design:

```
src/components/
├── ui/          # Atoms - Componentes primitivos
├── molecules/   # Molecules - Componentes compuestos reutilizables
├── layout/      # Componentes de layout
└── [domain]/    # Organisms - Componentes específicos por dominio
```

#### Atoms (ui/)
Componentes primitivos sin lógica de negocio:
- Button, Input, Card, Badge, Table, Dialog, etc.
- Basados en shadcn/ui
- Reutilizables en todo el proyecto
- Solo props de UI, sin lógica de BD

#### Molecules (molecules/)
Componentes compuestos reutilizables:
- PageHeader, StatsCard, StatusBadge, DataTable
- Composición de atoms
- Lógica de presentación simple
- Reutilizables en múltiples páginas

#### Organisms (domain/)
Componentes específicos por dominio:
- `claims/`, `sales/`, `policies/`, etc.
- Contienen lógica de negocio específica
- Pueden usar Server Actions
- No necesariamente reutilizables

### Cuándo Crear Cada Tipo

**Atom**: Cuando necesitas un componente primitivo UI sin lógica.
```tsx
// ui/button.tsx
export function Button({ children, ...props }) { ... }
```

**Molecule**: Cuando combinas 2+ atoms de forma reutilizable.
```tsx
// molecules/stats-card.tsx
export function StatsCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardContent>...</CardContent>
    </Card>
  )
}
```

**Organism**: Cuando tienes lógica de dominio específica.
```tsx
// sales/kanban-board.tsx
export function KanbanBoard({ initialProspects }) {
  // Lógica de drag & drop, actualización de BD, etc.
}
```

### Convenciones de Nombres

- **Archivos**: kebab-case (ej: `page-header.tsx`, `stats-card.tsx`)
- **Componentes**: PascalCase (ej: `PageHeader`, `StatsCard`)
- **Props Interfaces**: `ComponentNameProps` (ej: `PageHeaderProps`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `PIPELINE_STAGES`)

---

## 3. Guía de Estilos CSS

### Preferencia de Estilos

1. **Primero**: Clases de Tailwind
2. **Segundo**: Variables CSS del sistema
3. **Último**: CSS personalizado en `globals.css`

**Evitar estilos inline** excepto para valores dinámicos:

✅ **Correcto (dinámico):**
```tsx
<div style={{ transform: `translateX(${x}px)` }} />
<div style={{ backgroundColor: item.color }} />
```

❌ **Incorrecto (estático):**
```tsx
<div style={{ padding: '16px', color: 'red' }} />
```

### Uso de cn() para Clases Condicionales

Usar la función `cn()` (combina `clsx` y `tailwind-merge`) para clases condicionales:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-variant-classes"
)} />
```

### Variantes con CVA

Para componentes con variantes complejas, usar `class-variance-authority`:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "base classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## 4. Patrones de Componentes

### Estructura de Props

Siempre tipar las props con TypeScript:

```tsx
interface ComponentProps {
  // Props requeridas primero
  title: string
  value: number
  
  // Props opcionales después
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  
  // Props de children/className al final
  children?: React.ReactNode
  className?: string
}

export function Component({ title, value, subtitle, className }: ComponentProps) {
  return <div className={cn("base-classes", className)}>{...}</div>
}
```

### Composición vs Configuración

Preferir **composición** sobre configuración excesiva:

✅ **Composición (mejor):**
```tsx
<PageHeader
  title="Título"
  actions={
    <>
      <Button>Acción 1</Button>
      <Button>Acción 2</Button>
    </>
  }
/>
```

❌ **Configuración excesiva (evitar):**
```tsx
<PageHeader
  title="Título"
  actions={[
    { label: "Acción 1", onClick: fn1, variant: "primary" },
    { label: "Acción 2", onClick: fn2, variant: "secondary" },
  ]}
/>
```

### Forward Refs

Usar `forwardRef` cuando el componente necesita exponer el ref del DOM:

```tsx
import { forwardRef } from "react"

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn("...", className)} {...props} />
  }
)
Input.displayName = "Input"
```

---

## 5. Separación de Responsabilidades

### Componentes: Solo UI

Los componentes deben enfocarse en presentación, no en lógica de negocio:

✅ **Correcto:**
```tsx
"use client"
import { updateProspectStatus } from "@/app/dashboard/sales/actions"

export function KanbanBoard({ initialProspects }) {
  const handleDragEnd = async (id, newStatus) => {
    const result = await updateProspectStatus(id, newStatus)
    if (!result.success) {
      alert(result.error)
    }
  }
  // ...
}
```

❌ **Incorrecto:**
```tsx
"use client"
import { createClient } from "@/lib/supabase/client"

export function KanbanBoard({ initialProspects }) {
  const supabase = createClient()
  
  const handleDragEnd = async (id, newStatus) => {
    // Lógica de BD directamente en el componente
    const { error } = await supabase.from('prospects').update(...)
  }
  // ...
}
```

### Server Actions

Usar Server Actions para **todas** las operaciones de base de datos:

```tsx
// src/app/dashboard/[module]/actions.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateResource(id: string, data: any) {
  try {
    const supabase = await createClient()
    
    const { data: result, error } = await supabase
      .from('table')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/path')
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Error message' }
  }
}
```

**Beneficios:**
- Separación de responsabilidades
- Código más testeable
- Mejor seguridad (credenciales en servidor)
- Cache y revalidación automáticos

### Hooks para Lógica de Cliente

Para lógica de cliente compleja (sin BD), crear custom hooks:

```tsx
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // ...lógica
}
```

### Validación con Zod

Usar Zod para validación de formularios y datos:

```tsx
import { z } from "zod"

const policySchema = z.object({
  policy_number: z.string().min(1, "Número de póliza requerido"),
  amount: z.number().positive("Monto debe ser positivo"),
  email: z.string().email("Email inválido"),
})

type PolicyFormData = z.infer<typeof policySchema>
```

---

## 6. Buenas Prácticas

### Accesibilidad

- Usar etiquetas semánticas HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Incluir `aria-label` para iconos sin texto
- Asegurar navegación por teclado funcional
- Mantener contraste de colores adecuado

```tsx
<Button aria-label="Cerrar">
  <X className="h-4 w-4" />
</Button>

<nav aria-label="Navegación principal">
  <ul>...</ul>
</nav>
```

### Performance

- Usar `React.memo()` para componentes que renderizan frecuentemente con las mismas props
- Lazy loading para rutas/componentes grandes
- Optimistic updates para mejor UX

```tsx
import { memo } from "react"

export const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // ...
})
```

### Error Handling

Siempre manejar errores y mostrar feedback al usuario:

```tsx
try {
  const result = await serverAction()
  
  if (!result.success) {
    // Mostrar error específico
    toast.error(result.error || 'Error desconocido')
    return
  }
  
  // Success
  toast.success('Operación exitosa')
} catch (error) {
  console.error('Error:', error)
  toast.error('Error inesperado')
}
```

### Loading States

Siempre mostrar estados de carga:

```tsx
const [loading, setLoading] = useState(false)

<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Cargando...
    </>
  ) : (
    'Guardar'
  )}
</Button>
```

---

## 7. Convenciones de Código

### Imports Organizados

Organizar imports en este orden:

```tsx
// 1. React y Next.js
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Librerías externas
import { z } from "zod"

// 3. Componentes UI
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. Componentes molecules/organisms
import { PageHeader } from "@/components/molecules/page-header"

// 5. Server Actions
import { updateClient } from "@/app/dashboard/clients/actions"

// 6. Utilidades y constantes
import { formatCurrency } from "@/lib/utils/formatters"
import { PAYMENT_FREQUENCIES } from "@/lib/constants/design"

// 7. Tipos
import type { Client } from "@/types/domain"
```

### Exports

Preferir **named exports** sobre default exports:

✅ **Correcto:**
```tsx
export function Component() { ... }
```

❌ **Evitar:**
```tsx
export default function Component() { ... }
```

**Excepción**: Páginas de Next.js requieren default export.

### TypeScript

- **Siempre** tipar props, funciones y variables
- Evitar `any`, usar tipos específicos
- Usar `type` para formas de objetos simples
- Usar `interface` cuando necesites extensión

```tsx
// Type para formas simples
type User = {
  id: string
  name: string
}

// Interface para extensión
interface BaseProps {
  className?: string
}

interface ButtonProps extends BaseProps {
  onClick: () => void
}
```

### Funciones

- Preferir arrow functions para componentes y callbacks
- Usar function declarations para Server Actions

```tsx
// Componentes: arrow function
export const Component = () => { ... }

// Server Actions: function declaration
export async function serverAction() { ... }
```

### Comentarios

Comentar solo cuando sea necesario para explicar **por qué**, no **qué**:

✅ **Correcto:**
```tsx
// Usamos optimistic update para mejor UX en conexiones lentas
setData(newData)
```

❌ **Incorrecto:**
```tsx
// Establece los datos a newData
setData(newData)
```

---

## Checklist de Revisión de Código

Antes de hacer commit, verifica:

- [ ] ¿Usaste variables del sistema en lugar de colores hardcodeados?
- [ ] ¿Las props están tipadas con TypeScript?
- [ ] ¿Evitaste estilos inline innecesarios?
- [ ] ¿Usaste Server Actions en lugar de llamadas directas a Supabase en componentes cliente?
- [ ] ¿Los imports están organizados correctamente?
- [ ] ¿Hay error handling adecuado?
- [ ] ¿Hay loading states donde corresponde?
- [ ] ¿El componente está en la carpeta correcta (ui/molecules/domain)?
- [ ] ¿Usaste funciones de formateo (`formatCurrency`, `formatDate`) en lugar de formateo inline?
- [ ] ¿El código es accesible (aria-labels, navegación por teclado)?

---

## Recursos Adicionales

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
