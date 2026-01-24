"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus } from "lucide-react"

export function ConvertToClientButton({ prospectId }: { prospectId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleConvert = async () => {
        if (!confirm("¿Convertir este prospecto en cliente? Esto creará un registro de cliente permanente.")) {
            return
        }

        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No authenticated user")

            // Get prospect data
            const { data: prospect, error: prospectError } = await supabase
                .from('prospects')
                .select('*')
                .eq('id', prospectId)
                .single()

            if (prospectError) throw prospectError

            // Create client from prospect
            const { data: newClient, error: clientError } = await supabase
                .from('clients')
                .insert({
                    first_name: prospect.first_name,
                    last_name: prospect.last_name || '',
                    email: prospect.email,
                    phone: prospect.phone,
                    rfc: prospect.rfc,
                    client_type: prospect.company_name ? 'Moral' : 'Física',
                    legal_name: prospect.company_name,
                    user_id: user.id
                })
                .select('id')
                .single()

            if (clientError) throw clientError

            // Update prospect as converted
            const { error: updateError } = await supabase
                .from('prospects')
                .update({
                    converted: true,
                    converted_at: new Date().toISOString(),
                    client_id: newClient.id,
                    status: 'Ganado'
                })
                .eq('id', prospectId)

            if (updateError) throw updateError

            router.push(`/dashboard/clients/${newClient.id}`)
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
