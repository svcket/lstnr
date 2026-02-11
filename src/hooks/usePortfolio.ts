
import { useState, useEffect } from 'react';
import { USE_SUPABASE, checkSupabaseConnection, supabase } from '../services/supabase/client';
import { LedgerRepository } from '../services/supabase/repositories/ledgerRepo';
import { useAuth } from '../context/AuthContext';
// NOTE: useAuth provides the mocked user. 
// For Supabase, we need the REAL user ID. 
// If `USE_SUPABASE`, we might need to assume a hardcoded ID for now (The Investor Seed ID) 
// or integrate real Auth. 
// As per instructions, we are doing a "SAFE dual-run". 
// I will hardcode the Seed Investor ID for the "Connected" state if no real auth user is present.

const SEED_INVESTOR_ID = 'a0000000-0000-0000-0000-000000000003';

// Mock Data imports
import { getPortfolio, getArtistById } from '../data/catalog';

// Fallback constant since MOCK_USER was removed
const MOCK_CASH_BALANCE = 12540.50;

export const usePortfolio = () => {
    const [loading, setLoading] = useState(true);
    const [cashBalance, setCashBalance] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [holdings, setHoldings] = useState<any[]>([]);
    const { user } = useAuth(); // Existing mock auth context

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            // 1. Mock Mode
            if (!USE_SUPABASE) {
                if (mounted) {
                    const mockPortfolio = getPortfolio().map(item => {
                        const artist = getArtistById(item.artistId);
                        const currentPrice = 15; // Mock
                        const value = item.shares * currentPrice;
                        return {
                            id: item.artistId,
                            assetId: item.artistId,
                            name: artist?.name || 'Unknown',
                            symbol: artist?.symbol || '???',
                            avatarUrl: artist?.avatarUrl || '',
                            shares: item.shares,
                            avgEntry: item.avgBuyPrice,
                            currentPrice: currentPrice,
                            value: value,
                            pnl: value - (item.shares * item.avgBuyPrice),
                            pnlPct: ((currentPrice - item.avgBuyPrice) / item.avgBuyPrice) * 100
                        };
                    });

                    setCashBalance(user?.balance || MOCK_CASH_BALANCE);
                    setPortfolioValue(mockPortfolio.reduce((acc, i) => acc + i.value, 0));
                    setHoldings(mockPortfolio);
                    setLoading(false);
                }
                return;
            }

            // 2. Supabase Mode
            try {
                const connected = await checkSupabaseConnection();
                if (!connected) throw new Error('Not connected');

                // Use real ID if available, else seed ID
                const userId = user?.id || SEED_INVESTOR_ID;

                const cash = await LedgerRepository.getCashBalance(userId);
                const assets = await LedgerRepository.getPortfolio(userId);

                // Compute total value
                let totalAssetValue = 0;
                const mappedHoldings = assets.map(item => {
                    // Calc current value
                    const price = item.market ?
                        (item.market.base_price + (item.market.slope * item.market.circulating_supply)) : 0;
                    const value = item.balance * price;
                    totalAssetValue += value;

                    return {
                        id: item.asset_id, // Navigation ID
                        assetId: item.asset_id,
                        marketId: item.market?.id, // Added for trading
                        name: item.asset?.name || 'Unknown',
                        symbol: item.asset?.symbol || '???',
                        avatarUrl: item.asset?.avatar_url || 'https://via.placeholder.com/150',
                        shares: item.balance,
                        avgEntry: 0, // Ledger doesn't track this efficiently yet (needs transactions agg), use 0 for now
                        currentPrice: price,
                        value: value,
                        pnl: 0, // Todo: Diff vs avgEntry
                        pnlPct: 0
                    };
                });

                if (mounted) {
                    setCashBalance(cash);
                    setPortfolioValue(totalAssetValue);
                    setHoldings(mappedHoldings);
                }

            } catch (err) {
                console.warn('Error fetching portfolio:', err);
                // Fallback
                if (mounted) {
                    setCashBalance(MOCK_CASH_BALANCE);
                    setHoldings([]);
                    setLoading(false);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadData();

        // 3. Realtime Subscription
        let subscription: any = null;
        if (USE_SUPABASE) {
            const userId = user?.id || SEED_INVESTOR_ID;
            subscription = supabase
                .channel('portfolio-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*', // INSERT, UPDATE, DELETE
                        schema: 'public',
                        table: 'ledger_balances',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        console.log('Realtime Portfolio Update:', payload);
                        loadData(); // Re-fetch all to be safe and simple
                    }
                )
                .subscribe();
        }

        return () => {
            mounted = false;
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [user]); // Re-fetch if user changes

    return { loading, cashBalance, portfolioValue, holdings };
};
