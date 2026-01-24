-- Add columns to policies table
ALTER TABLE public.policies 
ADD COLUMN IF NOT EXISTS agent text,
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS payment_frequency text, -- 'Mensual', 'Trimestral', 'Semestral', 'Anual'
ADD COLUMN IF NOT EXISTS next_payment_date date,
ADD COLUMN IF NOT EXISTS contract_month text;

-- Add columns to clients table
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS client_type text DEFAULT 'Física', -- 'Física', 'Moral'
ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '[]'::jsonb;

-- Create reimbursements table
CREATE TABLE IF NOT EXISTS public.reimbursements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  claim_id uuid NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Rechazado'
  type text NOT NULL, -- 'Reembolso', 'Pago Directo', 'Indemnización'
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text,
  CONSTRAINT reimbursements_pkey PRIMARY KEY (id)
);

-- Enable RLS for reimbursements
ALTER TABLE public.reimbursements ENABLE ROW LEVEL SECURITY;

-- Policies for reimbursements (same as claims for now)
CREATE POLICY "Users can see their own reimbursements" ON public.reimbursements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.id = reimbursements.claim_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own reimbursements" ON public.reimbursements
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.id = reimbursements.claim_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reimbursements" ON public.reimbursements
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.id = reimbursements.claim_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own reimbursements" ON public.reimbursements
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.claims c
      WHERE c.id = reimbursements.claim_id
      AND c.user_id = auth.uid()
    )
  );
