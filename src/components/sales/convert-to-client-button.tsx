"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus } from "lucide-react"
import { convertProspectToClient } from "@/app/dashboard/sales/actions"

export function ConvertToClientButton({ prospectId }: { prospectId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleConvert = async () => {
        if (!confirm("¿Convertir este prospecto en cliente? Esto creará un registro de cliente permanente.")) {
            return
        }

        setLoading(true)

        try {
            const result = await convertProspectToClient(prospectId)

            if (!result.success) {
                alert(result.error || 'Error al convertir el prospecto')
                return
            }

            router.push(`/dashboard/clients/${result.clientId}`)
            router.refresh()

        } catch (error) {
            console.error('Error converting prospect:', error)
            alert('Error al convertir el prospecto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button onClick={handleConvert} disabled={loading}>
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Convirtiendo...
                </>
            ) : (
                <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Convertir a Cliente
                </>
            )}
        </Button>
    )
}
