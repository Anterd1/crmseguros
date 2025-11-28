"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pólizas",
    href: "/dashboard/policies",
    icon: FileText,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Cobranza",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Siniestros",
    href: "/dashboard/claims",
    icon: AlertTriangle,
  },
  {
    title: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden bg-card text-card-foreground lg:flex fixed inset-y-4 left-4 z-50 h-[calc(100vh-2rem)] w-64 flex-col rounded-3xl shadow-xl border">
      <div className="flex h-20 items-center px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <Shield className="h-8 w-8" />
          <span>GCP Seguros</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-6 gap-2 text-sm font-medium">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-full px-4 py-3 transition-all hover:text-primary",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <nav className="grid gap-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-4 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary"
          >
            <Settings className="h-5 w-5" />
            Configuración
          </Link>
          <Button variant="ghost" className="justify-start gap-4 px-4 py-6 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Button>
        </nav>
      </div>
    </div>
  )
}
