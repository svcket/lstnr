-- LEDGER BALANCES (The "Wallet")
create type ledger_kind as enum ('CASH', 'ASSET');

create table public.ledger_balances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  kind ledger_kind not null,
  asset_id uuid references public.assets(id), -- Null for CASH
  balance numeric not null default 0 check (balance >= 0),
  updated_at timestamptz default now(),
  
  -- Constraint: Cash has no asset_id, Asset has asset_id
  constraint valid_asset_id check (
    (kind = 'CASH' and asset_id is null) or 
    (kind = 'ASSET' and asset_id is not null)
  ),
  
  -- Optimistic Locking / Uniqueness: One balance per user per asset
  unique(user_id, kind, asset_id)
);

-- TRANSACTIONS (Immutable Audit Log)
create type transaction_type as enum (
  'DEPOSIT', 'WITHDRAW', 
  'BUY', 'SELL', 
  'MINT', 'PREDICT', 'RESOLVE', 
  'ADJUST' -- Admin Correction
);

create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  market_id uuid references public.markets(id), -- Null for Withdraw/Deposit
  asset_id uuid references public.assets(id), -- Null for pure cash ops (rare)
  type transaction_type not null,
  
  amount_asset numeric default 0,
  amount_cash numeric default 0,
  price_at_execution numeric default 0,
  fee_paid numeric default 0,
  
  metadata jsonb, -- For notes, dispute reason, etc.
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table public.ledger_balances enable row level security;
alter table public.transactions enable row level security;

-- Ledger: Users see their own balances
create policy "Users can view own balances" 
  on public.ledger_balances for select using (auth.uid() = user_id);

-- Transactions: Users see their own history
create policy "Users can view own transactions" 
  on public.transactions for select using (auth.uid() = user_id);

-- Transactions: Append-Only (NO UPDATE/DELETE)
-- We do NOT add update/delete policies at all.
-- Insert is allowed only via server-side functions (security definer), 
-- so technically we don't even need an Insert policy for public users 
-- if all logic is wrapped in RPC functions (which it will be in Phase 4).
-- But for clarity/admin seed:
create policy "Admins can view all transactions" 
  on public.transactions for select 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
