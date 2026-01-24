import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPolicyRenewalReminder(data: {
    clientEmail: string;
    clientName: string;
    policyNumber: string;
    expirationDate: string;
    agentName?: string;
}) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'GCP Seguros <no-reply@gcp-seguros.com>', // Replace with your domain
            to: data.clientEmail,
            subject: `Renovación de Póliza ${data.policyNumber} - GCP Seguros`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Recordatorio de Renovación</h2>
                    <p>Estimado/a ${data.clientName},</p>
                    <p>Su póliza <strong>${data.policyNumber}</strong> vencerá el <strong>${new Date(data.expirationDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>
                    <p>Le recordamos contactar con su agente para procesar la renovación y mantener su cobertura sin interrupciones.</p>
                    ${data.agentName ? `<p>Su agente asignado: <strong>${data.agentName}</strong></p>` : ''}
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"/>
                    <p style="color: #6b7280; font-size: 14px;">
                        GCP Seguros - Protegiendo lo que más importa<br/>
                        Este es un correo automático, por favor no responda a este mensaje.
                    </p>
                </div>
            `
        });

        if (error) throw error;
        return { success: true, data: emailData };

    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}

export async function sendPaymentReminder(data: {
    clientEmail: string;
    clientName: string;
    policyNumber: string;
    amount: number;
    dueDate: string;
}) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'GCP Seguros <no-reply@gcp-seguros.com>',
            to: data.clientEmail,
            subject: `Recordatorio de Pago - Póliza ${data.policyNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Recordatorio de Pago Próximo</h2>
                    <p>Estimado/a ${data.clientName},</p>
                    <p>Le recordamos que tiene un pago pendiente para su póliza <strong>${data.policyNumber}</strong>.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Monto:</strong> $${data.amount.toLocaleString('es-MX')} MXN</p>
                        <p style="margin: 10px 0 0;"><strong>Fecha de vencimiento:</strong> ${new Date(data.dueDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p>Para mantener su cobertura activa, por favor realice su pago a tiempo.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"/>
                    <p style="color: #6b7280; font-size: 14px;">
                        GCP Seguros - Protegiendo lo que más importa<br/>
                        Este es un correo automático, por favor no responda a este mensaje.
                    </p>
                </div>
            `
        });

        if (error) throw error;
        return { success: true, data: emailData };

    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}

export async function sendQuotationEmail(data: {
    clientEmail: string;
    clientName: string;
    quoteNumber: string;
    productType: string;
    premium: number;
    agentName?: string;
}) {
    try {
        const { data: emailData, error } = await resend.emails.send({
            from: 'GCP Seguros <no-reply@gcp-seguros.com>',
            to: data.clientEmail,
            subject: `Cotización ${data.quoteNumber} - ${data.productType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Su Cotización de Seguro</h2>
                    <p>Estimado/a ${data.clientName},</p>
                    <p>Gracias por su interés en nuestros servicios. Le presentamos su cotización:</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Producto:</strong> ${data.productType}</p>
                        <p style="margin: 10px 0 0;"><strong>Prima Estimada:</strong> $${data.premium.toLocaleString('es-MX')} MXN</p>
                        <p style="margin: 10px 0 0;"><strong>No. Cotización:</strong> ${data.quoteNumber}</p>
                    </div>
                    ${data.agentName ? `<p>Su agente: <strong>${data.agentName}</strong></p>` : ''}
                    <p>Esta cotización es válida por 30 días. Contáctenos para proceder con la contratación.</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"/>
                    <p style="color: #6b7280; font-size: 14px;">
                        GCP Seguros - Protegiendo lo que más importa
                    </p>
                </div>
            `
        });

        if (error) throw error;
        return { success: true, data: emailData };

    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}
