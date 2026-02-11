-- REMOTE SEED DATA
-- Run this in Supabase SQL Editor AFTER the Migration.

-- 1. Create Core Users (Admin, Label, Investor)
INSERT INTO auth.users (id, aud, role, email, email_confirmed_at, raw_user_meta_data, created_at)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@lstnr.com', now(), '{"username": "admin", "full_name": "System Admin"}', now()),
  ('a0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'label@lstnr.com', now(), '{"username": "universal", "full_name": "Universal Music"}', now()),
  ('a0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'investor@lstnr.com', now(), '{"username": "whale", "full_name": "Crypto Whale"}', now())
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure Profiles Exist
INSERT INTO public.profiles (id, username, display_name, is_verified_issuer)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'System Admin', false),
  ('a0000000-0000-0000-0000-000000000002', 'universal', 'Universal Music', true),
  ('a0000000-0000-0000-0000-000000000003', 'whale', 'Crypto Whale', false)
ON CONFLICT (id) DO UPDATE SET is_verified_issuer = EXCLUDED.is_verified_issuer;

-- 3. Set Admin Role
INSERT INTO public.admin_users (user_id) 
VALUES ('a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 4. Create Assets (Labels & Artists) with Metadata
-- IDs are deterministically generated UUIDs (simplified for readability here, in prod use uuid_generate_v4())

-- LABELS
INSERT INTO public.assets (id, issuer_id, issuer_type, name, symbol, total_supply, circulating_supply, status, description, avatar_url, metadata)
VALUES 
-- UMG
(
  'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'LABEL', 'Universal Music Group', 'UMG', 1000000, 1000, 'ACTIVE',
  'The world''s leading music company.', 'https://ui-avatars.com/api/?name=Universal+Music&background=000&color=fff&size=256',
  '{"links": {"website": "https://universalmusic.com"}, "labelBio": "We shape culture through the power of artistry.", "signedArtists": ["b0000000-0000-0000-0000-000000000103"]}'
),
-- Death Row
(
  'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'LABEL', 'Death Row Records', 'DEATH', 1000000, 5000, 'ACTIVE',
  'West Coast hip-hop legends.', 'https://ui-avatars.com/api/?name=Death+Row&background=000&color=fff&size=256',
  '{"links": {"website": "https://deathrow.com"}, "labelBio": "The most dangerous record label in history.", "signedArtists": ["b0000000-0000-0000-0000-000000000101"]}'
),
-- OVO Sound
(
  'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'LABEL', 'OVO Sound', 'OVO', 1000000, 2500, 'ACTIVE',
  'The Toronto Sound.', 'https://ui-avatars.com/api/?name=OVO&background=000&color=F5A623&size=256',
  '{"links": {"website": "https://ovosound.com"}, "labelBio": "Founded by Drake, Oliver El-Khatib, and 40.", "signedArtists": ["b0000000-0000-0000-0000-000000000102"]}'
)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- ARTISTS
INSERT INTO public.assets (id, issuer_id, issuer_type, name, symbol, total_supply, circulating_supply, status, description, avatar_url, metadata)
VALUES 
-- Kanye West (a1)
(
  'b0000000-0000-0000-0000-000000000101', 'a0000000-0000-0000-0000-000000000002', 'ARTIST', 'Kanye West', 'YZY', 1000000, 50000, 'ACTIVE',
  'A visionary artist, producer, and fashion icon.', 
  'https://ui-avatars.com/api/?name=Kanye+West&background=000&color=fff&size=256',
  '{"links": {"spotify": "https://spotify.com/kanyewest", "website": "https://kanyewest.com"}, "genres": ["Hip-Hop", "Pop"], "region": "North America", "createdBy": {"name": "Roc Nation", "avatarUrl": "https://ui-avatars.com/api/?name=Roc", "isVerified": true}}'
),
-- Drake (a2)
(
  'b0000000-0000-0000-0000-000000000102', 'a0000000-0000-0000-0000-000000000002', 'ARTIST', 'Drake', '6GOD', 1000000, 75000, 'ACTIVE',
  'Canadian rapper, singer, and songwriter.', 
  'https://ui-avatars.com/api/?name=Drake&background=F5A623&color=000&size=256',
  '{"links": {"spotify": "https://spotify.com/drake", "instagram": "https://instagram.com/champagnepapi"}, "genres": ["Hip-Hop", "R&B"], "region": "North America", "createdBy": {"name": "Lil Wayne", "avatarUrl": "https://ui-avatars.com/api/?name=Weezy", "isVerified": true}}'
),
-- Taylor Swift (a3)
(
  'b0000000-0000-0000-0000-000000000103', 'a0000000-0000-0000-0000-000000000002', 'ARTIST', 'Taylor Swift', 'TS', 1000000, 90000, 'ACTIVE',
  'American singer-songwriter known for narrative songs.', 
  'https://ui-avatars.com/api/?name=Taylor+Swift&background=E0115F&color=fff&size=256',
  '{"links": {"website": "https://taylorswift.com", "spotify": "https://spotify.com/taylorswift"}, "genres": ["Pop", "Country"], "region": "North America", "createdBy": {"name": "Scott Borchetta", "avatarUrl": "https://ui-avatars.com/api/?name=Scott", "isVerified": false}}'
),
-- The Weeknd (a4)
(
  'b0000000-0000-0000-0000-000000000104', 'a0000000-0000-0000-0000-000000000002', 'ARTIST', 'The Weeknd', 'XO', 1000000, 60000, 'ACTIVE',
  'Canadian singer-songwriter known for his falsetto.', 
  'https://ui-avatars.com/api/?name=The+Weeknd&background=ff0000&color=000&size=256',
  '{"links": {"website": "https://theweeknd.com"}, "genres": ["R&B", "Pop"], "region": "North America", "createdBy": {"name": "XO", "avatarUrl": "https://ui-avatars.com/api/?name=XO", "isVerified": true}}'
),
-- Bad Bunny (a6)
(
  'b0000000-0000-0000-0000-000000000106', 'a0000000-0000-0000-0000-000000000002', 'ARTIST', 'Bad Bunny', 'BB', 1000000, 55000, 'ACTIVE',
  'Puerto Rican rapper and singer. King of Latin Trap.', 
  'https://ui-avatars.com/api/?name=Bad+Bunny&background=FFFF00&color=000&size=256',
  '{"links": {"instagram": "https://instagram.com/badbunnypr"}, "genres": ["Latin", "Reggaeton"], "region": "South America", "createdBy": {"name": "Rimas", "avatarUrl": "https://ui-avatars.com/api/?name=Rimas", "isVerified": true}}'
)
ON CONFLICT (id) DO UPDATE SET metadata = EXCLUDED.metadata;

-- 5. Establish Markets for All Assets
INSERT INTO public.markets (id, asset_id, curve_type, base_price, slope, reserve_balance, circulating_supply)
SELECT 
  ('c0000000-0000-0000-0000-' || substring(id::text from 25))::uuid, -- Deterministic Market ID based on Asset ID suffix
  id,
  'LINEAR',
  10,
  0.1,
  15000,
  circulating_supply
FROM public.assets
ON CONFLICT (asset_id) DO NOTHING;

-- 6. Fund Investor Wallet
INSERT INTO public.ledger_balances (user_id, kind, balance)
VALUES ('a0000000-0000-0000-0000-000000000003', 'CASH', 50000)
ON CONFLICT (user_id, kind, asset_id) DO UPDATE SET balance = 50000;

-- 7. Create Prediction Market
INSERT INTO public.prediction_markets (id, asset_id, market_type, question, outcomes, deadline, status)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001', -- Link to UMG
  'BINARY',
  'Will UMG sign Taylor Swift before 2026?',
  '["YES", "NO"]'::jsonb,
  now() + interval '1 year',
  'OPEN'
) ON CONFLICT (id) DO NOTHING;
