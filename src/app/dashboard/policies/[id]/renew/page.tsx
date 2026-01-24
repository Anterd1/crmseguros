"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function RenewPolicyPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [originalPolicy, setOriginalPolicy] = useState<any>(null)
    const [formData, setFormData] = useState({
        policy_number: "",
        company: "",
        type: "",
        start_date: "",
        end_date: "",
        amount: "",
        agent: "",
        payment_frequency: "",
        next_payment_date: "",
    })

    useEffect(() => {
        async function loadPolicy() {
            const { data: policy, error} = await supabase
                .from('policies')
                .select('*, clients(*)')
                .eq('id', params.id)
                .single()

            if (error) {
                alert("Error al cargar la póliza")
                router.push('/dashboard/policies')
                return
            }

            setOriginalPolicy(policy)

            // Calculate new dates (1 year from original end_date)
            const oldEndDate = new Date(policy.end_date)
            const newStartDate = new Date(oldEndDate)
            newStartDate.setDate(newStartDate.getDate() + 1)
            const newEndDate = new Date(newStartDate)
            newEndDate.setFullYear(newEndDate.getFullYear() + 1)

            setFormData({
                policy_number: "", // Will be generated or input by user
                company: policy.company || "",
                type: policy.type,
                start_date: newStartDate.toISOString().split('T')[0],
                end_date: newEndDate.toISOString().split('T')[0],
                amount: policy.financial_data?.totalPremium?.toString() || policy.amount?.toString() || "",
                agent: policy.agent || "",
                payment_frequency: policy.payment_frequency || "",
                next_payment_date: newStartDate.toISOString().split('T')[0],
            })
            setLoadingData(false)
        }

        loadPolicy()
    }, [params.id])

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No authenticated user")

            const { error } = await supabase.from('policies').insert({
                client_id: originalPolicy.client_id,
                policy_number: formData.policy_number,
                company: formData.company,
                type: formData.type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                amount: parseFloat(formData.amount) || 0,
                payment_frequency: formData.payment_frequency,
                next_payment_date: formData.next_payment_date,
                agent: formData.agent,
                status: 'Activa',
                financial_data: originalPolicy.financial_data, // Copy financial structure
                metadata: {
                    ...originalPolicy.metadata,
                    renewed_from: originalPolicy.id,
                    is_renewal: true
                },
                contract_month: new Date(formData.start_date).toLocaleString('es-ES', { month: 'long' })
            })

            if (error) throw error

            // Optionally update old policy status to "Renovada"
            await supabase
                .from('policies')
                .update({ status: 'Renovada' })
                .eq('id', params.id)

            router.push('/dashboard/policies')
            router.refresh()
        } catch (error) {
            console.error('Error renewing policy:', error)
            alert('Error al renovar la póliza')
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pb-10">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/policies">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <RefreshCw className="h-8 w-8" />
                        Renovar Póliza
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Renovando: {originalPolicy?.policy_number} - {originalPolicy?.clients?.first_name} {originalPolicy?.clients?.last_name}
                    </p>
                </div>
            </div>

            {/* Original Policy Info */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-base">Póliza Original</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">No. Póliza</p>
                            <p className="font-medium">{originalPolicy?.policy_number}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Vigencia Original</p>
                            <p className="font-medium">
                                {new Date(originalPolicy?.start_date).toLocaleDateString()} - {new Date(originalPolicy?.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Prima</p>
                            <p className="font-medium">${originalPolicy?.amount?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Estado</p>
                            <Badge>{originalPolicy?.status}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Nueva Póliza Renovada</CardTitle>
                    <CardDescription>
                        Completa los datos para la renovación. Los datos se precargaron de la póliza original.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="policy-number">Nuevo Número de Póliza *</Label>
                                <Input
                                    id="policy-number"
                                    value={formData.policy_number}
                                    onChange={(e) => handleChange('policy_number', e.target.value)}
                                    placeholder="Ej. 123-456-789"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="company">Aseguradora</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => handleChange('company', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">Nueva Fecha Inicio</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange('start_date', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Nueva Fecha Fin</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => handleChange('end_date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Prima Total</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="payment_frequency">Frecuencia de Pago</Label>
                                <Select value={formData.payment_frequency} onValueChange={(v) => handleChange('payment_frequency', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mensual">Mensual</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                        <SelectItem value="Pago Único">Pago Único</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/policies">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Crear Renovación
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
