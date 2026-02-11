-- ASSETS (Market Listings)
-- Only Verified Issuers (ARTIST/LABEL) can list assets
create type asset_status as enum ('ACTIVE', 'FROZEN', 'DELISTED');

create table public.assets (
  id uuid default uuid_generate_v4() primary key,
  issuer_id uuid references public.profiles(id) not null,
  issuer_type issuer_type not null, -- from Phase 1 enum ('ARTIST', 'LABEL')
  name text not null,
  symbol text unique not null,
  description text,
  avatar_url text,
  status asset_status default 'ACTIVE',
  total_supply numeric not null check (total_supply > 0),
  circulating_supply numeric default 0 check (circulating_supply >= 0),
  issuer_holdings_locked numeric default 0 check (issuer_holdings_locked >= 0),
  created_at timestamptz default now()
);

-- MARKETS (Bonding Curve Mechanism)
-- Linked 1:1 with Assets
create type curve_type as enum ('LINEAR'); -- Keep v1 simple
create type market_status as enum ('ACTIVE', 'PAUSED');

create table public.markets (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) not null,
  curve_type curve_type default 'LINEAR',
  base_price numeric not null default 0 check (base_price >= 0),
  slope numeric not null default 0.001 check (slope > 0),
  reserve_balance numeric default 0 check (reserve_balance >= 0),
  fee_bps int default 50 check (fee_bps >= 0 and fee_bps <= 10000), -- Basis points
  status market_status default 'ACTIVE',
  created_at timestamptz default now(),
  unique(asset_id)
);

-- RLS POLICIES
alter table public.assets enable row level security;
alter table public.markets enable row level security;

-- Assets: Public Read
create policy "Assets are viewable by everyone" 
  on public.assets for select using (true);

-- Assets: Created ONLY by Verified Issuers for themselves
create policy "Verified issuers can create assets" 
  on public.assets for insert 
  with check (
    auth.uid() = issuer_id 
    and exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and is_verified_issuer = true
    )
  );

-- Assets: Only Admin can update status (Freeze/Delist)
-- (Or issuer in specific cases, but for v1 safe to restrict to admin/system)
create policy "Admins can update assets" 
  on public.assets for update 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Markets: Public Read
create policy "Markets are viewable by everyone" 
  on public.markets for select using (true);

-- Markets: Created by Issuer (when creating asset)
create policy "Verified issuers can create markets" 
  on public.markets for insert 
  with check (
    exists (
      select 1 from public.assets 
      where id = asset_id 
      and issuer_id = auth.uid()
    )
  );

-- Markets: Pause/Unpause by Admin
create policy "Admins can update markets" 
  on public.markets for update 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
