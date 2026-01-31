import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertTriangle, TrendingUp, Car, Heart, Building, ArrowRight, Shield } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { DashboardFilter } from "@/components/dashboard/DashboardFilter"
import { StatsCard } from "@/components/molecules/stats-card"
import { ExpirationCard } from "@/components/molecules/expiration-card"
import { getDashboardStats, getExpiringPolicies } from "./actions"
import { calculateDaysUntil } from "@/lib/utils/formatters"
import Link from "next/link"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const agentFilter = typeof params.agent === 'string' ? params.agent : null

    // Get dashboard stats using Server Action
    const statsResult = await getDashboardStats(agentFilter || undefined)
    const stats = statsResult.success ? statsResult.data : {
        activePolicies: 0,
        totalClients: 0,
        pendingClaims: 0,
        monthlyRevenue: 0,
        policyBreakdown: { vida: 0, gmm: 0, auto: 0, danos: 0 }
    }

    // Get expiring policies using Server Action
    const expirationsResult = await getExpiringPolicies(30, agentFilter || undefined)
    const upcomingExpirations = expirationsResult.success ? expirationsResult.data : []

    // Helper to apply agent filter for recent policies
    const applyFilter = (query: any) => {
        if (agentFilter) {
            return query.eq('agent', agentFilter)
        }
        return query
    }

    // Fetch Recent Policies
    let recentPoliciesQuery = supabase
        .from('policies')
        .select(`
            *,
            clients (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    recentPoliciesQuery = applyFilter(recentPoliciesQuery)
    const { data: recentPolicies } = await recentPoliciesQuery

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <DashboardFilter />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Pólizas Activas with Breakdown */}
                <Card className="md:col-span-2 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pólizas Activas
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline justify-between">
                            <div className="text-3xl font-bold">{stats.activePolicies}</div>
                            <p className="text-xs text-muted-foreground">
                                +12% respecto al mes pasado
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Vida</span>
                                <span className="text-lg font-semibold">{stats.policyBreakdown.vida}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">GMM</span>
                                <span className="text-lg font-semibold">{stats.policyBreakdown.gmm}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Autos</span>
                                <span className="text-lg font-semibold">{stats.policyBreakdown.auto}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Daños</span>
                                <span className="text-lg font-semibold">{stats.policyBreakdown.danos}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Renovaciones (30 días)
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">{upcomingExpirations.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {upcomingExpirations.length} urgentes para este mes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clientes Totales
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +4 nuevos esta semana
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Cards */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Pólizas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Póliza</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Ramo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Prima</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentPolicies?.map((policy: any) => (
                                        <TableRow key={policy.id}>
                                            <TableCell className="font-medium">{policy.policy_number}</TableCell>
                                            <TableCell>{policy.clients?.first_name} {policy.clients?.last_name}</TableCell>
                                            <TableCell>{policy.type}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        policy.status === "Activa"
                                                            ? "default"
                                                            : policy.status === "En Trámite"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {policy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">${policy.amount?.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Próximos Vencimientos</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                            Ver todo <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingExpirations.map((item) => (
                                <Link key={item.id} href={`/dashboard/policies/${item.id}`}>
                                    <ExpirationCard
                                        policyNumber={item.policy_number}
                                        clientName={`${item.clients?.first_name} ${item.clients?.last_name}`}
                                        expirationDate={item.end_date}
                                        daysUntilExpiration={item.daysUntilExpiration}
                                    />
                                </Link>
                            ))}
                            {upcomingExpirations.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No hay vencimientos próximos
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
