import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/molecules/page-header"
import { StatusBadge } from "@/components/molecules/status-badge"
import { formatDate, formatCurrency } from "@/lib/utils/formatters"

export default async function PaymentsPage() {
    const supabase = await createClient()
    // Fetch payments with policy and client details (via policy)
    // Note: Since payments table has policy_id, we join policies. 
    // Policies table has client_id, so we join clients through policies.
    // Syntax: policies ( policy_number, clients ( first_name, last_name ) )
    const { data: payments } = await supabase
        .from('payments')
        .select(`
            *,
            policies (
                policy_number,
                clients (
                    first_name,
                    last_name
                )
            )
        `)
        .order('due_date', { ascending: true })

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Cobranza"
                description="Control de pagos y comisiones."
                actions={
                    <>
                        <Button variant="outline" className="flex-1 md:flex-none">
                            <Filter className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Filtrar</span>
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none">
                            <Download className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </Button>
                    </>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Próximos Cobros</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Wrap table in overflow container for mobile */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Póliza</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Vencimiento</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No hay cobros registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {payments?.map((payment: any) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">
                                            {payment.policies?.policy_number || 'Sin Póliza'}
                                        </TableCell>
                                        <TableCell>
                                            {payment.policies?.clients?.first_name} {payment.policies?.clients?.last_name}
                                        </TableCell>
                                        <TableCell>{payment.concept}</TableCell>
                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell>{formatDate(payment.due_date)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={payment.status} type="payment" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
