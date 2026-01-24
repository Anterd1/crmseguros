import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Generate commissions for policies without commission records
 * Run daily to catch new policies
 */
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();

        // Get policies without commission records
        const { data: policies, error: policiesError } = await supabase
            .from('policies')
            .select('*, clients(user_id)')
            .eq('status', 'Activa');

        if (policiesError) throw policiesError;

        // Get commission rules
        const { data: rules, error: rulesError } = await supabase
            .from('commission_rules')
            .select('*')
            .eq('is_active', true);

        if (rulesError) throw rulesError;

        const commissionsToCreate = [];

        for (const policy of policies || []) {
            // Check if commission already exists
            const { data: existing } = await supabase
                .from('commissions')
                .select('id')
                .eq('policy_id', policy.id)
                .single();

            if (existing) continue;

            // Find applicable commission rule
            const rule = rules?.find(r => 
                r.policy_type === policy.type && 
                (r.company === null || r.company === policy.company)
            ) || rules?.find(r => r.policy_type === policy.type);

            if (!rule) continue; // Skip if no rule found

            const baseAmount = policy.financial_data?.totalPremium || policy.amount || 0;
            const commissionAmount = (baseAmount * rule.percentage) / 100;

            commissionsToCreate.push({
                policy_id: policy.id,
                agent_name: policy.agent || 'Sin asignar',
                user_id: policy.clients?.user_id,
                base_amount: baseAmount,
                commission_percentage: rule.percentage,
                commission_amount: Math.round(commissionAmount * 100) / 100,
                status: 'Pendiente'
            });
        }

        if (commissionsToCreate.length > 0) {
            const { error: insertError } = await supabase
                .from('commissions')
                .insert(commissionsToCreate);

            if (insertError) throw insertError;
        }

        return NextResponse.json({
            success: true,
            commissions_created: commissionsToCreate.length,
            message: `Generated ${commissionsToCreate.length} commission records`
        });

    } catch (error: any) {
        console.error('Commission generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
