
import { supabase } from '../client';
import { Database } from '../types';

export type AssetWithMarket = Database['public']['Tables']['assets']['Row'] & {
    metadata?: any; // Rich data from JSONB
    market: Database['public']['Tables']['markets']['Row'] | null;
    mcs: Database['public']['Tables']['mcs_scores']['Row'] | null;
};

export const MarketRepository = {
    /**
     * Fetch all active assets with their market data and MCS scores
     * Used for the Explore / Trending list
     */
    async getTrendingAssets(): Promise<AssetWithMarket[]> {
        const { data, error } = await supabase
            .from('assets')
            .select(`
        *,
        market:markets(*),
        mcs:mcs_scores(*)
      `)
            .eq('status', 'ACTIVE')
            .order('created_at', { ascending: false }) // Simple "newest" for now, ideally sort by volume/mcs
            .limit(20);

        if (error) {
            console.error('Error fetching trending assets:', error);
            throw error;
        }

        // Flatten/Normalize if needed, but returning raw joined data is fine for now
        // Supabase returns arrays for joins usually, but 1:1 relationships might be objects if configured.
        // Based on query, `market` and `mcs` might be arrays or objects depending on FK uniqueness.
        // Our schema has unique constraints, so Supabase (postgrest) infers object if we use the singular name in select?
        // Actually, typically it returns array unless `!inner` or specific mapping. 
        // Let's coerce safely.

        return (data || []).map((row: any) => ({
            ...row,
            market: Array.isArray(row.market) ? row.market[0] : row.market,
            mcs: Array.isArray(row.mcs) ? row.mcs[0] : row.mcs,
        })) as AssetWithMarket[];
    },

    /**
     * Fetch a single asset by ID (for Detail Page)
     */
    async getAssetById(id: string): Promise<AssetWithMarket | null> {
        const { data, error } = await supabase
            .from('assets')
            .select(`
        *,
        market:markets(*),
        mcs:mcs_scores(*)
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching asset details:', error);
            return null;
        }

        const safeData = data as any;
        return {
            ...safeData,
            market: Array.isArray(safeData.market) ? safeData.market[0] : safeData.market,
            mcs: Array.isArray(safeData.mcs) ? safeData.mcs[0] : safeData.mcs,
        };
    }
};
