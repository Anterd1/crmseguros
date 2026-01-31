'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProspectStatus(prospectId: string, newStatus: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('prospects')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectId)

    if (error) {
      console.error('Error updating prospect status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/sales')
    return { success: true }
  } catch (error) {
    console.error('Error updating prospect status:', error)
    return { success: false, error: 'Error al actualizar el estado' }
  }
}

export async function convertProspectToClient(prospectId: string) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    // Get prospect data
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single()

    if (prospectError) {
      console.error('Error fetching prospect:', prospectError)
      return { success: false, error: prospectError.message }
    }

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

    if (clientError) {
      console.error('Error creating client:', clientError)
      return { success: false, error: clientError.message }
    }

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

    if (updateError) {
      console.error('Error updating prospect:', updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath('/dashboard/sales')
    revalidatePath('/dashboard/clients')
    return { success: true, clientId: newClient.id }
  } catch (error) {
    console.error('Error converting prospect:', error)
    return { success: false, error: 'Error al convertir el prospecto' }
  }
}
