-- Add new fields to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS rfc text,
ADD COLUMN IF NOT EXISTS legal_name text,
ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add new fields to policies table
ALTER TABLE public.policies 
ADD COLUMN IF NOT EXISTS financial_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
