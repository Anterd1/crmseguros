import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">
                    Ajustes generales del sistema.
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Perfil de Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nombre del Despacho</Label>
                        <Input defaultValue="GCP Seguros" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Correo de Notificaciones</Label>
                        <Input defaultValue="admin@gcp.com" />
                    </div>
                    <Button>Guardar Cambios</Button>
                </CardContent>
            </Card>
        </div>
    )
}
