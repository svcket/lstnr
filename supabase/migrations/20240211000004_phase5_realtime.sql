-- Phase 5: Enable Realtime
-- This migration enables Supabase Realtime for Markets (Price), Ledger (Balances), and MCS Scores.

-- 1. Enable publication for 'markets' (updates on base_price, slope, circulating_supply -> price changes)
alter publication supabase_realtime add table markets;

-- 2. Enable publication for 'ledger_balances' (updates on user balances)
alter publication supabase_realtime add table ledger_balances;

-- 3. Enable publication for 'mcs_scores' (updates on asset scores)
alter publication supabase_realtime add table mcs_scores;

-- Note: RLS policies still apply! Users will only receive updates for rows they are allowed to SELECT.
-- For ledger_balances, users can typically only see their OWN balance due to RLS.
-- For markets, everyone can see.
