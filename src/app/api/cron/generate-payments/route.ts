import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Cron job to generate recurring payment records
 * Run monthly to create payment records for active policies
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/generate-payments",
 *     "schedule": "0 2 1 * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();
        const today = new Date();
        const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM

        // Get all active policies
        const { data: activePolicies, error: policiesError } = await supabase
            .from('policies')
            .select('*, clients(first_name, last_name, email)')
            .eq('status', 'Activa');

        if (policiesError) throw policiesError;

        const paymentsToCreate = [];

        for (const policy of activePolicies || []) {
            // Check if payment already exists for this month
            const { data: existingPayment } = await supabase
                .from('payments')
                .select('id')
                .eq('policy_id', policy.id)
                .gte('due_date', `${currentMonth}-01`)
                .lt('due_date', `${currentMonth}-31`)
                .single();

            if (existingPayment) continue; // Payment already exists

            // Calculate due date based on payment frequency
            let dueDate = policy.next_payment_date || policy.start_date;
            
            // Determine amount based on frequency
            let amount = policy.financial_data?.totalPremium || policy.amount || 0;
            
            if (policy.payment_frequency === 'Mensual') {
                amount = amount / 12;
            } else if (policy.payment_frequency === 'Trimestral') {
                amount = amount / 4;
            } else if (policy.payment_frequency === 'Semestral') {
                amount = amount / 2;
            }

            paymentsToCreate.push({
                policy_id: policy.id,
                amount: Math.round(amount * 100) / 100, // Round to 2 decimals
                due_date: dueDate,
                status: 'Pendiente',
                payment_method: null
            });
        }

        // Bulk insert payments
        if (paymentsToCreate.length > 0) {
            const { error: insertError } = await supabase
                .from('payments')
                .insert(paymentsToCreate);

            if (insertError) throw insertError;
        }

        return NextResponse.json({
            success: true,
            payments_created: paymentsToCreate.length,
            message: `Generated ${paymentsToCreate.length} payment records for ${currentMonth}`
        });

    } catch (error: any) {
        console.error('Payment generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
