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
import { Textarea } from "@/components/ui/textarea" // I might need to install textarea if not present, but I'll use Input for now or install it.
import { ChevronLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function NewPolicyPage() {
    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/policies">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Nueva Póliza</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Póliza</CardTitle>
                    <CardDescription>
                        Ingresa la información de la nueva póliza para registrarla en el sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="client">Cliente</Label>
                                <Input id="client" placeholder="Buscar o ingresar nombre del cliente" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="policy-number">Número de Póliza</Label>
                                <Input id="policy-number" placeholder="Ej. 123-456-789" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="insurer">Aseguradora</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar aseguradora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gnp">GNP</SelectItem>
                                        <SelectItem value="axa">AXA</SelectItem>
                                        <SelectItem value="metlife">MetLife</SelectItem>
                                        <SelectItem value="mapfre">Mapfre</SelectItem>
                                        <SelectItem value="qualitas">Qualitas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Ramo / Tipo</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar ramo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="autos">Autos</SelectItem>
                                        <SelectItem value="gmm">Gastos Médicos Mayores</SelectItem>
                                        <SelectItem value="vida">Vida</SelectItem>
                                        <SelectItem value="hogar">Hogar</SelectItem>
                                        <SelectItem value="rc">Responsabilidad Civil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="start-date">Inicio de Vigencia</Label>
                                <Input id="start-date" type="date" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Fin de Vigencia</Label>
                                <Input id="end-date" type="date" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="files">Documentos (PDF)</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">
                                    Arrastra archivos aquí o haz clic para subir
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Carátula de póliza, recibos, condiciones generales
                                </p>
                                <Input id="files" type="file" className="hidden" multiple />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notas Adicionales</Label>
                            <Input id="notes" placeholder="Observaciones importantes..." />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/policies">Cancelar</Link>
                            </Button>
                            <Button type="submit">Guardar Póliza</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
