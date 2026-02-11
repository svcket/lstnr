-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES & ENUMS
create type issuer_type as enum ('ARTIST', 'LABEL', 'MANAGEMENT');
create type issuer_request_status as enum ('PENDING', 'APPROVED', 'REJECTED');

-- PROFILES (Public Identity)
-- Automatically created via trigger on auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  avatar_url text,
  is_verified_issuer boolean default false,
  created_at timestamptz default now()
);

-- ISSUER REQUESTS (Audit Trail for Verification)
create table public.issuer_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  issuer_type issuer_type not null,
  legal_name text not null,
  proof_urls jsonb default '[]'::jsonb, -- Array of proof links
  status issuer_request_status default 'PENDING',
  review_notes text,
  created_at timestamptz default now()
);

-- ADMIN USERS (Simple Role Management)
create table public.admin_users (
  user_id uuid references public.profiles(id) not null primary key,
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.issuer_requests enable row level security;
alter table public.admin_users enable row level security;

-- Profiles: Public Read, Owner Update
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Issuer Requests: Owner Create/Read, Admin Manage
create policy "Users can create issuer requests" 
  on public.issuer_requests for insert with check (auth.uid() = user_id);

create policy "Users can read own requests" 
  on public.issuer_requests for select using (auth.uid() = user_id);

create policy "Admins can read all requests" 
  on public.issuer_requests for select 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can update requests" 
  on public.issuer_requests for update 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Admin Users: Read Only (for role checks)
create policy "Admins visibility" 
  on public.admin_users for select using (true); -- Or restrict if needed, but safe for checking "is admin"

-- TRIGGERS
-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
