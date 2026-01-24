"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function NewProspectPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company_name: "",
        source: "Web",
        priority: "Media",
        interested_in: [] as string[],
        budget_range: "",
        notes: "",
        next_followup_date: ""
    })

    const handleChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleInterest = (product: string) => {
        setFormData(prev => ({
            ...prev,
            interested_in: prev.interested_in.includes(product)
                ? prev.interested_in.filter(p => p !== product)
                : [...prev.interested_in, product]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No authenticated user")

            const { error } = await supabase.from('prospects').insert({
                ...formData,
                user_id: user.id,
                status: 'Nuevo',
                stage: 'Contacto inicial'
            })

            if (error) throw error

            router.push('/dashboard/sales')
            router.refresh()
        } catch (error) {
            console.error('Error creating prospect:', error)
            alert('Error al crear el prospecto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pb-10">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/sales">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nuevo Prospecto</h2>
                    <p className="text-sm text-muted-foreground">
                        Registra un nuevo lead o prospecto de venta.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Prospecto</CardTitle>
                    <CardDescription>
                        Datos de contacto y necesidades del cliente potencial.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">Nombre(s) *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => handleChange('first_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Apellidos</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => handleChange('last_name', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="source">Fuente del Lead</Label>
                                <Select value={formData.source} onValueChange={(v) => handleChange('source', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Web">Sitio Web</SelectItem>
                                        <SelectItem value="Referido">Referido</SelectItem>
                                        <SelectItem value="Llamada directa">Llamada directa</SelectItem>
                                        <SelectItem value="Redes sociales">Redes Sociales</SelectItem>
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priority">Prioridad</Label>
                                <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Alta">Alta</SelectItem>
                                        <SelectItem value="Media">Media</SelectItem>
                                        <SelectItem value="Baja">Baja</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="next_followup_date">Próximo Seguimiento</Label>
                                <Input
                                    id="next_followup_date"
                                    type="date"
                                    value={formData.next_followup_date}
                                    onChange={(e) => handleChange('next_followup_date', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Productos de Interés</Label>
                            <div className="flex flex-wrap gap-2">
                                {['Autos', 'Vida', 'GMM', 'Hogar', 'RC', 'Daños'].map(product => (
                                    <Button
                                        key={product}
                                        type="button"
                                        variant={formData.interested_in.includes(product) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleInterest(product)}
                                    >
                                        {product}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows={4}
                                placeholder="Detalles de la conversación, necesidades específicas..."
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/sales">Cancelar</Link>
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Prospecto
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
