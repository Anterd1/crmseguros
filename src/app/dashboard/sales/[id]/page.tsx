import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Mail, Phone, Calendar, CheckCircle2, Target } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ConvertToClientButton } from "@/components/sales/convert-to-client-button"

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: prospect, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !prospect) {
        notFound();
    }

    const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('prospect_id', id)
        .order('created_at', { ascending: false });

    const { data: quotations } = await supabase
        .from('quotations')
        .select('*')
        .eq('prospect_id', id)
        .order('created_at', { ascending: false });

    const statusColors: Record<string, string> = {
        'Nuevo': 'bg-blue-500',
        'Contactado': 'bg-yellow-500',
        'Cotización': 'bg-purple-500',
        'Negociación': 'bg-orange-500',
        'Ganado': 'bg-green-500',
        'Perdido': 'bg-red-500'
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/sales">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {prospect.first_name} {prospect.last_name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {prospect.company_name || 'Prospecto individual'}
                        </p>
                    </div>
                </div>
                {!prospect.converted && (
                    <ConvertToClientButton prospectId={id} />
                )}
            </div>

            {/* Status and Priority */}
            <div className="flex items-center gap-3">
                <Badge className={statusColors[prospect.status] + " text-white"}>
                    {prospect.status}
                </Badge>
                <Badge variant="outline">{prospect.priority} prioridad</Badge>
                {prospect.source && <Badge variant="secondary">Fuente: {prospect.source}</Badge>}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {prospect.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Teléfono</p>
                                    <p className="text-sm text-muted-foreground">{prospect.phone}</p>
                                </div>
                            </div>
                        )}
                        {prospect.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{prospect.email}</p>
                                </div>
                            </div>
                        )}
                        {prospect.next_followup_date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Próximo Seguimiento</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(prospect.next_followup_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sales Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Venta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {prospect.interested_in && prospect.interested_in.length > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2">Productos de Interés</p>
                                <div className="flex flex-wrap gap-2">
                                    {prospect.interested_in.map((product: string) => (
                                        <Badge key={product} variant="secondary">{product}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {prospect.budget_range && (
                            <div>
                                <p className="text-sm font-medium">Presupuesto Estimado</p>
                                <p className="text-sm text-muted-foreground">{prospect.budget_range}</p>
                            </div>
                        )}
                        {prospect.notes && (
                            <div>
                                <p className="text-sm font-medium">Notas</p>
                                <p className="text-sm text-muted-foreground">{prospect.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quotations */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Cotizaciones</CardTitle>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/sales/${id}/quote`}>Nueva Cotización</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {quotations && quotations.length > 0 ? (
                        <div className="space-y-3">
                            {quotations.map((quote: any) => (
                                <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{quote.quote_number}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {quote.product_type} - {quote.company} - ${quote.premium_amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <Badge variant={quote.status === 'Aceptada' ? 'default' : 'secondary'}>
                                        {quote.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Sin cotizaciones registradas
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Activities */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Actividades</CardTitle>
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/dashboard/sales/${id}/activity`}>Nueva Actividad</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {activities && activities.length > 0 ? (
                        <div className="space-y-3">
                            {activities.map((activity: any) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                    {activity.completed ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                    ) : (
                                        <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-sm">{activity.type}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Sin actividades registradas
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
