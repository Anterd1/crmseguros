'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ReimbursementData {
  amount: number
  type: string
  date: string
  description: string
}

export async function createReimbursement(claimId: string, data: ReimbursementData) {
  try {
    const supabase = await createClient()
    
    const { data: result, error } = await supabase
      .from('reimbursements')
      .insert({
        claim_id: claimId,
        amount: data.amount,
        type: data.type,
        date: data.date,
        description: data.description,
        status: 'Pendiente'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating reimbursement:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/claims')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating reimbursement:', error)
    return { success: false, error: 'Error al crear el reembolso' }
  }
}

export async function getClaimReimbursements(claimId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('reimbursements')
      .select('*')
      .eq('claim_id', claimId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reimbursements:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching reimbursements:', error)
    return { success: false, error: 'Error al obtener los reembolsos' }
  }
}
