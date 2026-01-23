import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando panel...
            </div>
        </div>
    )
}
