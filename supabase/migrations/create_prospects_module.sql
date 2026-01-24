-- Create Prospects (Leads/Sales Pipeline) Table
CREATE TABLE IF NOT EXISTS public.prospects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Contact Information
  first_name text NOT NULL,
  last_name text,
  email text,
  phone text NOT NULL,
  rfc text,
  company_name text, -- For Moral persons
  
  -- Sales Pipeline
  status text NOT NULL DEFAULT 'Nuevo', -- 'Nuevo', 'Contactado', 'Cotización', 'Negociación', 'Ganado', 'Perdido'
  stage text NOT NULL DEFAULT 'Contacto inicial',
  source text, -- 'Web', 'Referido', 'Llamada directa', 'Redes sociales', etc.
  priority text DEFAULT 'Media', -- 'Alta', 'Media', 'Baja'
  
  -- Assignment
  assigned_agent text,
  user_id uuid REFERENCES auth.users(id),
  
  -- Interest/Needs
  interested_in text[], -- Array of interested products: ['Autos', 'Vida', 'GMM']
  budget_range text,
  notes text,
  
  -- Tracking
  last_contact_date timestamp with time zone,
  next_followup_date timestamp with time zone,
  expected_close_date date,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Conversion
  converted boolean DEFAULT false,
  converted_at timestamp with time zone,
  client_id uuid REFERENCES public.clients(id),
  
  CONSTRAINT prospects_pkey PRIMARY KEY (id)
);

-- Create Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE CASCADE,
  
  -- Quote Details
  quote_number text NOT NULL UNIQUE,
  product_type text NOT NULL, -- 'Autos', 'Vida', 'GMM', etc.
  company text, -- Aseguradora cotizada
  coverage_amount numeric,
  premium_amount numeric NOT NULL,
  payment_frequency text,
  
  -- Status
  status text NOT NULL DEFAULT 'Enviada', -- 'Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Expirada'
  valid_until date,
  
  -- Additional
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  CONSTRAINT quotations_pkey PRIMARY KEY (id)
);

-- Create Activities/Tasks Table for prospect follow-up
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Relationship
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  
  -- Activity Details
  type text NOT NULL, -- 'Llamada', 'Email', 'Reunión', 'Seguimiento', 'Nota'
  description text NOT NULL,
  due_date timestamp with time zone,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  
  CONSTRAINT activities_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Prospects
CREATE POLICY "Users can see their own prospects" ON public.prospects
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prospects" ON public.prospects
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prospects" ON public.prospects
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prospects" ON public.prospects
  FOR DELETE TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for Quotations
CREATE POLICY "Users can see quotations of their prospects" ON public.quotations
  FOR SELECT TO authenticated 
  USING (
    prospect_id IN (SELECT id FROM public.prospects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert quotations for their prospects" ON public.quotations
  FOR INSERT TO authenticated 
  WITH CHECK (
    prospect_id IN (SELECT id FROM public.prospects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update quotations of their prospects" ON public.quotations
  FOR UPDATE TO authenticated 
  USING (
    prospect_id IN (SELECT id FROM public.prospects WHERE user_id = auth.uid())
  );

-- RLS Policies for Activities
CREATE POLICY "Users can see their own activities" ON public.activities
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" ON public.activities
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.activities
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" ON public.activities
  FOR DELETE TO authenticated 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON public.prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_next_followup ON public.prospects(next_followup_date);
CREATE INDEX IF NOT EXISTS idx_quotations_prospect_id ON public.quotations(prospect_id);
CREATE INDEX IF NOT EXISTS idx_activities_prospect_id ON public.activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_activities_due_date ON public.activities(due_date);
