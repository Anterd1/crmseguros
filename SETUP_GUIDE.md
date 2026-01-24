# Guía de Configuración - GCP CRM

## Migraciones de Base de Datos

Ejecuta estos archivos SQL en el SQL Editor de Supabase (en orden):

1. `supabase/migrations/update_schema.sql` - Campos adicionales básicos
2. `supabase/migrations/add_policy_import_fields.sql` - Campos para importación de pólizas
3. `supabase/migrations/create_prospects_module.sql` - Módulo de ventas/prospección
4. `supabase/migrations/create_commissions_module.sql` - Módulo de comisiones
5. `supabase/migrations/create_documents_module.sql` - Módulo de documentos

## Variables de Entorno

Agrega estas claves a tu archivo `.env.local`:

```env
# Supabase (ya configuradas)
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key

# Google Gemini AI (para lectura de PDFs)
GEMINI_API_KEY=AIza...
# Consigue tu key en: https://aistudio.google.com/apikey

# Resend (para emails)
RESEND_API_KEY=re_...
# Consigue tu key en: https://resend.com/api-keys

# Stripe (para pagos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Consigue tus keys en: https://dashboard.stripe.com/apikeys

# Seguridad para Cron Jobs
CRON_SECRET=un_secreto_aleatorio_seguro
# Opcional: para proteger tus endpoints de cron

# URL de tu app (producción)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

## Configuración de Supabase Storage

1. Ve a **Storage** en tu dashboard de Supabase
2. Crea un bucket llamado `policy-documents`
3. Márcalo como **Público**
4. (Opcional) Configura restricciones de tamaño (ej: 10MB max)

## Configuración de Stripe

1. Crea cuenta en [Stripe](https://stripe.com)
2. Obtén tus API keys (modo test primero)
3. Configura webhook endpoint: `https://tu-dominio.com/api/webhooks/stripe`
4. Eventos a escuchar: `checkout.session.completed`, `payment_intent.succeeded`
5. Copia el webhook secret a `.env.local`

## Configuración de Resend (Email)

1. Crea cuenta en [Resend](https://resend.com)
2. Verifica tu dominio (o usa el sandbox)
3. Obtén tu API key
4. Actualiza los emails en `src/lib/services/notifications/email.ts` con tu dominio verificado

## Configuración de Cron Jobs (Vercel)

Los cron jobs están definidos en `vercel.json`:

- **Actualizar estados de pólizas**: Diario a medianoche
- **Generar pagos recurrentes**: Día 1 de cada mes a las 2 AM
- **Enviar recordatorios de renovación**: Diario a las 9 AM
- **Generar comisiones**: Diario a las 3 AM

Para protegerlos, agrega `CRON_SECRET` a tus variables de entorno en Vercel.

## Nuevos Módulos Implementados

### 1. Ventas (Sales)
- **Ruta**: `/dashboard/sales`
- **Funcionalidad**: Pipeline de prospectos, cotizaciones, conversión a clientes
- **Tablas**: `prospects`, `quotations`, `activities`

### 2. Comisiones
- **Ruta**: `/dashboard/commissions`
- **Funcionalidad**: Tracking de comisiones por póliza vendida
- **Tablas**: `commissions`, `commission_rules`

### 3. Documentos
- **Ruta**: `/dashboard/documents`
- **Funcionalidad**: Gestión centralizada de archivos
- **Tabla**: `documents`

## Funcionalidades Agregadas

### Búsqueda Funcional
- Ahora puedes buscar en **Pólizas** y **Clientes** por cualquier campo
- La búsqueda es en tiempo real

### Workflow de Renovación
- Desde el menú de acciones de una póliza, selecciona "Renovar"
- Pre-carga los datos de la póliza anterior
- Genera una nueva póliza vinculada

### Automatización
- Los estados de pólizas se actualizan automáticamente (Activa → Vencida)
- Los pagos recurrentes se generan automáticamente
- Las comisiones se calculan automáticamente
- Se envían recordatorios de renovación

### Sistema de Notificaciones
- Emails de renovación (30 días antes del vencimiento)
- Emails de recordatorio de pago
- Emails de cotizaciones

### Integraciones
- **Gemini AI**: Lectura inteligente de PDFs de pólizas
- **Stripe**: Procesamiento de pagos con tarjeta
- **Resend**: Envío de emails transaccionales

## Próximos Pasos Recomendados

1. **Ejecutar todas las migraciones SQL**
2. **Configurar las variables de entorno**
3. **Probar el flujo de ventas**: Crear prospecto → Convertir a cliente → Importar póliza
4. **Configurar Stripe en modo test** y probar un pago
5. **Configurar Resend** y enviar un email de prueba
6. **Revisar los cron jobs** (se activarán automáticamente al desplegar en Vercel)

## Soporte

Para cualquier duda sobre la configuración, revisa los comentarios en el código o la documentación oficial de cada servicio.
