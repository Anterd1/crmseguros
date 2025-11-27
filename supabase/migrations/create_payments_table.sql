-- Create Payments Table
create table public.payments (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id),
  policy_id uuid null references public.policies(id),
  amount numeric not null default 0,
  due_date date not null,
  status text not null default 'Pendiente'::text, -- 'Pendiente', 'Pagado', 'Atrasado'
  concept text not null, -- 'Renovación', 'Mensualidad 1/12', etc.
  constraint payments_pkey primary key (id)
);

-- Enable RLS
alter table public.payments enable row level security;

-- Create Policies
create policy "Users can see their own payments" on public.payments
  for select to authenticated 
  using (auth.uid() = user_id);

create policy "Users can insert their own payments" on public.payments
  for insert to authenticated 
  with check (auth.uid() = user_id);

create policy "Users can update their own payments" on public.payments
  for update to authenticated 
  using (auth.uid() = user_id);

create policy "Users can delete their own payments" on public.payments
  for delete to authenticated 
  using (auth.uid() = user_id);
