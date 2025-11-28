"use client"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Shield, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { sidebarItems } from "./Sidebar"
import { useState } from "react"

export function MobileNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle asChild>
                            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary" onClick={() => setOpen(false)}>
                                <Shield className="h-6 w-6" />
                                <span>GCP Seguros</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-auto py-6">
                        <nav className="grid items-start px-6 gap-2 text-sm font-medium">
                            {sidebarItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
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
                    <div className="p-6 border-t">
                        <nav className="grid gap-2">
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setOpen(false)}
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
            </SheetContent>
        </Sheet>
    )
}
