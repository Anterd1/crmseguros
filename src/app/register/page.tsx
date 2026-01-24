"use client"

import { useState } from "react"
import { signup } from '../login/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertCircle, Mail, Lock, Loader2, User, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [isLoading, setIsLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })

    function validatePassword(password: string): boolean {
        if (password.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres")
            return false
        }
        setPasswordError("")
        return true
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Las contraseñas no coinciden")
            return
        }

        // Validate password strength
        if (!validatePassword(formData.password)) {
            return
        }

        setIsLoading(true)

        const form = new FormData(e.currentTarget)
        try {
            await signup(form)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8">
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
                            Crear Cuenta
                        </CardTitle>
                        <CardDescription className="text-base">
                            Regístrate para acceder al CRM de GCP Seguros
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5 px-6">
                            {error && (
                                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error de Registro</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {passwordError && (
                                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error de Validación</AlertTitle>
                                    <AlertDescription>
                                        {passwordError}
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Mínimo 8 caracteres"
                                        className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                        required
                                        disabled={isLoading}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value })
                                            if (e.target.value.length >= 8) {
                                                setPasswordError("")
                                            }
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    La contraseña debe tener al menos 8 caracteres
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirmar Contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Repite tu contraseña"
                                        className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                        required
                                        disabled={isLoading}
                                        value={formData.confirmPassword}
                                        onChange={(e) => {
                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                            if (e.target.value === formData.password) {
                                                setPasswordError("")
                                            }
                                        }}
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
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Crear Cuenta
                                    </>
                                )}
                            </Button>

                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                                        ¿Ya tienes cuenta?
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full h-11 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                            >
                                <Link href="/login">
                                    Iniciar Sesión
                                </Link>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Al registrarte, aceptas los términos y condiciones de uso
                </p>
            </div>
        </div>
    )
}
