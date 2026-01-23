"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, User, AlertCircle, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NewClientPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [clientType, setClientType] = useState("Física")
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    })
    const [documents, setDocuments] = useState<Record<string, File | null>>({
        idOfficial: null,
        proofAddress: null,
        csf: null,
        constitutive: null,
        commercial: null,
        attorneyId: null,
        proofAddressLegal: null,
        csfLegal: null,
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No authenticated user")

            // File upload logic would go here (storage bucket required).
            // For now, we just keep selected files in state to confirm selection in UI.

            const { error: insertError } = await supabase.from('clients').insert({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                client_type: clientType,
                user_id: user.id,
                documents: [] // Placeholder for now
            })

            if (insertError) throw insertError

            router.push('/dashboard/clients')
            router.refresh()
        } catch (err: any) {
            console.error('Error creating client:', err)
            setError(err.message || "Error al crear el cliente")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/clients">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <User className="h-8 w-8" />
                    Nuevo Cliente
                </h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                        Datos generales del cliente o prospecto.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo de Persona</Label>
                                <Select value={clientType} onValueChange={setClientType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Física">Física (Individual)</SelectItem>
                                        <SelectItem value="Moral">Moral (Empresa)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Nombre(s) / Razón Social</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    placeholder={clientType === 'Moral' ? "Ej. Empresa S.A. de C.V." : "Ej. Juan"}
                                    required
                                />
                            </div>
                            {clientType === 'Física' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Apellidos</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        placeholder="Ej. Pérez"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="cliente@email.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono / Celular</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="55 1234 5678"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Documentación Requerida</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {clientType === 'Física' ? (
                                    <>
                                        <label
                                            htmlFor="doc-id-official"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.idOfficial
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Identificación Oficial</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.idOfficial ? documents.idOfficial.name : "Sin archivo"}
                                            </span>
                                            {documents.idOfficial && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-id-official"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        idOfficial: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-proof-address"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.proofAddress
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Comprobante de Domicilio</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.proofAddress ? documents.proofAddress.name : "Sin archivo"}
                                            </span>
                                            {documents.proofAddress && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-proof-address"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        proofAddress: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-csf"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.csf
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Constancia de Situación Fiscal (CSF)</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.csf ? documents.csf.name : "Sin archivo"}
                                            </span>
                                            {documents.csf && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-csf"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        csf: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <label
                                            htmlFor="doc-constitutive"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.constitutive
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Acta Constitutiva</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.constitutive ? documents.constitutive.name : "Sin archivo"}
                                            </span>
                                            {documents.constitutive && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-constitutive"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        constitutive: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-commercial"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.commercial
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Folio Mercantil</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.commercial ? documents.commercial.name : "Sin archivo"}
                                            </span>
                                            {documents.commercial && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-commercial"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        commercial: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-attorney-id"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.attorneyId
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Identificación Apoderado</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.attorneyId ? documents.attorneyId.name : "Sin archivo"}
                                            </span>
                                            {documents.attorneyId && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-attorney-id"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        attorneyId: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-proof-address-legal"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.proofAddressLegal
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Comprobante de Domicilio</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.proofAddressLegal ? documents.proofAddressLegal.name : "Sin archivo"}
                                            </span>
                                            {documents.proofAddressLegal && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-proof-address-legal"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        proofAddressLegal: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label
                                            htmlFor="doc-csf-legal"
                                            className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                                                documents.csfLegal
                                                    ? "border-primary/30 bg-primary/5"
                                                    : "border-dashed hover:bg-muted/50"
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                            <span className="text-sm font-medium">Constancia de Situación Fiscal (CSF)</span>
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {documents.csfLegal ? documents.csfLegal.name : "Sin archivo"}
                                            </span>
                                            {documents.csfLegal && (
                                                <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
                                                    Archivo listo
                                                </span>
                                            )}
                                            <Input
                                                id="doc-csf-legal"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    setDocuments((prev) => ({
                                                        ...prev,
                                                        csfLegal: e.target.files?.[0] ?? null,
                                                    }))
                                                }
                                            />
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/clients">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cliente
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
