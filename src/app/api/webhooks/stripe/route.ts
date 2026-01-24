import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Missing STRIPE_WEBHOOK_SECRET');
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );

        const supabase = await createClient();

        // Handle payment success
        if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
            const session = event.data.object as any;
            const paymentId = session.metadata?.payment_id;

            if (paymentId) {
                // Update payment status
                await supabase
                    .from('payments')
                    .update({
                        status: 'Pagado',
                        payment_method: 'Tarjeta (Stripe)',
                        metadata: {
                            stripe_payment_id: session.id,
                            stripe_customer: session.customer
                        }
                    })
                    .eq('id', paymentId);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
