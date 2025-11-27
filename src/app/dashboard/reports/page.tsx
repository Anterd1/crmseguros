import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ReportsCharts } from "@/components/reports/charts"

export default async function ReportsPage() {
    const supabase = await createClient()

    // Fetch basic stats
    const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true })
    const { count: policiesCount } = await supabase.from('policies').select('*', { count: 'exact', head: true })
    const { count: claimsCount } = await supabase.from('claims').select('*', { count: 'exact', head: true })

    // Fetch data for charts
    const { data: payments } = await supabase
        .from('payments')
        .select('amount, due_date, status')
        .eq('status', 'Pagado')
        .gte('due_date', `${new Date().getFullYear()}-01-01`)
        .lte('due_date', `${new Date().getFullYear()}-12-31`)

    const { data: policies } = await supabase
        .from('policies')
        .select('type')

    // Aggregate Monthly Production
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const monthlyData = months.map((name, index) => {
        const total = payments?.filter(p => {
            const date = new Date(p.due_date)
            return date.getMonth() === index
        }).reduce((sum, p) => sum + Number(p.amount), 0) || 0
        return { name, total }
    })

    // Aggregate Portfolio Distribution
    const distributionMap = new Map<string, number>()
    policies?.forEach(p => {
        const type = p.type || "Otros"
        distributionMap.set(type, (distributionMap.get(type) || 0) + 1)
    })

    const distributionData = Array.from(distributionMap.entries()).map(([name, value]) => ({
        name,
        value
    })).sort((a, b) => b.value - a.value) // Sort by count descending

    // Fallback for empty data to show something (optional, or just empty chart)
    if (distributionData.length === 0) {
        distributionData.push({ name: "Sin Pólizas", value: 1 })
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Reportes y Estadísticas</h2>
                <p className="text-muted-foreground">
                    Análisis detallado del rendimiento de la cartera.
                </p>
            </div>

            <ReportsCharts monthlyData={monthlyData} distributionData={distributionData} />

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Clientes</CardTitle>
                        <CardDescription>Cartera activa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-600">{clientsCount || 0}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Clientes registrados en el sistema.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Pólizas</CardTitle>
                        <CardDescription>Pólizas registradas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-600">{policiesCount || 0}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Pólizas gestionadas actualmente.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Siniestros</CardTitle>
                        <CardDescription>Total reportados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-orange-500">{claimsCount || 0}</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Incidentes registrados históricamente.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
