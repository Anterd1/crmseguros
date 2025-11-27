"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Upload, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function NewClaimPage() {
    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/claims">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-8 w-8" />
                    Reportar Siniestro
                </h2>
            </div>

            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle>Detalles del Incidente</CardTitle>
                    <CardDescription>
                        Registra la información inicial del siniestro para comenzar el trámite.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="policy">Póliza Afectada</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Buscar póliza o cliente..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pol1">GNP-88291 - Constructora del Norte (Daños)</SelectItem>
                                    <SelectItem value="pol2">AXA-11202 - Roberto Gómez (GMM)</SelectItem>
                                    <SelectItem value="pol3">MET-99123 - Pedro Infante (Vida)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Fecha del Siniestro</Label>
                                <Input id="date" type="datetime-local" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo de Siniestro</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="choque">Choque / Colisión</SelectItem>
                                        <SelectItem value="robo">Robo</SelectItem>
                                        <SelectItem value="enfermedad">Enfermedad / Accidente</SelectItem>
                                        <SelectItem value="fallecimiento">Fallecimiento</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción de los Hechos</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe detalladamente qué sucedió..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="evidence">Evidencia / Documentos</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">
                                    Subir fotos, reporte policial o facturas
                                </p>
                                <Input id="evidence" type="file" className="hidden" multiple />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/claims">Cancelar</Link>
                            </Button>
                            <Button type="submit" variant="destructive">Registrar Siniestro</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
