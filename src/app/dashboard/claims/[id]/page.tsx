import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Upload, FileText, Download } from "lucide-react"
import Link from "next/link"
import { ReimbursementList } from "@/components/claims/ReimbursementList"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function ClaimDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: claim } = await supabase
        .from('claims')
        .select('*, policies(policy_number, type, company)')
        .eq('id', id)
        .single()

    if (!claim) {
        notFound()
    }

    const { data: reimbursements } = await supabase
        .from('reimbursements')
        .select('*')
        .eq('claim_id', id)
        .order('date', { ascending: false })

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/claims">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Siniestro #{claim.claim_number}</h2>
                    <p className="text-muted-foreground">
                        {claim.type} • {claim.policies?.policy_number}
                    </p>
                </div>
                <div className="ml-auto">
                    <Badge variant={claim.status === 'Abierto' ? 'default' : 'secondary'}>
                        {claim.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Siniestro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Fecha del Incidente</Label>
                                    <p className="font-medium">{claim.incident_date}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Tipo</Label>
                                    <p className="font-medium">{claim.type}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground">Descripción</Label>
                                    <p className="mt-1">{claim.description || "Sin descripción"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Seguimiento de Pagos</CardTitle>
                            <CardDescription>
                                Registro de reembolsos, pagos directos e indemnizaciones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReimbursementList claimId={id} initialReimbursements={reimbursements || []} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentos</CardTitle>
                            <CardDescription>Archivos adjuntos al siniestro.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Subir documento</p>
                                <p className="text-xs text-muted-foreground">Facturas, informes, fotos</p>
                                <Input type="file" className="hidden" />
                            </div>

                            <div className="space-y-2">
                                {/* Placeholder for documents list */}
                                <div className="flex items-center justify-between p-2 border rounded-md">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Informe_Inicial.pdf</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
