import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { Plus, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { SearchBar } from "@/components/molecules/search-bar"
import { PageHeader } from "@/components/molecules/page-header"

export default async function ClientsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const message = searchParams.message
    const searchTerm = (searchParams.search as string) || ''
    const supabase = await createClient()

    let query = supabase.from('clients').select('*')
    
    // Apply search filter
    if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,rfc.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    }
    
    const { data: clients } = await query

    // Fetch policy counts for each client
    // This is N+1 but acceptable for small datasets. For larger ones, use a view or RPC.
    const clientsWithCounts = await Promise.all((clients || []).map(async (client) => {
        const { count } = await supabase
            .from('policies')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', client.id)
        return { ...client, policyCount: count || 0 }
    }))

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Clientes"
                description="Gestión de tu cartera de clientes."
                actions={
                    <Button asChild>
                        <Link href="/dashboard/clients/new">
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Nuevo Cliente</span>
                            <span className="sm:hidden">Nuevo</span>
                        </Link>
                    </Button>
                }
            />

            {message && (
                <Alert className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Éxito</AlertTitle>
                    <AlertDescription>
                        {message}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Cartera de Clientes</CardTitle>
                        <div className="w-full md:w-72">
                            <SearchBar placeholder="Buscar cliente..." paramName="search" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Wrap table in overflow container for mobile */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Pólizas Activas</TableHead>
                                    <TableHead>Fecha Registro</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No hay clientes registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {clients?.map((client: any) => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.first_name} {client.last_name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {client.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{client.policies?.[0]?.count || 0}</TableCell>
                                        <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/dashboard/clients/${client.id}`}>Ver Perfil</Link>
                                            </Button>
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
