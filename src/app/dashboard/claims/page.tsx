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
import { AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/molecules/page-header"
import { StatusBadge } from "@/components/molecules/status-badge"
import { formatDate, formatCurrency } from "@/lib/utils/formatters"

export default async function ClaimsPage() {
    const supabase = await createClient()

    const { data: claims } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false })

    // Calculate "Atención Inmediata" (Open claims created in the last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const urgentClaims = claims?.filter(c =>
        c.status === 'Abierto' && c.created_at >= oneDayAgo
    ) || []

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Siniestros"
                description="Seguimiento de incidentes y reclamaciones."
                actions={
                    <Button variant="destructive" asChild>
                        <Link href="/dashboard/claims/new">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Reportar Siniestro</span>
                            <span className="sm:hidden">Reportar</span>
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-red-50 border-red-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Atención Inmediata
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">{urgentClaims.length}</div>
                        <p className="text-sm text-red-600">Siniestros abiertos &lt; 24h</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bitácora de Siniestros</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Wrap table in overflow container for mobile */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Siniestro</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estatus</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {claims?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No hay siniestros registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {claims?.map((claim) => (
                                    <TableRow key={claim.id}>
                                        <TableCell className="font-medium">{claim.claim_number}</TableCell>
                                        <TableCell>{claim.type}</TableCell>
                                        <TableCell>{formatDate(claim.incident_date)}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={claim.status} type="claim" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Ver Detalle</Button>
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
