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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Comisiones</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Consulta y gestiona tus comisiones.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comisiones</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCommissions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {commissions?.length || 0} comisiones registradas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes de Pago</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Por cobrar
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Cobrado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalle de Comisiones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
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
                                            <TableCell>${commission.base_amount?.toLocaleString()}</TableCell>
                                            <TableCell>{commission.commission_percentage}%</TableCell>
                                            <TableCell className="font-semibold">${commission.commission_amount?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={commission.status === 'Pagada' ? 'default' : 'secondary'}>
                                                    {commission.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {commission.paid_date ? new Date(commission.paid_date).toLocaleDateString() : '-'}
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
