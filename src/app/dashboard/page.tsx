import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, AlertTriangle, TrendingUp, Car, Heart, Building, ArrowRight } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch Counts
    const { count: activePoliciesCount } = await supabase
        .from('policies')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Activa')

    const { count: totalClientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

    // Fetch Recent Policies
    const { data: recentPolicies } = await supabase
        .from('policies')
        .select(`
            *,
            clients (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch Upcoming Expirations (Next 30 days)
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: upcomingExpirations } = await supabase
        .from('policies')
        .select(`
            *,
            clients (first_name, last_name)
        `)
        .gte('end_date', today)
        .lte('end_date', thirtyDaysFromNow)
        .order('end_date', { ascending: true })
        .limit(5)

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* DatePicker or actions could go here */}
                </div>
            </div>

            {/* Summary Cards - Grid on desktop, scroll on mobile */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pólizas Activas
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">{activePoliciesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12% respecto al mes pasado
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Renovaciones (30 días)
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">{upcomingExpirations?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {upcomingExpirations?.length || 0} urgentes para este mes
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clientes Totales
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">{totalClientsCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +4 nuevos esta semana
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Siniestros Activos
                        </CardTitle>
                        <div className="p-2 bg-primary/10 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            No hay siniestros registrados
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Cards - Stack on mobile, side by side on desktop */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Pólizas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Póliza</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Ramo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Prima</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentPolicies?.map((policy: any) => (
                                        <TableRow key={policy.id}>
                                            <TableCell className="font-medium">{policy.policy_number}</TableCell>
                                            <TableCell>{policy.clients?.first_name} {policy.clients?.last_name}</TableCell>
                                            <TableCell>{policy.type}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        policy.status === "Activa"
                                                            ? "default"
                                                            : policy.status === "En Trámite"
                                                                ? "secondary"
                                                                : "outline"
                                                    }
                                                >
                                                    {policy.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">${policy.amount?.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Próximos Vencimientos</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                            Ver todo <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {upcomingExpirations?.map((item: any, i) => {
                                const daysUntil = Math.ceil((new Date(item.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                let daysText = "";
                                let variant: "destructive" | "warning" | "success" | "default" | "secondary" | "outline" | null | undefined = "secondary";
                                let iconBg = "bg-gray-100";
                                let iconColor = "text-gray-500";
                                let Icon = FileText;

                                if (daysUntil <= 0) {
                                    daysText = "Vence hoy";
                                    variant = "destructive";
                                    iconBg = "bg-blue-100 dark:bg-blue-900/20";
                                    iconColor = "text-blue-500";
                                    Icon = Car; // Default icon for now
                                } else if (daysUntil <= 7) {
                                    daysText = `En ${daysUntil} días`;
                                    variant = "warning"; // Custom variant handling needed or use secondary with custom class
                                    iconBg = "bg-rose-100 dark:bg-rose-900/20";
                                    iconColor = "text-rose-500";
                                    Icon = Heart;
                                } else {
                                    daysText = `En ${daysUntil} días`;
                                    variant = "success"; // Custom variant handling needed
                                    iconBg = "bg-emerald-100 dark:bg-emerald-900/20";
                                    iconColor = "text-emerald-500";
                                    Icon = Users;
                                }

                                // Map icons based on type if possible
                                if (item.type === 'Autos') Icon = Car;
                                if (item.type === 'Vida') Icon = Heart;
                                if (item.type === 'GMM Colectivo') Icon = Users;

                                return (
                                    <div key={i} className="flex items-center group p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} mr-4`}>
                                            <Icon className={`h-5 w-5 ${iconColor}`} />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                {item.clients?.first_name} {item.clients?.last_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.type} • {item.end_date}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={variant === "destructive" ? "destructive" : "secondary"}
                                            className={
                                                variant === "warning"
                                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
                                                    : variant === "success"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                                        : ""
                                            }
                                        >
                                            {daysText}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
