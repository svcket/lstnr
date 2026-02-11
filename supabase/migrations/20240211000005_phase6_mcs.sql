-- PHASE 6: MCS (Market Confidence Score)
-- Stored & Calculated Deterministically

-- MCS STORAGE
create table public.mcs_scores (
  asset_id uuid references public.assets(id) not null primary key,
  score int not null default 50 check (score >= 0 and score <= 100),
  
  -- Breakdown of factors (transparency)
  breakdown jsonb default '{}'::jsonb, 
  
  last_updated_at timestamptz default now()
);

-- RLS
alter table public.mcs_scores enable row level security;

create policy "MCS scores are viewable by everyone" 
  on public.mcs_scores for select using (true);

-- CALCULATE MCS FUNCTION
-- Logic V1 (Simple Weighted Model):
-- 1. Base Score: 50
-- 2. Verification Bonus: +20 (if issuer is verified)
-- 3. Liquidity Bonus: +1 per 1000 units in reserve (max 20)
-- 4. Holder Depth: +1 per unique holder > 0 balance (max 10)
-- 5. Status Penalty: -50 if Frozen/Suspended
create or replace function calculate_mcs(p_asset_id uuid) returns void as $$
declare
  v_asset record;
  v_market record;
  v_issuer record;
  v_holder_count int;
  
  v_score int := 30; -- Start lower, earn up
  v_verification_points int := 0;
  v_liquidity_points int := 0;
  v_holder_points int := 0;
  v_penalty_points int := 0;
  
  v_breakdown jsonb;
begin
  -- Get Data
  select * into v_asset from public.assets where id = p_asset_id;
  select * into v_market from public.markets where asset_id = p_asset_id;
  select * into v_issuer from public.profiles where id = v_asset.issuer_id;
  
  -- 1. Verification (+30)
  if v_issuer.is_verified_issuer then
    v_verification_points := 30;
  end if;
  
  -- 2. Liquidity (+1 per 1000 units reserve, max 30)
  -- Use floor(reserve / 1000)
  if v_market.reserve_balance > 0 then
    v_liquidity_points := least(floor(v_market.reserve_balance / 1000.0)::int, 30);
  end if;
  
  -- 3. Holder Depth (+1 per holder, max 10)
  select count(*) into v_holder_count 
  from public.ledger_balances 
  where asset_id = p_asset_id and balance > 0;
  
  v_holder_points := least(v_holder_count, 10);
  
  -- 4. Status Penalty (-50 if Frozen)
  if v_asset.status = 'FROZEN' or v_asset.status = 'DELISTED' then
    v_penalty_points := 50;
  end if;
  
  -- Total Score
  v_score := v_score + v_verification_points + v_liquidity_points + v_holder_points - v_penalty_points;
  
  -- Clamp 0-100
  if v_score < 0 then v_score := 0; end if;
  if v_score > 100 then v_score := 100; end if;
  
  -- Construct Breakdown
  v_breakdown := json_build_object(
    'base', 30,
    'verification', v_verification_points,
    'liquidity', v_liquidity_points,
    'holders', v_holder_points,
    'penalty', v_penalty_points
  );
  
  -- Update Table
  insert into public.mcs_scores (asset_id, score, breakdown, last_updated_at)
  values (p_asset_id, v_score, v_breakdown, now())
  on conflict (asset_id)
  do update set 
    score = v_score,
    breakdown = v_breakdown,
    last_updated_at = now();
    
end;
$$ language plpgsql security definer;


-- TRIGGER: Update MCS on Market Activity
-- Keep it simple: Update on Buy/Sell (reserve change) and Verification change?
-- For scalability, usually batch/cron is better, but for MVP trigger is instant feedback.
-- Let's attach to Markets update (reserve_balance changes on buy/sell).

create or replace function trigger_update_mcs() returns trigger as $$
begin
  perform calculate_mcs(new.asset_id);
  return new;
end;
$$ language plpgsql;

create trigger on_market_reserve_change
  after update of reserve_balance on public.markets
  for each row execute procedure trigger_update_mcs();

-- Also trigger on Asset creation (initial score)
create or replace function trigger_init_mcs() returns trigger as $$
begin
  perform calculate_mcs(new.id);
  return new;
end;
$$ language plpgsql;

create trigger on_asset_created
  after insert on public.assets
  for each row execute procedure trigger_init_mcs();
