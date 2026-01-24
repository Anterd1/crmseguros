import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Mail, Phone, MapPin, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch client data
    const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !client) {
        notFound();
    }

    // Fetch client's policies
    const { data: policies } = await supabase
        .from('policies')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {client.first_name} {client.last_name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {client.client_type || 'Física'}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>Datos de contacto y fiscales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {client.rfc && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">RFC</p>
                                <p className="text-sm">{client.rfc}</p>
                            </div>
                        )}
                        {client.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{client.email}</p>
                                </div>
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                    <p className="text-sm">{client.phone}</p>
                                </div>
                            </div>
                        )}
                        {client.address && Object.keys(client.address).length > 0 && (
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                                    <p className="text-sm">
                                        {client.address.street} {client.address.exteriorNumber}
                                        {client.address.neighborhood && `, ${client.address.neighborhood}`}
                                        <br />
                                        {client.address.city}, {client.address.state} {client.address.zipCode}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Cliente desde</p>
                                <p className="text-sm">{new Date(client.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Policy Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de Pólizas</CardTitle>
                        <CardDescription>
                            {policies?.length || 0} póliza(s) registrada(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {policies?.map((policy: any) => (
                                <div key={policy.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{policy.policy_number}</p>
                                        <p className="text-xs text-muted-foreground">{policy.type} - {policy.company}</p>
                                    </div>
                                    <Badge variant={policy.status === 'Activa' ? 'default' : 'secondary'}>
                                        {policy.status}
                                    </Badge>
                                </div>
                            ))}
                            {(!policies || policies.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Sin pólizas registradas
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policies Detail Table */}
            {policies && policies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Detalle de Pólizas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No. Póliza</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Ramo</TableHead>
                                    <TableHead>Vigencia</TableHead>
                                    <TableHead>Prima</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {policies.map((policy: any) => (
                                    <TableRow key={policy.id}>
                                        <TableCell className="font-medium">{policy.policy_number}</TableCell>
                                        <TableCell>{policy.company}</TableCell>
                                        <TableCell>{policy.type}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(policy.start_date).toLocaleDateString()} - {new Date(policy.end_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {policy.financial_data?.totalPremium 
                                                ? `$${policy.financial_data.totalPremium.toLocaleString()} ${policy.financial_data.currency || 'MXN'}`
                                                : `$${policy.amount?.toLocaleString() || 0}`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={policy.status === 'Activa' ? 'default' : 'secondary'}>
                                                {policy.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
