"use client"

import { useState } from "react"
import { login } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertCircle, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await login(formData)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg dark:bg-slate-900/90 dark:text-slate-100">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Iniciando sesión...
                    </div>
                </div>
            )}
            <div className="w-full max-w-md">
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <div className="flex justify-center mb-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                                <div className="relative rounded-full bg-gradient-to-br from-primary to-primary/80 p-4 shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            GCP Seguros
                        </CardTitle>
                        <CardDescription className="text-base">
                            Ingresa tus credenciales para acceder al CRM
                        </CardDescription>
                    </CardHeader>
                    <form action={handleSubmit}>
                        <CardContent className="space-y-5 px-6">
                            {error && (
                                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error de Acceso</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {message && (
                                <Alert className="border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle>¡Éxito!</AlertTitle>
                                    <AlertDescription>
                                        {message}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Correo Electrónico
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="nombre@ejemplo.com"
                                        className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Contraseña
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 px-6 pb-6 pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Iniciando...
                                    </>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </Button>

                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                                        ¿No tienes cuenta?
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full h-11 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                            >
                                <Link href="/register">
                                    Crear Cuenta Nueva
                                </Link>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Acceso exclusivo para personal autorizado de GCP.
                </p>
            </div>
        </div>
    )
}
