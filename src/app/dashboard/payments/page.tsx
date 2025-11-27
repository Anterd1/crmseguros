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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cobranza</h2>
                    <p className="text-muted-foreground">
                        Control de pagos y comisiones.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrar
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Próximos Cobros</CardTitle>
                </CardHeader>
                <CardContent>
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
                                    <TableCell>${payment.amount}</TableCell>
                                    <TableCell>{payment.due_date}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                payment.status === "Pagado"
                                                    ? "default"
                                                    : payment.status === "Atrasado"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                            className={payment.status === "Pagado" ? "bg-green-600 hover:bg-green-700" : ""}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
