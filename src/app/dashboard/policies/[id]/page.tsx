import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, FileText, Download } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: policy, error } = await supabase
        .from('policies')
        .select('*, clients(*)')
        .eq('id', id)
        .single();

    if (error || !policy) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/policies">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Póliza {policy.policy_number}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {policy.company} - {policy.type}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Policy Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Póliza</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Estado</p>
                            <Badge variant={policy.status === 'Activa' ? 'default' : 'secondary'}>
                                {policy.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Vigencia</p>
                            <p className="text-sm">
                                {new Date(policy.start_date).toLocaleDateString()} - {new Date(policy.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Frecuencia de Pago</p>
                            <p className="text-sm">{policy.payment_frequency || 'No especificada'}</p>
                        </div>
                        {policy.next_payment_date && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Próximo Pago</p>
                                <p className="text-sm">{new Date(policy.next_payment_date).toLocaleDateString()}</p>
                            </div>
                        )}
                        {policy.agent && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Agente</p>
                                <p className="text-sm">{policy.agent}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Client Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                            <p className="text-sm">{policy.clients?.first_name} {policy.clients?.last_name}</p>
                        </div>
                        {policy.clients?.rfc && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">RFC</p>
                                <p className="text-sm">{policy.clients.rfc}</p>
                            </div>
                        )}
                        {policy.clients?.email && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-sm">{policy.clients.email}</p>
                            </div>
                        )}
                        {policy.clients?.phone && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                                <p className="text-sm">{policy.clients.phone}</p>
                            </div>
                        )}
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/clients/${policy.client_id}`}>
                                Ver Perfil Completo
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Financial Details */}
                {policy.financial_data && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Desglose Financiero</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Prima Neta</p>
                                    <p className="text-lg font-semibold">
                                        ${policy.financial_data.netPremium?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">IVA</p>
                                    <p className="text-lg font-semibold">
                                        ${policy.financial_data.taxAmount?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Prima Total</p>
                                    <p className="text-lg font-semibold text-primary">
                                        ${policy.financial_data.totalPremium?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Moneda</p>
                                    <p className="text-lg font-semibold">
                                        {policy.financial_data.currency || 'MXN'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Documents */}
                {policy.metadata?.pdf_url && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Documentos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" asChild>
                                <a href={policy.metadata.pdf_url} target="_blank" rel="noopener noreferrer">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Ver PDF Original
                                    <Download className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
