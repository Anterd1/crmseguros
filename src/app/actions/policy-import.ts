'use server'

import { createClient } from "@/lib/supabase/server";
import { extractDataFromPdf } from "@/lib/services/extraction/extractor";
import { Client, Policy, ExtractedData } from "@/types/domain";
import { revalidatePath } from "next/cache";

export async function uploadAndExtract(formData: FormData): Promise<{ success: boolean; data?: ExtractedData; error?: string; fileInfo?: { buffer: Buffer; fileName: string; fileType: string } }> {
    try {
        const file = formData.get('file') as File;
        
        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        console.log(`=== PROCESSING FILE ===`);
        console.log(`File name: ${file.name}`);
        console.log(`File type: ${file.type}`);
        console.log(`File size: ${buffer.length} bytes`);
        
        const extractedData = await extractDataFromPdf(buffer, file.type);
        
        console.log(`=== FINAL EXTRACTED DATA ===`);
        console.log(JSON.stringify(extractedData, null, 2));
        console.log(`=== END EXTRACTION ===`);

        return { 
            success: true, 
            data: extractedData,
            fileInfo: {
                buffer,
                fileName: file.name,
                fileType: file.type
            }
        };

    } catch (error) {
        console.error("Extraction error:", error);
        return { success: false, error: "Failed to extract data from file" };
    }
}

export async function savePolicy(data: { client: Client; policy: Policy; pdfFile?: { buffer: Buffer; fileName: string; fileType: string } }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    try {
        // Get the current authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error("User not authenticated");
        }

        // 1. Check if client exists or create new one
        let clientId = data.client.id;

        if (!clientId) {
            // Try to find by RFC if available, or Email
            let query = supabase.from('clients').select('id');
            
            if (data.client.rfc) {
                query = query.eq('rfc', data.client.rfc);
            } else if (data.client.email) {
                query = query.eq('email', data.client.email);
            } else {
                 // Fallback to name match for this demo if no strict identifier
                 query = query.eq('first_name', data.client.first_name).eq('last_name', data.client.last_name || '');
            }

            const { data: existingClient } = await query.single();

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                // Create new client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert({
                        first_name: data.client.first_name,
                        last_name: data.client.last_name || '',
                        email: data.client.email,
                        phone: data.client.phone,
                        rfc: data.client.rfc,
                        client_type: data.client.type,
                        legal_name: data.client.legal_name,
                        address: data.client.address,
                        metadata: data.client.metadata,
                        user_id: user.id
                    })
                    .select('id')
                    .single();

                if (clientError) throw new Error(`Error creating client: ${clientError.message}`);
                clientId = newClient.id;
            }
        }

        // 2. Upload PDF to Supabase Storage (if file provided)
        let pdfUrl = null;
        if (data.pdfFile) {
            const fileName = `${clientId}/${Date.now()}_${data.pdfFile.fileName}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('policy-documents')
                .upload(fileName, data.pdfFile.buffer, {
                    contentType: data.pdfFile.fileType,
                    upsert: false
                });

            if (!uploadError && uploadData) {
                const { data: urlData } = supabase.storage
                    .from('policy-documents')
                    .getPublicUrl(uploadData.path);
                pdfUrl = urlData.publicUrl;
            } else {
                console.warn("PDF upload failed:", uploadError?.message);
                // Continue anyway, just log the warning
            }
        }

        // 3. Create Policy
        const metadata = {
            ...data.policy.metadata,
            ...(pdfUrl && { pdf_url: pdfUrl })
        };

        const { error: policyError } = await supabase
            .from('policies')
            .insert({
                client_id: clientId,
                policy_number: data.policy.policy_number,
                company: data.policy.company,
                type: data.policy.type,
                status: data.policy.status || 'Activa',
                start_date: data.policy.start_date,
                end_date: data.policy.end_date,
                amount: data.policy.financial_data?.totalPremium || 0,
                payment_frequency: data.policy.payment_frequency,
                financial_data: data.policy.financial_data,
                metadata,
                next_payment_date: data.policy.start_date,
                contract_month: new Date(data.policy.start_date).toLocaleString('es-ES', { month: 'long' })
            });

        if (policyError) throw new Error(`Error creating policy: ${policyError.message}`);

        revalidatePath('/dashboard/policies');
        return { success: true };

    } catch (error: any) {
        console.error("Save error:", error);
        return { success: false, error: error.message };
    }
}
