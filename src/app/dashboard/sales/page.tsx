import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, DollarSign, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/sales/kanban-board"

export default async function SalesPage() {
    const supabase = await createClient()
    
    // Fetch all prospects
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
                            {totalProspects > 0 ? Math.round((wonProspects / totalProspects) * 100) : 0}% conversión
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

            {/* Kanban Board */}
            <div className="min-h-[600px] rounded-xl border bg-muted/10 p-4 overflow-hidden">
                <KanbanBoard initialProspects={prospects || []} />
            </div>
        </div>
    )
}
