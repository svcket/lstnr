-- PHASE 5: PREDICTION MARKETS (Binary & Multi-Range)

create type prediction_market_type as enum ('BINARY', 'MULTIRANGE');
create type prediction_resolver_type as enum ('ADMIN', 'CURATOR', 'ORACLE');
create type prediction_status as enum ('OPEN', 'LOCKED', 'RESOLVING', 'RESOLVED', 'VOID');

-- PREDICTION MARKETS TABLE
create table public.prediction_markets (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) not null, -- Tied to an artist/label
  market_type prediction_market_type not null,
  question text not null,
  description text,
  
  -- Outcomes configuration.
  -- For Binary: ["YES", "NO"] implicit or explicit.
  -- For Multirange: [{"label": "10-20k", "min": 10000, "max": 20000}, ...]
  outcomes jsonb not null default '[]'::jsonb,
  
  resolver_type prediction_resolver_type default 'ADMIN',
  resolver_id uuid references public.profiles(id), -- Specific user/admin who can resolve
  
  deadline timestamptz not null,
  status prediction_status default 'OPEN',
  resolved_outcome text, -- The winning label (e.g. "YES" or "10-20k")
  
  created_at timestamptz default now()
);

-- PREDICTION POOLS (Track Total Staked per Outcome)
-- Used for Dynamic Odds / Pari-Mutuel Calculation
create table public.prediction_pools (
  id uuid default uuid_generate_v4() primary key,
  prediction_id uuid references public.prediction_markets(id) not null,
  outcome_label text not null, -- "YES", "NO", "10-20k"
  total_stake numeric default 0 check (total_stake >= 0),
  unique(prediction_id, outcome_label)
);

-- PREDICTION POSITIONS (User Stakes)
create table public.prediction_positions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  prediction_id uuid references public.prediction_markets(id) not null,
  outcome_label text not null,
  
  stake_amount numeric not null check (stake_amount > 0),
  potential_payout numeric, -- Estimated at time of bet (for UI), actual payout depends on final pool
  
  created_at timestamptz default now(),
  -- One position per user per outcome (simplify for MVP, can aggregate stakes)
  unique(user_id, prediction_id, outcome_label)
);

-- RLS POLICIES
alter table public.prediction_markets enable row level security;
alter table public.prediction_pools enable row level security;
alter table public.prediction_positions enable row level security;

-- Markets & Pools: Public Read
create policy "Prediction markets are viewable by everyone" 
  on public.prediction_markets for select using (true);

create policy "Prediction pools are viewable by everyone" 
  on public.prediction_pools for select using (true);

-- Markets: Only Admin/Issuer-Resolver can create/update (MVP: Admin only for creation safety)
create policy "Admins can manage prediction markets" 
  on public.prediction_markets for all 
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Positions: Users see own
create policy "Users can view own prediction positions" 
  on public.prediction_positions for select using (auth.uid() = user_id);


-- FUNCTION: PLACE PREDICTION (Atomic Bet)
create or replace function place_prediction(
  p_prediction_id uuid,
  p_outcome_label text,
  p_stake_amount numeric
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_user_cash numeric;
begin
  v_user_id := auth.uid();
  
  -- 1. Lock Market & Validate
  select * into v_market from public.prediction_markets where id = p_prediction_id;
  if not found then raise exception 'Prediction market not found'; end if;
  
  if v_market.status != 'OPEN' then raise exception 'Prediction market is closed'; end if;
  if v_market.deadline < now() then raise exception 'Prediction deadline passed'; end if;

  -- 2. Check Cash Balance
  select balance into v_user_cash 
  from public.ledger_balances 
  where user_id = v_user_id and kind = 'CASH' 
  for update;
  
  if v_user_cash is null or v_user_cash < p_stake_amount then
    raise exception 'Insufficient funds';
  end if;
  
  -- 3. EXECUTE BET
  
  -- Deduct Cash
  update public.ledger_balances 
  set balance = balance - p_stake_amount, updated_at = now()
  where user_id = v_user_id and kind = 'CASH';
  
  -- Update Pool (Add stake)
  insert into public.prediction_pools (prediction_id, outcome_label, total_stake)
  values (p_prediction_id, p_outcome_label, p_stake_amount)
  on conflict (prediction_id, outcome_label)
  do update set total_stake = public.prediction_pools.total_stake + p_stake_amount;
  
  -- Create/Update Position
  insert into public.prediction_positions (user_id, prediction_id, outcome_label, stake_amount)
  values (v_user_id, p_prediction_id, p_outcome_label, p_stake_amount)
  on conflict (user_id, prediction_id, outcome_label)
  do update set stake_amount = public.prediction_positions.stake_amount + p_stake_amount;
  
  -- Log Transaction
  insert into public.transactions (
    user_id, market_id, asset_id, type, 
    amount_cash, metadata
  ) values (
    v_user_id, null, v_market.asset_id, 'PREDICT',
    p_stake_amount, 
    json_build_object(
      'prediction_id', p_prediction_id, 
      'outcome', p_outcome_label,
      'action', 'STAKE'
    )
  );
  
  return json_build_object('status', 'success', 'staked', p_stake_amount);
end;
$$ language plpgsql security definer;


-- FUNCTION: RESOLVE PREDICTION (Distribute Winnings)
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
  
  -- 1. Verify Admin (Simple check)
  if not exists (select 1 from public.admin_users where user_id = v_admin_id) then
    raise exception 'Unauthorized: Admin only';
  end if;

  -- 2. Lock Market
  select * into v_market from public.prediction_markets where id = p_prediction_id for update;
  if v_market.status = 'RESOLVED' or v_market.status = 'VOID' then
    raise exception 'Market already resolved';
  end if;

  -- 3. Calculate Pools
  select sum(total_stake) into v_total_pool from public.prediction_pools where prediction_id = p_prediction_id;
  select total_stake into v_winning_pool from public.prediction_pools 
  where prediction_id = p_prediction_id and outcome_label = p_winning_outcome;
  
  if v_winning_pool is null or v_winning_pool = 0 then
    -- Edge case: No winners. Protocol keeps funds? Or Refund?
    -- MVP: Refund everyone (VOID logic) or Admin keeps. 
    -- Let's raise for now, handle VOID manually if needed.
    raise exception 'No stakes on winning outcome. Use VOID to refund.';
  end if;
  
  v_odds_multiplier := v_total_pool / v_winning_pool; -- e.g. 1000 total / 200 winning = 5x payout

  -- 4. PAYOUT WINNERS
  -- Loop through all winning positions
  -- (Batch update might be better for large scale, but fine for MVP)
  for v_pos in 
    select * from public.prediction_positions 
    where prediction_id = p_prediction_id and outcome_label = p_winning_outcome
  loop
    v_payout := v_pos.stake_amount * v_odds_multiplier;
    
    -- Credit User Cash
    update public.ledger_balances 
    set balance = balance + v_payout, updated_at = now()
    where user_id = v_pos.user_id and kind = 'CASH';
    
    -- Log Payout
    insert into public.transactions (
      user_id, market_id, asset_id, type, 
      amount_cash, metadata
    ) values (
      v_pos.user_id, null, v_market.asset_id, 'RESOLVE',
      v_payout, 
      json_build_object(
        'prediction_id', p_prediction_id, 
        'outcome', p_winning_outcome,
        'action', 'PAYOUT',
        'multiplier', v_odds_multiplier
      )
    );
  end loop;

  -- 5. Close Market
  update public.prediction_markets 
  set status = 'RESOLVED', 
      resolved_outcome = p_winning_outcome,
      deadline = now() -- Close it officially
  where id = p_prediction_id;
  
  return json_build_object(
    'status', 'resolved', 
    'winner', p_winning_outcome, 
    'total_pool', v_total_pool, 
    'multiplier', v_odds_multiplier
  );
end;
$$ language plpgsql security definer;
