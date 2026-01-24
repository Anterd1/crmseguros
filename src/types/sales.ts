export type ProspectStatus = 'Nuevo' | 'Contactado' | 'Cotización' | 'Negociación' | 'Ganado' | 'Perdido';
export type ProspectPriority = 'Alta' | 'Media' | 'Baja';
export type LeadSource = 'Web' | 'Referido' | 'Llamada directa' | 'Redes sociales' | 'Email' | 'Otro';
export type ActivityType = 'Llamada' | 'Email' | 'Reunión' | 'Seguimiento' | 'Nota';

export interface Prospect {
    id?: string;
    created_at?: string;
    updated_at?: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone: string;
    rfc?: string;
    company_name?: string;
    status: ProspectStatus;
    stage: string;
    source?: LeadSource;
    priority: ProspectPriority;
    assigned_agent?: string;
    user_id?: string;
    interested_in?: string[];
    budget_range?: string;
    notes?: string;
    last_contact_date?: string;
    next_followup_date?: string;
    expected_close_date?: string;
    metadata?: Record<string, any>;
    converted: boolean;
    converted_at?: string;
    client_id?: string;
}

export interface Quotation {
    id?: string;
    created_at?: string;
    prospect_id: string;
    quote_number: string;
    product_type: string;
    company?: string;
    coverage_amount?: number;
    premium_amount: number;
    payment_frequency?: string;
    status: 'Borrador' | 'Enviada' | 'Aceptada' | 'Rechazada' | 'Expirada';
    valid_until?: string;
    notes?: string;
    metadata?: Record<string, any>;
}

export interface Activity {
    id?: string;
    created_at?: string;
    prospect_id: string;
    user_id?: string;
    type: ActivityType;
    description: string;
    due_date?: string;
    completed: boolean;
    completed_at?: string;
}
