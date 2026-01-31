import { Button } from "@/components/ui/button"
import { Plus, Users, DollarSign, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { KanbanBoard } from "@/components/sales/kanban-board"
import { PageHeader } from "@/components/molecules/page-header"
import { StatsCard } from "@/components/molecules/stats-card"
import { formatCurrency } from "@/lib/utils/formatters"

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
            <PageHeader
                title="Ventas"
                description="Gestiona tu pipeline de prospectos y cierra más negocios."
                actions={
                    <Button asChild>
                        <Link href="/dashboard/sales/new">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Nuevo Prospecto</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Link>
                    </Button>
                }
            />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatsCard
                    title="Total Prospectos"
                    value={totalProspects}
                    subtitle={`${activeProspects} activos`}
                    icon={Users}
                />
                <StatsCard
                    title="Cerrados"
                    value={wonProspects}
                    subtitle={`${totalProspects > 0 ? Math.round((wonProspects / totalProspects) * 100) : 0}% conversión`}
                    icon={Target}
                />
                <StatsCard
                    title="Cotizaciones"
                    value={quotations?.length || 0}
                    subtitle="activas"
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Valor Cotizado"
                    value={formatCurrency(totalQuoted)}
                    subtitle="MXN"
                    icon={DollarSign}
                />
            </div>

            {/* Kanban Board */}
            <div className="min-h-[600px] rounded-xl border bg-muted/10 p-4">
                <KanbanBoard initialProspects={prospects || []} />
            </div>
        </div>
    )
}
