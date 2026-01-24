import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react"
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
import { SearchInput } from "@/components/search-input"

export default async function PoliciesPage() {
    const supabase = await createClient()
    const { data: policies } = await supabase
        .from('policies')
        .select('*, clients(first_name, last_name)')
        .order('created_at', { ascending: false })

    return (
        <div className="flex flex-col gap-6">
            {/* Header - Responsive */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pólizas</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Gestiona y consulta el inventario de pólizas.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportPolicyModal />
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Filtros</span>
                    </Button>
                    <Button asChild className="flex-1 md:flex-none">
                        <Link href="/dashboard/policies/new">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Nueva Póliza</span>
                            <span className="sm:hidden">Nueva</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold">Listado de Pólizas</h3>
                    <div className="w-full md:w-72">
                        <SearchInput placeholder="Buscar por cliente, póliza..." />
                    </div>
                </div>

                <div>
                    {/* Mobile cards */}
                    <div className="flex flex-col gap-4 md:hidden">
                        {policies?.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                No hay pólizas registradas.
                            </div>
                        )}
                        {policies?.map((policy: any) => (
                            <div key={policy.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="text-xs text-muted-foreground">No. Póliza</div>
                                        <div className="truncate font-semibold">{policy.policy_number}</div>
                                    </div>
                                    <Badge
                                        variant={
                                            policy.status === "Activa"
                                                ? "default"
                                                : policy.status === "Vencida"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {policy.status}
                                    </Badge>
                                </div>
                                <div className="mt-3 grid gap-2 text-sm">
                                    <div className="truncate">
                                        <span className="text-muted-foreground">Cliente:</span>{" "}
                                        {policy.clients?.first_name} {policy.clients?.last_name}
                                    </div>
                                    <div className="truncate">
                                        <span className="text-muted-foreground">Compañía:</span>{" "}
                                        {policy.company || "-"}
                                    </div>
                                    <div className="truncate">
                                        <span className="text-muted-foreground">Ramo:</span>{" "}
                                        {policy.type || "-"}
                                    </div>
                                    <div className="truncate">
                                        <span className="text-muted-foreground">Próx. pago:</span>{" "}
                                        {policy.next_payment_date || "-"}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                Acciones
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/policies/${policy.id}`}>Ver Detalles</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/policies/${policy.id}/edit`}>Editar</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/policies/${policy.id}/renew`}>Renovar</Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden w-full overflow-x-auto md:block">
                        <Table className="min-w-[720px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Póliza</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="hidden lg:table-cell">Compañía</TableHead>
                                    <TableHead className="hidden lg:table-cell">Ramo</TableHead>
                                    <TableHead className="hidden xl:table-cell">Mes Contrato</TableHead>
                                    <TableHead className="hidden xl:table-cell">Frecuencia</TableHead>
                                    <TableHead className="hidden xl:table-cell">Próx. Pago</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {policies?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                            No hay pólizas registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {policies?.map((policy: any) => (
                                    <TableRow key={policy.id}>
                                        <TableCell className="font-medium">{policy.policy_number}</TableCell>
                                        <TableCell>{policy.clients?.first_name} {policy.clients?.last_name}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{policy.company || '-'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{policy.type}</TableCell>
                                        <TableCell className="hidden xl:table-cell">{policy.contract_month || '-'}</TableCell>
                                        <TableCell className="hidden xl:table-cell">{policy.payment_frequency || '-'}</TableCell>
                                        <TableCell className="hidden xl:table-cell">{policy.next_payment_date || '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    policy.status === "Activa"
                                                        ? "default"
                                                        : policy.status === "Vencida"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                            >
                                                {policy.status}
                                            </Badge>
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
                                                        <Link href={`/dashboard/policies/${policy.id}`}>Ver Detalles</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/policies/${policy.id}/edit`}>Editar</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/policies/${policy.id}/renew`}>Renovar</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
