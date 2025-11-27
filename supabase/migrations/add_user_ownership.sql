-- 1. Add user_id column to clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Enable RLS (just to be safe, though it was already enabled)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- 3. Drop old "permissive" policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.clients;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.policies;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.policies;

-- 4. Create new "restrictive" policies for Clients
CREATE POLICY "Users can only see their own clients" ON public.clients
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON public.clients
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE TO authenticated 
  USING (auth.uid() = user_id);

-- 5. Create new "restrictive" policies for Policies (inherited from Client)
CREATE POLICY "Users can see policies of their clients" ON public.policies
  FOR SELECT TO authenticated 
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert policies for their clients" ON public.policies
  FOR INSERT TO authenticated 
  WITH CHECK (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update policies of their clients" ON public.policies
  FOR UPDATE TO authenticated 
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete policies of their clients" ON public.policies
  FOR DELETE TO authenticated 
  USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );
