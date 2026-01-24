import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Cron job to update policy statuses automatically
 * Run daily to check for expired policies
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/update-policy-status",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
    try {
        // Verify the request is from Vercel Cron (optional security)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();
        const today = new Date().toISOString().split('T')[0];

        // Update policies that have expired
        const { data: expiredPolicies, error: expiredError } = await supabase
            .from('policies')
            .update({ status: 'Vencida' })
            .eq('status', 'Activa')
            .lt('end_date', today)
            .select('id, policy_number');

        if (expiredError) throw expiredError;

        // Mark policies expiring in 30 days for renewal attention
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const renewalDate = thirtyDaysFromNow.toISOString().split('T')[0];

        const { data: renewalPolicies, error: renewalError } = await supabase
            .from('policies')
            .select('id, policy_number, end_date, clients(email, first_name)')
            .eq('status', 'Activa')
            .gte('end_date', today)
            .lte('end_date', renewalDate);

        if (renewalError) throw renewalError;

        return NextResponse.json({
            success: true,
            expired_count: expiredPolicies?.length || 0,
            renewal_alerts: renewalPolicies?.length || 0,
            message: `Updated ${expiredPolicies?.length || 0} expired policies. ${renewalPolicies?.length || 0} policies need renewal attention.`
        });

    } catch (error: any) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
