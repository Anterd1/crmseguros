-- Create Documents Table for organized file management
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Relationships (polymorphic - can belong to client, policy, or claim)
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  policy_id uuid REFERENCES public.policies(id) ON DELETE CASCADE,
  claim_id uuid REFERENCES public.claims(id) ON DELETE CASCADE,
  
  -- Document Details
  file_name text NOT NULL,
  file_type text NOT NULL, -- MIME type
  file_size bigint, -- in bytes
  file_url text NOT NULL, -- Supabase Storage URL
  storage_path text NOT NULL, -- Path in storage bucket
  
  -- Classification
  document_type text NOT NULL, -- 'Identificación', 'Comprobante', 'Póliza', 'Factura', 'Otro'
  category text, -- Additional categorization
  
  -- Metadata
  description text,
  uploaded_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  
  CONSTRAINT documents_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Documents
CREATE POLICY "Users can see documents of their entities" ON public.documents
  FOR SELECT TO authenticated 
  USING (
    (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())) OR
    (policy_id IN (SELECT p.id FROM public.policies p JOIN public.clients c ON p.client_id = c.id WHERE c.user_id = auth.uid())) OR
    (claim_id IN (SELECT id FROM public.claims WHERE user_id = auth.uid())) OR
    (uploaded_by = auth.uid())
  );

CREATE POLICY "Users can insert documents for their entities" ON public.documents
  FOR INSERT TO authenticated 
  WITH CHECK (
    (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())) OR
    (policy_id IN (SELECT p.id FROM public.policies p JOIN public.clients c ON p.client_id = c.id WHERE c.user_id = auth.uid())) OR
    (claim_id IN (SELECT id FROM public.claims WHERE user_id = auth.uid()))
  );

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE TO authenticated 
  USING (uploaded_by = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON public.documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_policy_id ON public.documents(policy_id);
CREATE INDEX IF NOT EXISTS idx_documents_claim_id ON public.documents(claim_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
