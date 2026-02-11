-- LSTNR REMOTE MIGRATION
-- Run this in the Supabase Dashboard SQL Editor
-- It includes Phases 1 through 7

-- ==========================================
-- PHASE 1: IDENTITY & PROFILES
-- ==========================================
create extension if not exists "uuid-ossp";

-- ROLES & ENUMS
do $$ begin
    create type issuer_type as enum ('ARTIST', 'LABEL', 'MANAGEMENT');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type issuer_request_status as enum ('PENDING', 'APPROVED', 'REJECTED');
exception
    when duplicate_object then null;
end $$;

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  avatar_url text,
  is_verified_issuer boolean default false,
  created_at timestamptz default now()
);

-- ISSUER REQUESTS
create table if not exists public.issuer_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  issuer_type issuer_type not null,
  legal_name text not null,
  proof_urls jsonb default '[]'::jsonb,
  status issuer_request_status default 'PENDING',
  review_notes text,
  created_at timestamptz default now()
);

-- ADMIN USERS
create table if not exists public.admin_users (
  user_id uuid references public.profiles(id) not null primary key,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.issuer_requests enable row level security;
alter table public.admin_users enable row level security;

-- Policies (Drop first to avoid conflicts if re-run)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can create issuer requests" on public.issuer_requests;
create policy "Users can create issuer requests" on public.issuer_requests for insert with check (auth.uid() = user_id);

drop policy if exists "Users can read own requests" on public.issuer_requests;
create policy "Users can read own requests" on public.issuer_requests for select using (auth.uid() = user_id);

drop policy if exists "Admins can read all requests" on public.issuer_requests;
create policy "Admins can read all requests" on public.issuer_requests for select using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update requests" on public.issuer_requests;
create policy "Admins can update requests" on public.issuer_requests for update using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins visibility" on public.admin_users;
create policy "Admins visibility" on public.admin_users for select using (true);

-- Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid error
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- PHASE 2: ASSETS & MARKETS
-- ==========================================
do $$ begin
    create type asset_status as enum ('ACTIVE', 'FROZEN', 'DELISTED');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.assets (
  id uuid default uuid_generate_v4() primary key,
  issuer_id uuid references public.profiles(id) not null,
  issuer_type issuer_type not null,
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

do $$ begin
    create type curve_type as enum ('LINEAR');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type market_status as enum ('ACTIVE', 'PAUSED');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.markets (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) not null,
  curve_type curve_type default 'LINEAR',
  base_price numeric not null default 0 check (base_price >= 0),
  slope numeric not null default 0.001 check (slope > 0),
  reserve_balance numeric default 0 check (reserve_balance >= 0),
  circulating_supply numeric default 0 check (circulating_supply >= 0),
  fee_bps int default 50 check (fee_bps >= 0 and fee_bps <= 10000),
  status market_status default 'ACTIVE',
  created_at timestamptz default now(),
  unique(asset_id)
);

alter table public.assets enable row level security;
alter table public.markets enable row level security;

-- Policies
drop policy if exists "Assets are viewable by everyone" on public.assets;
create policy "Assets are viewable by everyone" on public.assets for select using (true);

drop policy if exists "Verified issuers can create assets" on public.assets;
create policy "Verified issuers can create assets" on public.assets for insert with check (
    auth.uid() = issuer_id and exists (select 1 from public.profiles where id = auth.uid() and is_verified_issuer = true)
);

drop policy if exists "Admins can update assets" on public.assets;
create policy "Admins can update assets" on public.assets for update using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Markets are viewable by everyone" on public.markets;
create policy "Markets are viewable by everyone" on public.markets for select using (true);

drop policy if exists "Verified issuers can create markets" on public.markets;
create policy "Verified issuers can create markets" on public.markets for insert with check (
    exists (select 1 from public.assets where id = asset_id and issuer_id = auth.uid())
);

drop policy if exists "Admins can update markets" on public.markets;
create policy "Admins can update markets" on public.markets for update using (exists (select 1 from public.admin_users where user_id = auth.uid()));


-- ==========================================
-- PHASE 3: LEDGER & TRANSACTIONS
-- ==========================================
do $$ begin
    create type ledger_kind as enum ('CASH', 'ASSET');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.ledger_balances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  kind ledger_kind not null,
  asset_id uuid references public.assets(id),
  balance numeric not null default 0 check (balance >= 0),
  updated_at timestamptz default now(),
  constraint valid_asset_id check ((kind = 'CASH' and asset_id is null) or (kind = 'ASSET' and asset_id is not null)),
  unique(user_id, kind, asset_id)
);

do $$ begin
    create type transaction_type as enum (
      'DEPOSIT', 'WITHDRAW', 'BUY', 'SELL', 'MINT', 'PREDICT', 'RESOLVE', 'ADJUST'
    );
exception
    when duplicate_object then null;
end $$;

create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  market_id uuid references public.markets(id),
  asset_id uuid references public.assets(id),
  type transaction_type not null,
  amount_asset numeric default 0,
  amount_cash numeric default 0,
  price_at_execution numeric default 0,
  fee_paid numeric default 0,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.ledger_balances enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Users can view own balances" on public.ledger_balances;
create policy "Users can view own balances" on public.ledger_balances for select using (auth.uid() = user_id);

drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all transactions" on public.transactions;
create policy "Admins can view all transactions" on public.transactions for select using (exists (select 1 from public.admin_users where user_id = auth.uid()));


-- ==========================================
-- PHASE 4: MARKET ENGINE (Functions)
-- ==========================================
-- get_buy_cost_breakdown
create or replace function get_buy_cost_breakdown(
  p_market_id uuid,
  p_shares_to_buy numeric
) returns json as $$
declare
  v_market record;
  v_base numeric;
  v_slope numeric;
  v_supply numeric;
  v_raw_cost numeric;
  v_fee numeric;
begin
  select * into v_market from public.markets where id = p_market_id;
  if not found then raise exception 'Market not found'; end if;
  
  v_base := v_market.base_price;
  v_slope := v_market.slope;
  v_supply := v_market.circulating_supply;
  
  v_raw_cost := p_shares_to_buy * (v_base + (v_slope * (v_supply + (p_shares_to_buy / 2.0))));
  v_fee := v_raw_cost * (v_market.fee_bps::numeric / 10000.0);
  
  return json_build_object(
    'raw_cost', v_raw_cost,
    'fee', v_fee,
    'total_cost', v_raw_cost + v_fee,
    'new_supply', v_supply + p_shares_to_buy,
    'price_per_share', (v_raw_cost + v_fee) / p_shares_to_buy
  );
end;
$$ language plpgsql stable;

-- get_sell_proceeds_breakdown
create or replace function get_sell_proceeds_breakdown(
  p_market_id uuid,
  p_shares_to_sell numeric
) returns json as $$
declare
  v_market record;
  v_base numeric;
  v_slope numeric;
  v_supply numeric;
  v_new_supply numeric;
  v_raw_proceeds numeric;
  v_fee numeric;
begin
  select * into v_market from public.markets where id = p_market_id;
  if not found then raise exception 'Market not found'; end if;
  
  v_base := v_market.base_price;
  v_slope := v_market.slope;
  v_supply := v_market.circulating_supply;
  v_new_supply := v_supply - p_shares_to_sell;
  
  if v_new_supply < 0 then raise exception 'Cannot sell more than supply'; end if;
  
  v_raw_proceeds := p_shares_to_sell * (v_base + (v_slope * (v_new_supply + (p_shares_to_sell / 2.0))));
  v_fee := v_raw_proceeds * (v_market.fee_bps::numeric / 10000.0);
  
  return json_build_object(
    'raw_proceeds', v_raw_proceeds,
    'fee', v_fee,
    'total_proceeds', v_raw_proceeds - v_fee,
    'new_supply', v_new_supply,
    'price_per_share', (v_raw_proceeds - v_fee) / p_shares_to_sell
  );
end;
$$ language plpgsql stable;


-- ==========================================
-- PHASE 5: PREDICTIONS
-- ==========================================
do $$ begin
    create type prediction_market_type as enum ('BINARY', 'MULTIRANGE');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type prediction_resolver_type as enum ('ADMIN', 'CURATOR', 'ORACLE');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type prediction_status as enum ('OPEN', 'LOCKED', 'RESOLVING', 'RESOLVED', 'VOID');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.prediction_markets (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) not null,
  market_type prediction_market_type not null,
  question text not null,
  description text,
  outcomes jsonb not null default '[]'::jsonb,
  resolver_type prediction_resolver_type default 'ADMIN',
  resolver_id uuid references public.profiles(id),
  deadline timestamptz not null,
  status prediction_status default 'OPEN',
  resolved_outcome text,
  created_at timestamptz default now()
);

create table if not exists public.prediction_pools (
  id uuid default uuid_generate_v4() primary key,
  prediction_id uuid references public.prediction_markets(id) not null,
  outcome_label text not null,
  total_stake numeric default 0 check (total_stake >= 0),
  unique(prediction_id, outcome_label)
);

create table if not exists public.prediction_positions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  prediction_id uuid references public.prediction_markets(id) not null,
  outcome_label text not null,
  stake_amount numeric not null check (stake_amount > 0),
  potential_payout numeric,
  created_at timestamptz default now(),
  unique(user_id, prediction_id, outcome_label)
);

alter table public.prediction_markets enable row level security;
alter table public.prediction_pools enable row level security;
alter table public.prediction_positions enable row level security;

drop policy if exists "Prediction markets are viewable by everyone" on public.prediction_markets;
create policy "Prediction markets are viewable by everyone" on public.prediction_markets for select using (true);

drop policy if exists "Prediction pools are viewable by everyone" on public.prediction_pools;
create policy "Prediction pools are viewable by everyone" on public.prediction_pools for select using (true);

drop policy if exists "Admins can manage prediction markets" on public.prediction_markets;
create policy "Admins can manage prediction markets" on public.prediction_markets for all using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Users can view own prediction positions" on public.prediction_positions;
create policy "Users can view own prediction positions" on public.prediction_positions for select using (auth.uid() = user_id);


-- ==========================================
-- PHASE 5 PART 2: REALTIME
-- ==========================================
-- Enable Realtime
-- Use DO block to avoid error if already added
do $$ begin
  alter publication supabase_realtime add table markets;
  alter publication supabase_realtime add table ledger_balances;
  alter publication supabase_realtime add table mcs_scores;
exception
  when duplicate_object then null;
  when others then null; -- Ignore if publication doesn't exist or other error
end $$;


-- ==========================================
-- PHASE 6: MCS (Market Confidence Score)
-- ==========================================
create table if not exists public.mcs_scores (
  asset_id uuid references public.assets(id) not null primary key,
  score int not null default 50 check (score >= 0 and score <= 100),
  breakdown jsonb default '{}'::jsonb, 
  last_updated_at timestamptz default now()
);

alter table public.mcs_scores enable row level security;

drop policy if exists "MCS scores are viewable by everyone" on public.mcs_scores;
create policy "MCS scores are viewable by everyone" on public.mcs_scores for select using (true);

-- Calculate MCS Function
create or replace function calculate_mcs(p_asset_id uuid) returns void as $$
declare
  v_asset record;
  v_market record;
  v_issuer record;
  v_holder_count int;
  v_score int := 30;
  v_verification_points int := 0;
  v_liquidity_points int := 0;
  v_holder_points int := 0;
  v_penalty_points int := 0;
  v_breakdown jsonb;
begin
  select * into v_asset from public.assets where id = p_asset_id;
  select * into v_market from public.markets where asset_id = p_asset_id;
  select * into v_issuer from public.profiles where id = v_asset.issuer_id;
  
  if v_issuer.is_verified_issuer then v_verification_points := 30; end if;
  if v_market.reserve_balance > 0 then v_liquidity_points := least(floor(v_market.reserve_balance / 1000.0)::int, 30); end if;
  
  select count(*) into v_holder_count from public.ledger_balances where asset_id = p_asset_id and balance > 0;
  v_holder_points := least(v_holder_count, 10);
  
  if v_asset.status = 'FROZEN' or v_asset.status = 'DELISTED' then v_penalty_points := 50; end if;
  
  v_score := v_score + v_verification_points + v_liquidity_points + v_holder_points - v_penalty_points;
  if v_score < 0 then v_score := 0; end if;
  if v_score > 100 then v_score := 100; end if;
  
  v_breakdown := json_build_object(
    'base', 30,
    'verification', v_verification_points,
    'liquidity', v_liquidity_points,
    'holders', v_holder_points,
    'penalty', v_penalty_points
  );
  
  insert into public.mcs_scores (asset_id, score, breakdown, last_updated_at)
  values (p_asset_id, v_score, v_breakdown, now())
  on conflict (asset_id)
  do update set score = v_score, breakdown = v_breakdown, last_updated_at = now();
end;
$$ language plpgsql security definer;

-- MCS Triggers
create or replace function trigger_update_mcs() returns trigger as $$
begin
  perform calculate_mcs(new.asset_id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_market_reserve_change on public.markets;
create trigger on_market_reserve_change
  after update of reserve_balance on public.markets
  for each row execute procedure trigger_update_mcs();

create or replace function trigger_init_mcs() returns trigger as $$
begin
  perform calculate_mcs(new.id);
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_asset_created on public.assets;
create trigger on_asset_created
  after insert on public.assets
  for each row execute procedure trigger_init_mcs();


-- ==========================================
-- PHASE 7: HARDENING (Idempotency + Final Functions)
-- ==========================================
-- Add Idempotency Column
alter table public.transactions add column if not exists client_tx_id uuid;

create unique index if not exists idx_transactions_idempotency 
on public.transactions (user_id, client_tx_id) 
where client_tx_id is not null;

-- MARKET BUY (Hardened)
create or replace function market_buy(
  p_market_id uuid,
  p_shares_to_buy numeric,
  p_client_tx_id uuid default null
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_breakdown json;
  v_total_cost numeric;
  v_fee numeric;
  v_user_cash numeric;
  v_existing_tx record;
begin
  v_user_id := auth.uid();
  
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    if found then
      return json_build_object('status', 'idempotent_success', 'message', 'Transaction already processed', 'tx_id', v_existing_tx.id);
    end if;
  end if;
  
  select * into v_market from public.markets where id = p_market_id for update;
  if v_market.status != 'ACTIVE' then raise exception 'Market is not active'; end if;
  
  v_breakdown := get_buy_cost_breakdown(p_market_id, p_shares_to_buy);
  v_total_cost := (v_breakdown->>'total_cost')::numeric;
  v_fee := (v_breakdown->>'fee')::numeric;
  
  select balance into v_user_cash from public.ledger_balances where user_id = v_user_id and kind = 'CASH' for update;
  
  if v_user_cash is null or v_user_cash < v_total_cost then raise exception 'Insufficient funds'; end if;
  
  update public.ledger_balances set balance = balance - v_total_cost, updated_at = now() where user_id = v_user_id and kind = 'CASH';
  update public.markets set reserve_balance = reserve_balance + v_total_cost, circulating_supply = circulating_supply + p_shares_to_buy where id = p_market_id;
  
  insert into public.ledger_balances (user_id, kind, asset_id, balance)
  values (v_user_id, 'ASSET', v_market.asset_id, p_shares_to_buy)
  on conflict (user_id, kind, asset_id)
  do update set balance = public.ledger_balances.balance + p_shares_to_buy, updated_at = now();
                
  insert into public.transactions (user_id, market_id, asset_id, type, amount_asset, amount_cash, price_at_execution, fee_paid, client_tx_id)
  values (v_user_id, p_market_id, v_market.asset_id, 'BUY', p_shares_to_buy, v_total_cost, (v_breakdown->>'price_per_share')::numeric, v_fee, p_client_tx_id);
  
  return v_breakdown;
end;
$$ language plpgsql security definer set search_path = public;

-- MARKET SELL (Hardened)
create or replace function market_sell(
  p_market_id uuid,
  p_shares_to_sell numeric,
  p_client_tx_id uuid default null
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_breakdown json;
  v_total_proceeds numeric;
  v_fee numeric;
  v_user_shares numeric;
  v_existing_tx record;
begin
  v_user_id := auth.uid();
  
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    if found then
      return json_build_object('status', 'idempotent_success', 'message', 'Transaction already processed', 'tx_id', v_existing_tx.id);
    end if;
  end if;
  
  select * into v_market from public.markets where id = p_market_id for update;
  if v_market.status != 'ACTIVE' then raise exception 'Market is not active'; end if;
  
  v_breakdown := get_sell_proceeds_breakdown(p_market_id, p_shares_to_sell);
  v_total_proceeds := (v_breakdown->>'total_proceeds')::numeric;
  v_fee := (v_breakdown->>'fee')::numeric;
  
  select balance into v_user_shares from public.ledger_balances where user_id = v_user_id and kind = 'ASSET' and asset_id = v_market.asset_id for update;
  if v_user_shares is null or v_user_shares < p_shares_to_sell then raise exception 'Insufficient shares'; end if;
  
  update public.ledger_balances set balance = balance - p_shares_to_sell, updated_at = now() where user_id = v_user_id and kind = 'ASSET' and asset_id = v_market.asset_id;
  
  if v_market.reserve_balance < v_total_proceeds then raise exception 'Market insolvency risk'; end if;
  
  update public.markets set reserve_balance = reserve_balance - v_total_proceeds, circulating_supply = circulating_supply - p_shares_to_sell where id = p_market_id;
  
  insert into public.ledger_balances (user_id, kind, asset_id, balance) values (v_user_id, 'CASH', null, v_total_proceeds)
  on conflict (user_id, kind, asset_id) do update set balance = public.ledger_balances.balance + v_total_proceeds, updated_at = now();
                
  insert into public.transactions (user_id, market_id, asset_id, type, amount_asset, amount_cash, price_at_execution, fee_paid, client_tx_id)
  values (v_user_id, p_market_id, v_market.asset_id, 'SELL', p_shares_to_sell, v_total_proceeds, (v_breakdown->>'price_per_share')::numeric, v_fee, p_client_tx_id);
  
  return v_breakdown;
end;
$$ language plpgsql security definer set search_path = public;

-- PLACE PREDICTION (Hardened)
create or replace function place_prediction(
  p_prediction_id uuid,
  p_outcome_label text,
  p_stake_amount numeric,
  p_client_tx_id uuid default null
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_user_cash numeric;
  v_existing_tx record;
begin
  v_user_id := auth.uid();
  
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    if found then return json_build_object('status', 'idempotent_success'); end if;
  end if;
  
  select * into v_market from public.prediction_markets where id = p_prediction_id;
  if not found then raise exception 'Prediction market not found'; end if;
  if v_market.status != 'OPEN' then raise exception 'Prediction market is closed'; end if;
  if v_market.deadline < now() then raise exception 'Prediction deadline passed'; end if;

  select balance into v_user_cash from public.ledger_balances where user_id = v_user_id and kind = 'CASH' for update;
  if v_user_cash is null or v_user_cash < p_stake_amount then raise exception 'Insufficient funds'; end if;
  
  update public.ledger_balances set balance = balance - p_stake_amount, updated_at = now() where user_id = v_user_id and kind = 'CASH';
  
  insert into public.prediction_pools (prediction_id, outcome_label, total_stake) values (p_prediction_id, p_outcome_label, p_stake_amount)
  on conflict (prediction_id, outcome_label) do update set total_stake = public.prediction_pools.total_stake + p_stake_amount;
  
  insert into public.prediction_positions (user_id, prediction_id, outcome_label, stake_amount) values (v_user_id, p_prediction_id, p_outcome_label, p_stake_amount)
  on conflict (user_id, prediction_id, outcome_label) do update set stake_amount = public.prediction_positions.stake_amount + p_stake_amount;
  
  insert into public.transactions (user_id, market_id, asset_id, type, amount_cash, metadata, client_tx_id)
  values (v_user_id, null, v_market.asset_id, 'PREDICT', p_stake_amount, json_build_object('prediction_id', p_prediction_id, 'outcome', p_outcome_label, 'action', 'STAKE'), p_client_tx_id);
  
  return json_build_object('status', 'success', 'staked', p_stake_amount);
end;
$$ language plpgsql security definer set search_path = public;

-- RESOLVE PREDICTION (Hardened)
create or replace function resolve_prediction(
  p_prediction_id uuid,
  p_winning_outcome text
) returns json as $$
declare
  v_admin_id uuid;
  v_market record;
  v_total_pool numeric := 0;
  v_winning_pool numeric := 0;
  v_pos record;
  v_payout numeric;
  v_odds_multiplier numeric;
begin
  v_admin_id := auth.uid();
  if not exists (select 1 from public.admin_users where user_id = v_admin_id) then raise exception 'Unauthorized: Admin only'; end if;

  select * into v_market from public.prediction_markets where id = p_prediction_id for update;
  if v_market.status = 'RESOLVED' or v_market.status = 'VOID' then raise exception 'Market already resolved'; end if;

  select sum(total_stake) into v_total_pool from public.prediction_pools where prediction_id = p_prediction_id;
  select total_stake into v_winning_pool from public.prediction_pools where prediction_id = p_prediction_id and outcome_label = p_winning_outcome;
  
  if v_winning_pool is null or v_winning_pool = 0 then raise exception 'No stakes on winning outcome. Use VOID to refund.'; end if;
  v_odds_multiplier := v_total_pool / v_winning_pool;

  for v_pos in select * from public.prediction_positions where prediction_id = p_prediction_id and outcome_label = p_winning_outcome loop
    v_payout := v_pos.stake_amount * v_odds_multiplier;
    update public.ledger_balances set balance = balance + v_payout, updated_at = now() where user_id = v_pos.user_id and kind = 'CASH';
    insert into public.transactions (user_id, market_id, asset_id, type, amount_cash, metadata)
    values (v_pos.user_id, null, v_market.asset_id, 'RESOLVE', v_payout, json_build_object('prediction_id', p_prediction_id, 'outcome', p_winning_outcome, 'multiplier', v_odds_multiplier));
  end loop;

  update public.prediction_markets set status = 'RESOLVED', resolved_outcome = p_winning_outcome, deadline = now() where id = p_prediction_id;
  return json_build_object('status', 'resolved');
end;
$$ language plpgsql security definer set search_path = public;
