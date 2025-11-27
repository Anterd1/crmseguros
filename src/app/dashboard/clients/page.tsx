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
import { Plus, Search, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default async function ClientsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const message = searchParams.message
    const supabase = await createClient()

    const { data: clients } = await supabase.from('clients').select('*')

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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">
                        Gestión de tu cartera de clientes.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/clients/new">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                    </Link>
                </Button>
            </div>

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
                    <div className="flex items-center justify-between">
                        <CardTitle>Cartera de Clientes</CardTitle>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar cliente..."
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
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
                                        <Button variant="ghost" size="sm">Ver Perfil</Button>
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
