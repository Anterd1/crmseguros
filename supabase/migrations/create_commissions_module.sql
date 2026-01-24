-- Create Commissions Table
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Relationship
  policy_id uuid NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  agent_name text NOT NULL, -- Name of the agent (from policy.agent)
  user_id uuid REFERENCES auth.users(id),
  
  -- Commission Details
  base_amount numeric NOT NULL, -- Policy premium amount
  commission_percentage numeric NOT NULL DEFAULT 10, -- Percentage (e.g., 10 = 10%)
  commission_amount numeric NOT NULL, -- Calculated commission
  
  -- Status
  status text NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Pagada', 'Cancelada'
  paid_date timestamp with time zone,
  payment_method text,
  
  -- Metadata
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  CONSTRAINT commissions_pkey PRIMARY KEY (id)
);

-- Create Commission Rules Table (for different commission structures)
CREATE TABLE IF NOT EXISTS public.commission_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  policy_type text NOT NULL, -- 'Autos', 'Vida', 'GMM', etc.
  company text, -- Null means applies to all companies
  percentage numeric NOT NULL, -- Commission percentage for this type/company
  
  is_active boolean DEFAULT true,
  
  CONSTRAINT commission_rules_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Commissions
CREATE POLICY "Users can see their own commissions" ON public.commissions
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert commissions for their policies" ON public.commissions
  FOR INSERT TO authenticated 
  WITH CHECK (
    policy_id IN (
      SELECT p.id FROM public.policies p
      JOIN public.clients c ON p.client_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Commission Rules (read-only for agents, writable by admin later)
CREATE POLICY "Users can see commission rules" ON public.commission_rules
  FOR SELECT TO authenticated 
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_commissions_policy_id ON public.commissions(policy_id);
CREATE INDEX IF NOT EXISTS idx_commissions_user_id ON public.commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_commission_rules_type ON public.commission_rules(policy_type);

-- Insert default commission rules
INSERT INTO public.commission_rules (policy_type, percentage) VALUES
  ('Autos', 15),
  ('Vida', 20),
  ('GMM', 12),
  ('Hogar', 10),
  ('RC', 10),
  ('Daños', 12)
ON CONFLICT DO NOTHING;
