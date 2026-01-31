import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Filter, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/server"
import { ImportPolicyModal } from "@/components/policies/import-modal"
import { SearchBar } from "@/components/molecules/search-bar"
import { PageHeader } from "@/components/molecules/page-header"
import { StatusBadge } from "@/components/molecules/status-badge"
import { MobileCard } from "@/components/molecules/mobile-card"
import { formatDate } from "@/lib/utils/formatters"

export default async function PoliciesPage() {
    const supabase = await createClient()
    const { data: policies } = await supabase
        .from('policies')
        .select('*, clients(first_name, last_name)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pólizas"
                description="Gestiona y consulta el inventario de pólizas."
                actions={
                    <>
                        <ImportPolicyModal />
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Filtros</span>
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard/policies/new">
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Nueva Póliza</span>
                                <span className="sm:hidden">Nueva</span>
                            </Link>
                        </Button>
                    </>
                }
            />

            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle>Listado de Pólizas</CardTitle>
                        <div className="w-full sm:w-72">
                            <SearchBar placeholder="Buscar por cliente, póliza..." />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Vista móvil con cards */}
                    <div className="flex flex-col gap-4 md:hidden">
                        {!policies || policies.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8 text-sm">
                                No hay pólizas registradas.
                            </p>
                        ) : (
                            policies.map((policy: any) => (
                                <MobileCard
                                    key={policy.id}
                                    title={policy.policy_number}
                                    badge={<StatusBadge status={policy.status} type="policy" />}
                                    fields={[
                                        {
                                            label: "Cliente",
                                            value: `${policy.clients?.first_name} ${policy.clients?.last_name}`
                                        },
                                        { label: "Compañía", value: policy.company || "-" },
                                        { label: "Ramo", value: policy.type || "-" },
                                        { label: "Próx. pago", value: formatDate(policy.next_payment_date) },
                                    ]}
                                    actions={
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    Acciones
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/policies/${policy.id}`}>
                                                        Ver Detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/policies/${policy.id}/edit`}>
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/policies/${policy.id}/renew`}>
                                                        Renovar
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    }
                                />
                            ))
                        )}
                    </div>

                    {/* Vista desktop con tabla */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Póliza</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Ramo</TableHead>
                                    <TableHead className="hidden xl:table-cell">Mes Contrato</TableHead>
                                    <TableHead className="hidden xl:table-cell">Frecuencia</TableHead>
                                    <TableHead className="hidden xl:table-cell">Próx. Pago</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!policies || policies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                            No hay pólizas registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    policies.map((policy: any) => (
                                        <TableRow key={policy.id}>
                                            <TableCell className="font-medium">
                                                {policy.policy_number}
                                            </TableCell>
                                            <TableCell>
                                                {policy.clients?.first_name} {policy.clients?.last_name}
                                            </TableCell>
                                            <TableCell>{policy.company || '-'}</TableCell>
                                            <TableCell>{policy.type}</TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {policy.contract_month || '-'}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {policy.payment_frequency || '-'}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {formatDate(policy.next_payment_date)}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={policy.status} type="policy" />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Acciones</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/policies/${policy.id}`}>
                                                                Ver Detalles
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/policies/${policy.id}/edit`}>
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/policies/${policy.id}/renew`}>
                                                                Renovar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
