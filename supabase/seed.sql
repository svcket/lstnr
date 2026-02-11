-- SEED DATA
-- Creates:
-- 1. Admin User (admin@lstnr.com)
-- 2. Verified Issuer (label@lstnr.com)
-- 3. Investor User (investor@lstnr.com)
-- 4. Initial Asset (LSTNR) & Market
-- 5. Initial Prediction Market

-- Note: We cannot easily insert into auth.users directly in all Supabase environments due to hashing.
-- But for local dev (Postgres), we can fake it or use a helper if available.
-- Standard approach: Insert into public.profiles directly if testing DB constraints, 
-- BUT profiles has FK to auth.users.
-- So we MUST insert into auth.users first.

INSERT INTO auth.users (id, email, raw_user_meta_data, created_at)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'admin@lstnr.com', '{"username": "admin", "full_name": "System Admin"}', now()),
  ('a0000000-0000-0000-0000-000000000002', 'label@lstnr.com', '{"username": "universal", "full_name": "Universal Music"}', now()),
  ('a0000000-0000-0000-0000-000000000003', 'investor@lstnr.com', '{"username": "whale", "full_name": "Crypto Whale"}', now())
ON CONFLICT (id) DO NOTHING;

-- Trigger should have created profiles. 
-- Let's update them to set roles.

-- 1. ADMIN
INSERT INTO public.admin_users (user_id) 
VALUES ('a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 2. ISSUER (Universal)
UPDATE public.profiles 
SET is_verified_issuer = true 
WHERE id = 'a0000000-0000-0000-0000-000000000002';

-- 3. ASSET (Created by Issuer)
INSERT INTO public.assets (id, issuer_id, issuer_type, name, symbol, total_supply, circulating_supply, status)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'LABEL',
  'Universal Music Group',
  'UMG',
  1000000,
  0,
  'ACTIVE'
) ON CONFLICT DO NOTHING;

-- 4. MARKET (Linked to Asset)
INSERT INTO public.markets (id, asset_id, curve_type, base_price, slope, reserve_balance)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'LINEAR',
  10, -- Start at $10
  0.1, -- Increase $0.10 per share
  0
) ON CONFLICT DO NOTHING;

-- 5. FUND INVESTOR (Cash Deposit)
INSERT INTO public.ledger_balances (user_id, kind, balance)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'CASH',
  50000 -- $50,000 start
) ON CONFLICT (user_id, kind, asset_id) 
DO UPDATE SET balance = 50000;

-- 6. PREDICTION MARKET
INSERT INTO public.prediction_markets (id, asset_id, market_type, question, outcomes, deadline, status)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'BINARY',
  'Will UMG sign Taylor Swift before 2026?',
  '["YES", "NO"]'::jsonb,
  now() + interval '1 year',
  'OPEN'
) ON CONFLICT DO NOTHING;
