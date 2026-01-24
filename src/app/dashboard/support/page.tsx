import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LifeBuoy } from "lucide-react"

export default function SupportPage() {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">Soporte</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LifeBuoy className="h-5 w-5" />
                        Centro de Ayuda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        ¿Necesitas ayuda? Contacta al administrador del sistema o consulta la documentación.
                    </p>
                    <div className="mt-4">
                        <p className="font-medium">Contacto:</p>
                        <p className="text-sm text-muted-foreground">soporte@gcpseguros.com</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
