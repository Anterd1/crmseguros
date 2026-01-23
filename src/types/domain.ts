export interface Address {
    street?: string;
    exteriorNumber?: string;
    interiorNumber?: string;
    neighborhood?: string; // Colonia
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface Client {
    id?: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    rfc?: string;
    legal_name?: string; // Razón Social for Moral persons
    type: "Física" | "Moral";
    address?: Address;
    metadata?: Record<string, any>;
    created_at?: string;
}

export interface FinancialData {
    netPremium: number; // Prima Neta
    taxPercentage: number; // IVA %
    taxAmount: number; // IVA
    financingFee?: number; // Gastos de Financiamiento
    issuanceFee?: number; // Gastos de Expedición
    otherFees?: number; // Otros
    totalPremium: number; // Prima Total
    currency: "MXN" | "USD" | "EUR";
}

export interface Policy {
    id?: string;
    client_id?: string;
    policy_number: string;
    company: string; // Aseguradora (GNP, AXA, etc.)
    type: string; // Ramo (Autos, GMM, Vida, etc.)
    subtype?: string; // Subramo
    status: "Activa" | "Cancelada" | "Vencida" | "Pendiente";
    start_date: string; // ISO Date
    end_date: string; // ISO Date
    payment_frequency: "Mensual" | "Trimestral" | "Semestral" | "Anual" | "Pago Único";
    payment_method?: string; // Forma de pago (Tarjeta, Transferencia)
    contract_date?: string; // Fecha de Emisión/Contrato
    financial_data?: FinancialData;
    agent?: string;
    metadata?: Record<string, any>;
    created_at?: string;
}

export interface ExtractedData {
    client: Partial<Client>;
    policy: Partial<Policy>;
    confidence_score?: number;
    raw_text?: string;
}
