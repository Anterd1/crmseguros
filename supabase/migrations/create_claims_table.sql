-- Create Claims Table
create table public.claims (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id),
  policy_id uuid null references public.policies(id), -- Optional link to policy
  claim_number text not null,
  description text null,
  status text not null default 'Abierto'::text, -- 'Abierto', 'En Proceso', 'Cerrado', 'Valuación'
  incident_date date not null default CURRENT_DATE,
  type text not null, -- 'Choque', 'Robo', 'Cristales', etc.
  constraint claims_pkey primary key (id)
);

-- Enable RLS
alter table public.claims enable row level security;

-- Create Policies
create policy "Users can see their own claims" on public.claims
  for select to authenticated 
  using (auth.uid() = user_id);

create policy "Users can insert their own claims" on public.claims
  for insert to authenticated 
  with check (auth.uid() = user_id);

create policy "Users can update their own claims" on public.claims
  for update to authenticated 
  using (auth.uid() = user_id);

create policy "Users can delete their own claims" on public.claims
  for delete to authenticated 
  using (auth.uid() = user_id);
