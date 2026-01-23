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

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Listado de Pólizas</CardTitle>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por cliente, póliza..."
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Wrap table in overflow container for mobile */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Póliza</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Ramo</TableHead>
                                    <TableHead>Mes Contrato</TableHead>
                                    <TableHead>Frecuencia</TableHead>
                                    <TableHead>Próx. Pago</TableHead>
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
                                        <TableCell>{policy.company || '-'}</TableCell>
                                        <TableCell>{policy.type}</TableCell>
                                        <TableCell>{policy.contract_month || '-'}</TableCell>
                                        <TableCell>{policy.payment_frequency || '-'}</TableCell>
                                        <TableCell>{policy.next_payment_date || '-'}</TableCell>
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
                                                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem>Renovar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
