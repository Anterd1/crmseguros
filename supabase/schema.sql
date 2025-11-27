-- Create Clients Table
create table public.clients (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text null,
  phone text null,
  type text not null default 'Individual'::text,
  constraint clients_pkey primary key (id)
);

-- Create Policies Table
create table public.policies (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  client_id uuid not null,
  policy_number text not null,
  type text not null,
  status text not null default 'Activa'::text,
  start_date date not null,
  end_date date not null,
  amount numeric not null default 0,
  constraint policies_pkey primary key (id),
  constraint policies_client_id_fkey foreign key (client_id) references clients (id) on delete cascade
);

-- Enable Row Level Security (RLS)
alter table public.clients enable row level security;
alter table public.policies enable row level security;

-- Create policies to allow authenticated users to read/write (Simple policy for now)
create policy "Enable read access for authenticated users" on public.clients
  for select to authenticated using (true);

create policy "Enable insert access for authenticated users" on public.clients
  for insert to authenticated with check (true);

create policy "Enable read access for authenticated users" on public.policies
  for select to authenticated using (true);

create policy "Enable insert access for authenticated users" on public.policies
  for insert to authenticated with check (true);
