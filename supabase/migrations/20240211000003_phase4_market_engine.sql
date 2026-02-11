-- PHASE 4: MARKET ENGINE (Deterministic Trading)
-- All money movements MUST go through these functions.
-- NO ONE can write to ledger_balances or transactions directly from client.

-- HELPER: Calculate Cost for Buying X Shares (Linear Curve)
-- Price(S) = Base + (Slope * S)
-- Cost = Integral from S to S+k
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
  v_supply := v_market.circulating_supply; -- Does not use TOTAL supply, only circulating
  
  -- Integral: (Base * k) + (Slope/2) * ((S+k)^2 - S^2)
  -- Or simpler: k * (Base + Slope*(S + k/2))
  v_raw_cost := p_shares_to_buy * (v_base + (v_slope * (v_supply + (p_shares_to_buy / 2.0))));
  
  -- Calculate Fee
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


-- HELPER: Calculate Proceeds for Selling X Shares
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
  
  -- Integral from S-k to S
  -- Area under curve between new_supply and current_supply
  v_raw_proceeds := p_shares_to_sell * (v_base + (v_slope * (v_new_supply + (p_shares_to_sell / 2.0))));
  
  -- Calculate Fee (deducted from proceeds)
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


-- TRANSACTION: MARKET BUY
create or replace function market_buy(
  p_market_id uuid,
  p_shares_to_buy numeric
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_breakdown json;
  v_total_cost numeric;
  v_fee numeric;
  v_user_cash numeric;
begin
  v_user_id := auth.uid();
  
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
  
  -- Credit Market Reserve (Raw Cost, fee logic can vary, keeping fee in reserve for now)
  -- Or separate fee? For MVP, fee stays in curve reserve or goes to a platform wallet.
  -- Let's put everything in reserve for simplicity, technically increases backing.
  -- Actually, fee should ideally go to platform/issuer. 
  -- MVP: Fee stays in reserve (over-collateralizing the curve).
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
    amount_asset, amount_cash, price_at_execution, fee_paid
  ) values (
    v_user_id, p_market_id, v_market.asset_id, 'BUY',
    p_shares_to_buy, v_total_cost, (v_breakdown->>'price_per_share')::numeric, v_fee
  );
  
  return v_breakdown;
end;
$$ language plpgsql security definer;


-- TRANSACTION: MARKET SELL
create or replace function market_sell(
  p_market_id uuid,
  p_shares_to_sell numeric
) returns json as $$
declare
  v_user_id uuid;
  v_market record;
  v_breakdown json;
  v_total_proceeds numeric;
  v_fee numeric;
  v_user_shares numeric;
begin
  v_user_id := auth.uid();
  
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
  
  -- Debit Market Reserve (Payout proceeds)
  -- Note: We pay out the NET proceeds. Fee stays in reserve (or goes elsewhere).
  -- If we pay out `total_proceeds`, the `fee` portion remains in `reserve_balance` effectively.
  if v_market.reserve_balance < v_total_proceeds then
    raise exception 'Market insolvency risk (should not happen with bonding curve)';
  end if;
  
  update public.markets 
  set reserve_balance = reserve_balance - v_total_proceeds, -- Only remove what we pay out
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
    amount_asset, amount_cash, price_at_execution, fee_paid
  ) values (
    v_user_id, p_market_id, v_market.asset_id, 'SELL',
    p_shares_to_sell, v_total_proceeds, (v_breakdown->>'price_per_share')::numeric, v_fee
  );
  
  return v_breakdown;
end;
$$ language plpgsql security definer;
