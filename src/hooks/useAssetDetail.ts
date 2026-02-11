
import { useState, useEffect } from 'react';
import { getArtistById, getLabelById } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';
import { MarketRepository, AssetWithMarket } from '../services/supabase/repositories/marketRepo';
import { USE_SUPABASE, checkSupabaseConnection, supabase } from '../services/supabase/client';

export const useAssetDetail = (id: string, type: 'ARTIST' | 'LABEL') => {
    const [loading, setLoading] = useState(true);
    const [asset, setAsset] = useState<any | null>(null);
    const [metrics, setMetrics] = useState<any | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            // 1. Mock Mode
            if (!USE_SUPABASE) {
                if (mounted) {
                    const data = type === 'ARTIST' ? getArtistById(id) : getLabelById(id);
                    setAsset(data);
                    if (data) setMetrics(getEntityMetrics(id));
                    setLoading(false);
                }
                return;
            }

            // 2. Supabase Mode
            try {
                const connected = await checkSupabaseConnection();
                if (!connected) throw new Error('Not connected');

                const data = await MarketRepository.getAssetById(id);

                if (mounted && data) {
                    // Map to UI model
                    setAsset({
                        id: data.id,
                        name: data.name,
                        symbol: data.symbol,
                        avatarUrl: data.avatar_url || 'https://via.placeholder.com/150',
                        description: data.description,
                        // Rich metadata from JSONB column
                        bio: data.metadata?.bio || data.description || '',
                        labelBio: data.metadata?.labelBio || data.description || '',
                        signedArtists: data.metadata?.signedArtists || [],
                        links: data.metadata?.links || {},
                        genres: data.metadata?.genres || [],
                        region: data.metadata?.region || 'Global',
                        createdBy: data.metadata?.createdBy,

                        // Add other fields as needed by UI
                        marketId: data.market?.id, // Store for trading later
                    });

                    // Calculate real metrics from market data
                    if (data.market) {
                        const price = data.market.base_price + (data.market.slope * data.market.circulating_supply);
                        const mcap = price * data.market.circulating_supply;
                        setMetrics({
                            price,
                            marketCap: mcap,
                            changeTodayPct: 0, // Todo: Realtime
                            volume24h: 0, // Todo: Realtime
                            holders: 0, // Todo: Count holders
                            rank: 0,
                            momentum: 'Neutral', // Placeholder
                            marketConfidenceScore: {
                                value: data.mcs?.score || 50,
                                level: 'Neutral' // Derive level from score if needed
                            },
                            circulatingSupply: data.market.circulating_supply,
                            ath: price * 1.5 // Placeholder
                        });
                    }
                }
            } catch (err) {
                console.warn('Error fetching asset detail:', err);
                // Fallback to mock on error? Or just null?
                // Let's fallback for safety during transition
                if (mounted) {
                    const data = type === 'ARTIST' ? getArtistById(id) : getLabelById(id);
                    setAsset(data);
                    if (data) setMetrics(getEntityMetrics(id));
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        // 3. Realtime Subscription for Market Data (Price)
        let subscription: any = null;
        if (USE_SUPABASE) {
            subscription = supabase
                .channel(`asset-${id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'markets',
                        filter: `asset_id=eq.${id}`
                    },
                    (payload) => {
                        console.log('Realtime Market Update:', payload);
                        fetchData(); // Simplest approach: re-fetch to get consistent state
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'mcs_scores',
                        filter: `asset_id=eq.${id}`
                    },
                    (payload) => {
                        console.log('Realtime MCS Update:', payload);
                        fetchData();
                    }
                )
                .subscribe();
        }

        return () => {
            mounted = false;
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [id, type]);

    return { asset, metrics, loading };
};
