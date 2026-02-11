-- FIX SCHEMA
-- Adds missing column 'circulating_supply' to 'markets' table
-- This allows the Seed Script and RPC functions to work correctly.

ALTER TABLE public.markets 
ADD COLUMN IF NOT EXISTS circulating_supply numeric default 0 check (circulating_supply >= 0);

-- Update existing markets to have 0 supply if null
UPDATE public.markets SET circulating_supply = 0 WHERE circulating_supply IS NULL;

-- Add metadata column for rich info (links, socials, etc.)
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
