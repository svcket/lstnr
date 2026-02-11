
import { useState, useEffect } from 'react';
import { getAllArtists, getAllLabels, getAllPredictions } from '../data/catalog';
import { MarketRepository, AssetWithMarket } from '../services/supabase/repositories/marketRepo';
import { USE_SUPABASE, checkSupabaseConnection } from '../services/supabase/client';

// Map Supabase Asset to UI Entity
const mapAssetToEntity = (asset: AssetWithMarket) => {
    return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        avatarUrl: asset.avatar_url || 'https://via.placeholder.com/150', // Fallback
        price: asset.market ? asset.market.base_price + (asset.market.slope * asset.market.circulating_supply) : 0,
        // ^ Simplified price calc for list view, ideal is RPC or memoized calc
        changeTodayPct: 0, // TODO: Realtime or 24h snapshot needed for this
        volume24h: 0, // TODO: Aggregated volume
        isVerified: true, // If it's in the list it's verified by definition of query
    };
};

export const useExploreData = () => {
    const [loading, setLoading] = useState(true);
    const [artists, setArtists] = useState<any[]>([]);
    const [labels, setLabels] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            // 1. Check Feature Flag
            if (!USE_SUPABASE) {
                if (mounted) {
                    setArtists(getAllArtists());
                    setLabels(getAllLabels());
                    setPredictions(getAllPredictions());
                    setLoading(false);
                }
                return;
            }

            // 2. Try Supabase
            try {
                const connected = await checkSupabaseConnection();
                if (mounted) setIsSupabaseConnected(connected);

                if (!connected) {
                    console.warn('Supabase not connected, falling back to mocks');
                    throw new Error('Connection failed');
                }

                // Fetch Assets
                const assets = await MarketRepository.getTrendingAssets();

                // Split into Artists and Labels
                const fetchedArtists = assets.filter(a => a.issuer_type === 'ARTIST').map(mapAssetToEntity);
                const fetchedLabels = assets.filter(a => a.issuer_type === 'LABEL').map(mapAssetToEntity);

                // Fetch Predictions (Todo: Add PredictionRepo, for now fallback or empty)
                // const fetchedPredictions = await PredictionRepository.getTopPredictions(); 
                const fetchedPredictions = getAllPredictions(); // Fallback for now until Phase 1.5

                if (mounted) {
                    setArtists(fetchedArtists);
                    setLabels(fetchedLabels);
                    setPredictions(fetchedPredictions);
                }

            } catch (err) {
                console.warn('Failed to load explore data from Supabase, falling back to mocks', err);
                // Fallback
                if (mounted) {
                    setArtists(getAllArtists());
                    setLabels(getAllLabels());
                    setPredictions(getAllPredictions());
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchData();

        return () => { mounted = false; };
    }, []);

    return { loading, artists, labels, predictions, isSupabaseConnected };
};
