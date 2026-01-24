"use client"

import { useState, useEffect } from "react"
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
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"

export default function EditPolicyPage() {
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
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
        status: "Activa"
    })

    useEffect(() => {
        async function loadPolicy() {
            const { data: policy, error } = await supabase
                .from('policies')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) {
                alert("Error al cargar la póliza")
                router.push('/dashboard/policies')
                return
            }

            setFormData({
                policy_number: policy.policy_number,
                company: policy.company || "",
                type: policy.type,
                start_date: policy.start_date,
                end_date: policy.end_date,
                amount: policy.financial_data?.totalPremium?.toString() || policy.amount?.toString() || "",
                agent: policy.agent || "",
                payment_frequency: policy.payment_frequency || "",
                next_payment_date: policy.next_payment_date || "",
                status: policy.status
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
            const { error } = await supabase
                .from('policies')
                .update({
                    policy_number: formData.policy_number,
                    company: formData.company,
                    type: formData.type,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    amount: parseFloat(formData.amount) || 0,
                    payment_frequency: formData.payment_frequency,
                    next_payment_date: formData.next_payment_date,
                    agent: formData.agent,
                    status: formData.status
                })
                .eq('id', params.id)

            if (error) throw error

            router.push('/dashboard/policies')
            router.refresh()
        } catch (error) {
            console.error('Error updating policy:', error)
            alert('Error al actualizar la póliza')
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
                <h2 className="text-3xl font-bold tracking-tight">Editar Póliza</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Póliza</CardTitle>
                    <CardDescription>
                        Modifica la información de la póliza.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="policy-number">Número de Póliza</Label>
                                <Input
                                    id="policy-number"
                                    value={formData.policy_number}
                                    onChange={(e) => handleChange('policy_number', e.target.value)}
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Ramo</Label>
                                <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Autos">Autos</SelectItem>
                                        <SelectItem value="GMM">Gastos Médicos Mayores</SelectItem>
                                        <SelectItem value="Vida">Vida</SelectItem>
                                        <SelectItem value="Hogar">Hogar</SelectItem>
                                        <SelectItem value="RC">Responsabilidad Civil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Prima Total</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Activa">Activa</SelectItem>
                                        <SelectItem value="Vencida">Vencida</SelectItem>
                                        <SelectItem value="Cancelada">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">Inicio de Vigencia</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange('start_date', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Fin de Vigencia</Label>
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
                            <div className="grid gap-2">
                                <Label htmlFor="agent">Agente</Label>
                                <Input
                                    id="agent"
                                    value={formData.agent}
                                    onChange={(e) => handleChange('agent', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/policies">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
