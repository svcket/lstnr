
// LSTNR Supabase Integration - Type Definitions
// Based on the migration schemas just implemented.

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    display_name: string | null
                    avatar_url: string | null
                    is_verified_issuer: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    is_verified_issuer?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    display_name?: string | null
                    avatar_url?: string | null
                    is_verified_issuer?: boolean
                    created_at?: string
                }
            }
            assets: {
                Row: {
                    id: string
                    issuer_id: string
                    issuer_type: 'ARTIST' | 'LABEL'
                    name: string
                    symbol: string
                    description: string | null
                    avatar_url: string | null
                    status: 'ACTIVE' | 'FROZEN' | 'DELISTED'
                    total_supply: number
                    circulating_supply: number
                    issuer_holdings_locked: number
                    created_at: string
                }
            }
            markets: {
                Row: {
                    id: string
                    asset_id: string
                    curve_type: 'LINEAR'
                    base_price: number
                    slope: number
                    reserve_balance: number
                    circulating_supply: number
                    fee_bps: number
                    status: 'ACTIVE' | 'PAUSED'
                    created_at: string
                }
            }
            ledger_balances: {
                Row: {
                    id: string
                    user_id: string
                    kind: 'CASH' | 'ASSET'
                    asset_id: string | null
                    balance: number
                    updated_at: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    market_id: string | null
                    asset_id: string | null
                    type: 'DEPOSIT' | 'WITHDRAW' | 'BUY' | 'SELL' | 'MINT' | 'PREDICT' | 'RESOLVE' | 'ADJUST'
                    amount_asset: number
                    amount_cash: number
                    price_at_execution: number
                    fee_paid: number
                    metadata: Record<string, any> | null
                    created_at: string
                    client_tx_id: string | null
                }
            }
            prediction_markets: {
                Row: {
                    id: string
                    asset_id: string
                    market_type: 'BINARY' | 'MULTIRANGE'
                    question: string
                    description: string | null
                    outcomes: any[] // JSON
                    resolver_type: 'ADMIN' | 'CURATOR' | 'ORACLE'
                    resolver_id: string | null
                    deadline: string
                    status: 'OPEN' | 'LOCKED' | 'RESOLVING' | 'RESOLVED' | 'VOID'
                    resolved_outcome: string | null
                    created_at: string
                }
            }
            prediction_positions: {
                Row: {
                    id: string
                    user_id: string
                    prediction_id: string
                    outcome_label: string
                    stake_amount: number
                    potential_payout: number | null
                    created_at: string
                }
            }
            mcs_scores: {
                Row: {
                    asset_id: string
                    score: number
                    breakdown: Record<string, any> | null
                    last_updated_at: string
                }
            }
        }
        Functions: {
            market_buy: {
                Args: { p_market_id: string; p_shares_to_buy: number; p_client_tx_id?: string }
                Returns: any // JSON
            }
            market_sell: {
                Args: { p_market_id: string; p_shares_to_sell: number; p_client_tx_id?: string }
                Returns: any // JSON
            }
            place_prediction: {
                Args: { p_prediction_id: string; p_outcome_label: string; p_stake_amount: number; p_client_tx_id?: string }
                Returns: any // JSON
            }
            get_buy_cost_breakdown: {
                Args: { p_market_id: string; p_shares_to_buy: number }
                Returns: any
            }
            get_sell_proceeds_breakdown: {
                Args: { p_market_id: string; p_shares_to_sell: number }
                Returns: any
            }
        }
    }
}
