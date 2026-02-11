# Backend Integration Guide

## 1. Quick Start
The backend is now fully implemented in Supabase (Postgres).
The core logic resides in **PL/pgSQL RPC functions**, not standard REST Endpoints.

**Do not try to INSERT into `ledger_balances` directly from the client. It will fail.**

## 2. API Surface (RPCs)

### Buy Shares
**Function**: `market_buy`
```typescript
const { data, error } = await supabase.rpc('market_buy', {
  p_market_id: 'uuid-of-market',
  p_shares_to_buy: 10,
  p_client_tx_id: 'unique-uuid-v4' // Optional but recommended for idempotency
});
```

### Sell Shares
**Function**: `market_sell`
```typescript
const { data, error } = await supabase.rpc('market_sell', {
  p_market_id: 'uuid-of-market',
  p_shares_to_sell: 5,
  p_client_tx_id: 'unique-uuid-v4'
});
```

### Place Prediction
**Function**: `place_prediction`
```typescript
const { data, error } = await supabase.rpc('place_prediction', {
  p_prediction_id: 'uuid-of-prediction-market',
  p_outcome_label: 'YES',
  p_stake_amount: 50.00,
  p_client_tx_id: 'unique-uuid-v4'
});
```

## 3. Data Replacements
Replace your mock API calls with real DB queries:

| Mock Concept | Real Table | Query |
| :--- | :--- | :--- |
| `User.portfolio` | `ledger_balances` | `.from('ledger_balances').select('*, assets(*)').eq('kind', 'ASSET')` |
| `User.cash` | `ledger_balances` | `.from('ledger_balances').select('balance').eq('kind', 'CASH')` |
| `Market.price` | `markets` | Calculate via `base + slope * supply` OR use helper `rpc('get_buy_cost_breakdown', { p_amount: 1 })` |
| `MCS Score` | `mcs_scores` | `.from('mcs_scores').select('*').eq('asset_id', assetId)` |

## 4. Testing
- **Local Seed**: Run `supabase start` to load the seed data (Admin, Label, Investor).
- **Investor User**: ID `a0000000-0000-0000-0000-000000000003` (Has $50k Cash).
