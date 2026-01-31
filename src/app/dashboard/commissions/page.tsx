import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/molecules/page-header"
import { StatsCard } from "@/components/molecules/stats-card"
import { StatusBadge } from "@/components/molecules/status-badge"
import { formatCurrency, formatDate } from "@/lib/utils/formatters"
import { MobileCard } from "@/components/molecules/mobile-card"

export default async function CommissionsPage() {
    const supabase = await createClient()
    
    const { data: commissions } = await supabase
        .from('commissions')
        .select('*, policies(policy_number, type, clients(first_name, last_name))')
        .order('created_at', { ascending: false })

    // Calculate stats
    const totalPending = commissions?.filter(c => c.status === 'Pendiente').reduce((sum, c) => sum + c.commission_amount, 0) || 0
    const totalPaid = commissions?.filter(c => c.status === 'Pagada').reduce((sum, c) => sum + c.commission_amount, 0) || 0
    const totalCommissions = (commissions?.reduce((sum, c) => sum + c.commission_amount, 0) || 0)

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Comisiones"
                description="Consulta y gestiona tus comisiones."
            />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard
                    title="Total Comisiones"
                    value={formatCurrency(totalCommissions)}
                    subtitle={`${commissions?.length || 0} comisiones registradas`}
                    icon={DollarSign}
                />
                <StatsCard
                    title="Pendientes de Pago"
                    value={formatCurrency(totalPending)}
                    subtitle="Por cobrar"
                    icon={Clock}
                />
                <StatsCard
                    title="Pagadas"
                    value={formatCurrency(totalPaid)}
                    subtitle="Cobrado"
                    icon={CheckCircle}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalle de Comisiones</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Vista móvil con cards */}
                    <div className="flex flex-col gap-4 md:hidden">
                        {!commissions || commissions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8 text-sm">
                                No hay comisiones registradas
                            </p>
                        ) : (
                            commissions.map((commission: any) => (
                                <MobileCard
                                    key={commission.id}
                                    title={commission.policies?.policy_number || '-'}
                                    badge={<StatusBadge status={commission.status} type="commission" />}
                                    fields={[
                                        { label: "Cliente", value: `${commission.policies?.clients?.first_name} ${commission.policies?.clients?.last_name}` },
                                        { label: "Tipo", value: commission.policies?.type },
                                        { label: "Prima", value: formatCurrency(commission.base_amount) },
                                        { 
                                            label: "Comisión", 
                                            value: `${commission.commission_percentage}% = ${formatCurrency(commission.commission_amount)}`,
                                            className: "font-semibold"
                                        },
                                        { label: "Fecha pago", value: formatDate(commission.paid_date) },
                                    ]}
                                />
                            ))
                        )}
                    </div>

                    {/* Vista desktop con tabla */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Póliza</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Prima Base</TableHead>
                                    <TableHead>%</TableHead>
                                    <TableHead>Comisión</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Pago</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {commissions && commissions.length > 0 ? (
                                    commissions.map((commission: any) => (
                                        <TableRow key={commission.id}>
                                            <TableCell className="font-medium">{commission.policies?.policy_number}</TableCell>
                                            <TableCell>
                                                {commission.policies?.clients?.first_name} {commission.policies?.clients?.last_name}
                                            </TableCell>
                                            <TableCell>{commission.policies?.type}</TableCell>
                                            <TableCell>{formatCurrency(commission.base_amount)}</TableCell>
                                            <TableCell>{commission.commission_percentage}%</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(commission.commission_amount)}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={commission.status} type="commission" />
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(commission.paid_date)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                            No hay comisiones registradas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
