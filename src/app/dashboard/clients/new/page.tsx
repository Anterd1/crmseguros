import { createClientAction } from "../actions"
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
import { ChevronLeft, User, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function NewClientPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const error = searchParams.error

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
                    <form action={createClientAction} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Nombre(s)</Label>
                                <Input id="firstName" name="firstName" placeholder="Ej. Juan" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Apellidos</Label>
                                <Input id="lastName" name="lastName" placeholder="Ej. Pérez" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" name="email" type="email" placeholder="cliente@email.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono / Celular</Label>
                                <Input id="phone" name="phone" placeholder="55 1234 5678" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tipo de Persona</Label>
                                <Select name="type" defaultValue="Individual">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Individual">Física (Individual)</SelectItem>
                                        <SelectItem value="Empresa">Moral (Empresa)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Removed birthdate and RFC for now as they are not in the basic schema yet or need migration */}
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <Button variant="outline" asChild>
                                <Link href="/dashboard/clients">Cancelar</Link>
                            </Button>
                            <Button type="submit">Guardar Cliente</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
