import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { paymentId } = await request.json();
        
        if (!paymentId) {
            return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get payment details
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .select('*, policies(policy_number, type, clients(first_name, last_name, email))')
            .eq('id', paymentId)
            .single();

        if (paymentError || !payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Create Stripe payment link
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: `Pago de Póliza ${payment.policies.policy_number}`,
                            description: `${payment.policies.type} - ${new Date(payment.due_date).toLocaleDateString()}`,
                        },
                        unit_amount: Math.round(payment.amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                payment_id: paymentId,
                policy_id: payment.policy_id,
                policy_number: payment.policies.policy_number
            },
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/payments?success=true`,
                },
            },
        });

        // Update payment with Stripe link
        await supabase
            .from('payments')
            .update({ 
                metadata: { 
                    ...payment.metadata, 
                    stripe_payment_link: paymentLink.url 
                } 
            })
            .eq('id', paymentId);

        return NextResponse.json({
            success: true,
            paymentLink: paymentLink.url
        });

    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
