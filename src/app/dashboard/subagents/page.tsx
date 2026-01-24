import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function SubagentsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">Subagentes</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Gestión de Subagentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Esta funcionalidad estará disponible próximamente. Aquí podrás administrar tu red de subagentes y comisiones.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
