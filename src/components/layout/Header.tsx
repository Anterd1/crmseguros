"use client"

import { Bell, Search, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./MobileNav"
import { logout } from "@/app/login/actions"

export function Header() {
    return (
        <header className="flex h-20 items-center gap-4 px-6 md:px-10 lg:px-12 bg-transparent">
            <MobileNav />
            <div className="w-full flex-1">
                <form>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for services"
                            className="w-full rounded-full bg-muted/50 pl-10 border-none md:w-[400px] lg:w-[500px] h-10"
                        />
                    </div>
                </form>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10 bg-muted/50 hover:bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
                    <span className="sr-only">Notificaciones</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                <AvatarFallback>JH</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Menú de usuario</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Perfil</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Configuración</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 rounded-lg cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onClick={() => logout()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
