import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, Users, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

export default async function SalesPage() {
    const supabase = await createClient()
    
    // Fetch prospects grouped by status
    const { data: prospects } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: quotations } = await supabase
        .from('quotations')
        .select('*')

    // Calculate stats
    const totalProspects = prospects?.length || 0
    const activeProspects = prospects?.filter(p => !['Ganado', 'Perdido'].includes(p.status)).length || 0
    const wonProspects = prospects?.filter(p => p.status === 'Ganado').length || 0
    const totalQuoted = quotations?.reduce((sum, q) => sum + (q.premium_amount || 0), 0) || 0

    // Group by status for pipeline
    const pipeline = {
        'Nuevo': prospects?.filter(p => p.status === 'Nuevo') || [],
        'Contactado': prospects?.filter(p => p.status === 'Contactado') || [],
        'Cotización': prospects?.filter(p => p.status === 'Cotización') || [],
        'Negociación': prospects?.filter(p => p.status === 'Negociación') || [],
        'Ganado': prospects?.filter(p => p.status === 'Ganado') || [],
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ventas</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Gestiona tu pipeline de prospectos y cierra más negocios.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/sales/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Prospecto
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Prospectos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProspects}</div>
                        <p className="text-xs text-muted-foreground">{activeProspects} activos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{wonProspects}</div>
                        <p className="text-xs text-muted-foreground">
                            {totalProspects > 0 ? Math.round((wonProspects / totalProspects) * 100) : 0}% tasa de conversión
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{quotations?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">activas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Cotizado</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalQuoted.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">MXN</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Pipeline (Kanban-style) */}
            <div className="grid gap-4 md:grid-cols-5">
                {Object.entries(pipeline).map(([status, items]) => (
                    <Card key={status}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                {status}
                                <Badge variant="secondary">{items.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {items.map((prospect: any) => (
                                <Link
                                    key={prospect.id}
                                    href={`/dashboard/sales/${prospect.id}`}
                                    className="block p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                                >
                                    <p className="font-medium text-sm">
                                        {prospect.first_name} {prospect.last_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {prospect.interested_in?.join(', ') || 'Sin especificar'}
                                    </p>
                                    {prospect.priority === 'Alta' && (
                                        <Badge variant="destructive" className="mt-2 text-xs">
                                            Alta prioridad
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                            {items.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    Sin prospectos
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
