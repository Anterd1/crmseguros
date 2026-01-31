'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface DocumentUploadData {
  clientId?: string
  policyId?: string
  claimId?: string
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  storagePath: string
  documentType: string
  description?: string
}

export async function uploadDocument(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const file = formData.get('file') as File
    const clientId = formData.get('client_id') as string | null
    const policyId = formData.get('policy_id') as string | null
    const claimId = formData.get('claim_id') as string | null
    const documentType = formData.get('document_type') as string
    const description = formData.get('description') as string | null

    if (!file) {
      return { success: false, error: 'No se proporcionó archivo' }
    }

    // Upload file to storage
    const filePath = `${user.id}/${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('policy-documents')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('policy-documents')
      .getPublicUrl(filePath)

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        client_id: clientId,
        policy_id: policyId,
        claim_id: claimId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        storage_path: filePath,
        document_type: documentType,
        description,
        uploaded_by: user.id
      })
      .select()
      .single()

    if (docError) {
      console.error('Error creating document record:', docError)
      // Try to delete uploaded file
      await supabase.storage.from('policy-documents').remove([filePath])
      return { success: false, error: docError.message }
    }

    revalidatePath('/dashboard/documents')
    return { success: true, data: document }
  } catch (error) {
    console.error('Error uploading document:', error)
    return { success: false, error: 'Error al subir el documento' }
  }
}

export async function deleteDocument(documentId: string, storagePath: string) {
  try {
    const supabase = await createClient()
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('policy-documents')
      .remove([storagePath])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
    }

    // Delete document record
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (dbError) {
      console.error('Error deleting document record:', dbError)
      return { success: false, error: dbError.message }
    }

    revalidatePath('/dashboard/documents')
    return { success: true }
  } catch (error) {
    console.error('Error deleting document:', error)
    return { success: false, error: 'Error al eliminar el documento' }
  }
}
