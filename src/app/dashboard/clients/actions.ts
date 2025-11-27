'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createClientAction(formData: FormData) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return redirect('/login?error=Debes iniciar sesión para crear un cliente')
    }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const type = formData.get('type') as string

    if (!firstName || !lastName) {
        // In a real app we would return validation errors to the form
        // For now we redirect with error
        return redirect('/dashboard/clients/new?error=El nombre y apellido son obligatorios')
    }

    const { error } = await supabase.from('clients').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        type,
        user_id: user.id
    })

    if (error) {
        return redirect(`/dashboard/clients/new?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients?message=Cliente creado exitosamente')
}
