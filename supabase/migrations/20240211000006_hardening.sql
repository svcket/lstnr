-- PHASE 7: HARDENING & IDEMPOTENCY

-- 1. ADD IDEMPOTENCY COLUMN
-- Allows clients to pass a unique ID (UUID) for each trade.
-- If the network fails but the trade happened, retrying with the same ID will return success (or skip).
alter table public.transactions 
add column client_tx_id uuid;

-- Unique constraint: A user cannot reuse the same tx_id
create unique index idx_transactions_idempotency 
on public.transactions (user_id, client_tx_id) 
where client_tx_id is not null;


-- 2. HARDENED RPC FUNCTIONS (Idempotency + Search Path Safety)

-- MARKET BUY (Updated)
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
  
  -- Idempotency Check
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    
    if found then
      -- Return a "success" response indicating it was already done
      return json_build_object(
        'status', 'idempotent_success', 
        'message', 'Transaction already processed',
        'tx_id', v_existing_tx.id
      );
    end if;
  end if;
  
  -- 1. Lock Market Row
  select * into v_market from public.markets where id = p_market_id for update;
  if v_market.status != 'ACTIVE' then raise exception 'Market is not active'; end if;
  
  -- 2. Calculate Cost
  v_breakdown := get_buy_cost_breakdown(p_market_id, p_shares_to_buy);
  v_total_cost := (v_breakdown->>'total_cost')::numeric;
  v_fee := (v_breakdown->>'fee')::numeric;
  
  -- 3. Check Balance & Lock User Ledger
  select balance into v_user_cash 
  from public.ledger_balances 
  where user_id = v_user_id and kind = 'CASH' 
  for update;
  
  if v_user_cash is null or v_user_cash < v_total_cost then
    raise exception 'Insufficient funds';
  end if;
  
  -- 4. EXECUTE TRADE (Atomic)
  
  -- Debit Cash
  update public.ledger_balances 
  set balance = balance - v_total_cost, updated_at = now()
  where user_id = v_user_id and kind = 'CASH';
  
  -- Credit Market Reserve
  update public.markets 
  set reserve_balance = reserve_balance + v_total_cost,
      circulating_supply = circulating_supply + p_shares_to_buy
  where id = p_market_id;
  
  -- Credit Shares to User
  insert into public.ledger_balances (user_id, kind, asset_id, balance)
  values (v_user_id, 'ASSET', v_market.asset_id, p_shares_to_buy)
  on conflict (user_id, kind, asset_id)
  do update set balance = public.ledger_balances.balance + p_shares_to_buy,
                updated_at = now();
                
  -- Log Transaction
  insert into public.transactions (
    user_id, market_id, asset_id, type, 
    amount_asset, amount_cash, price_at_execution, fee_paid, client_tx_id
  ) values (
    v_user_id, p_market_id, v_market.asset_id, 'BUY',
    p_shares_to_buy, v_total_cost, (v_breakdown->>'price_per_share')::numeric, v_fee, p_client_tx_id
  );
  
  -- Return updated cost info
  return v_breakdown;
end;
$$ language plpgsql security definer search_path = public; -- HARDENING: Set search_path


-- MARKET SELL (Updated)
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
  
  -- Idempotency Check
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    
    if found then
      return json_build_object(
        'status', 'idempotent_success', 
        'message', 'Transaction already processed',
        'tx_id', v_existing_tx.id
      );
    end if;
  end if;
  
  -- 1. Lock Market Row
  select * into v_market from public.markets where id = p_market_id for update;
  if v_market.status != 'ACTIVE' then raise exception 'Market is not active'; end if;
  
  -- 2. Calculate Proceeds
  v_breakdown := get_sell_proceeds_breakdown(p_market_id, p_shares_to_sell);
  v_total_proceeds := (v_breakdown->>'total_proceeds')::numeric;
  v_fee := (v_breakdown->>'fee')::numeric;
  
  -- 3. Check Shares & Lock User Ledger
  select balance into v_user_shares
  from public.ledger_balances 
  where user_id = v_user_id and kind = 'ASSET' and asset_id = v_market.asset_id
  for update;
  
  if v_user_shares is null or v_user_shares < p_shares_to_sell then
    raise exception 'Insufficient shares';
  end if;
  
  -- 4. EXECUTE TRADE (Atomic)
  
  -- Debit Shares
  update public.ledger_balances 
  set balance = balance - p_shares_to_sell, updated_at = now()
  where user_id = v_user_id and kind = 'ASSET' and asset_id = v_market.asset_id;
  
  -- Debit Market Reserve
  if v_market.reserve_balance < v_total_proceeds then
    raise exception 'Market insolvency risk';
  end if;
  
  update public.markets 
  set reserve_balance = reserve_balance - v_total_proceeds,
      circulating_supply = circulating_supply - p_shares_to_sell
  where id = p_market_id;
  
  -- Credit Cash to User
  insert into public.ledger_balances (user_id, kind, asset_id, balance)
  values (v_user_id, 'CASH', null, v_total_proceeds)
  on conflict (user_id, kind, asset_id)
  do update set balance = public.ledger_balances.balance + v_total_proceeds,
                updated_at = now();
                
  -- Log Transaction
  insert into public.transactions (
    user_id, market_id, asset_id, type, 
    amount_asset, amount_cash, price_at_execution, fee_paid, client_tx_id
  ) values (
    v_user_id, p_market_id, v_market.asset_id, 'SELL',
    p_shares_to_sell, v_total_proceeds, (v_breakdown->>'price_per_share')::numeric, v_fee, p_client_tx_id
  );
  
  return v_breakdown;
end;
$$ language plpgsql security definer search_path = public;


-- PLACE PREDICTION (Updated)
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
  
  -- Idempotency Check
  if p_client_tx_id is not null then
    select * into v_existing_tx from public.transactions 
    where user_id = v_user_id and client_tx_id = p_client_tx_id;
    if found then
      return json_build_object('status', 'idempotent_success');
    end if;
  end if;
  
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
  
  -- Update Pool
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
    amount_cash, metadata, client_tx_id
  ) values (
    v_user_id, null, v_market.asset_id, 'PREDICT',
    p_stake_amount, 
    json_build_object(
      'prediction_id', p_prediction_id, 
      'outcome', p_outcome_label,
      'action', 'STAKE'
    ),
    p_client_tx_id
  );
  
  return json_build_object('status', 'success', 'staked', p_stake_amount);
end;
$$ language plpgsql security definer search_path = public;

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
  
  -- Verify Admin
  if not exists (select 1 from public.admin_users where user_id = v_admin_id) then
    raise exception 'Unauthorized: Admin only';
  end if;

  -- Lock Market
  select * into v_market from public.prediction_markets where id = p_prediction_id for update;
  if v_market.status = 'RESOLVED' or v_market.status = 'VOID' then
    raise exception 'Market already resolved';
  end if;

  -- Calculate Pools
  select sum(total_stake) into v_total_pool from public.prediction_pools where prediction_id = p_prediction_id;
  select total_stake into v_winning_pool from public.prediction_pools 
  where prediction_id = p_prediction_id and outcome_label = p_winning_outcome;
  
  if v_winning_pool is null or v_winning_pool = 0 then
    raise exception 'No stakes on winning outcome. Use VOID to refund.';
  end if;
  
  v_odds_multiplier := v_total_pool / v_winning_pool;

  -- PAYOUT WINNERS
  for v_pos in 
    select * from public.prediction_positions 
    where prediction_id = p_prediction_id and outcome_label = p_winning_outcome
  loop
    v_payout := v_pos.stake_amount * v_odds_multiplier;
    
    update public.ledger_balances 
    set balance = balance + v_payout, updated_at = now()
    where user_id = v_pos.user_id and kind = 'CASH';
    
    insert into public.transactions (
      user_id, market_id, asset_id, type, 
      amount_cash, metadata
    ) values (
      v_pos.user_id, null, v_market.asset_id, 'RESOLVE',
      v_payout, 
      json_build_object(
        'prediction_id', p_prediction_id, 
        'outcome', p_winning_outcome,
        'multiplier', v_odds_multiplier
      )
    );
  end loop;

  -- Close Market
  update public.prediction_markets 
  set status = 'RESOLVED', 
      resolved_outcome = p_winning_outcome,
      deadline = now()
  where id = p_prediction_id;
  
  return json_build_object('status', 'resolved');
end;
$$ language plpgsql security definer search_path = public;
