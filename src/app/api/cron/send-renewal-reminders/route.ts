import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendPolicyRenewalReminder } from "@/lib/services/notifications/email";

/**
 * Send email reminders for policies expiring in 30 days
 * Run daily at 9 AM
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
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        // Get policies expiring in 30 days
        const { data: expiringPolicies, error } = await supabase
            .from('policies')
            .select('*, clients(first_name, last_name, email)')
            .eq('status', 'Activa')
            .gte('end_date', today.toISOString().split('T')[0])
            .lte('end_date', thirtyDaysFromNow.toISOString().split('T')[0]);

        if (error) throw error;

        let sentCount = 0;
        for (const policy of expiringPolicies || []) {
            if (!policy.clients?.email) continue;

            const result = await sendPolicyRenewalReminder({
                clientEmail: policy.clients.email,
                clientName: `${policy.clients.first_name} ${policy.clients.last_name}`,
                policyNumber: policy.policy_number,
                expirationDate: policy.end_date,
                agentName: policy.agent
            });

            if (result.success) sentCount++;
        }

        return NextResponse.json({
            success: true,
            policies_checked: expiringPolicies?.length || 0,
            emails_sent: sentCount
        });

    } catch (error: any) {
        console.error('Renewal reminders error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
