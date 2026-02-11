
import { supabase } from '../client';
import { Database } from '../types';

export type LedgerBalance = Database['public']['Tables']['ledger_balances']['Row'] & {
    asset?: Database['public']['Tables']['assets']['Row'];
    market?: Database['public']['Tables']['markets']['Row'];
};

export const LedgerRepository = {
    /**
     * Get User Cash Balance
     */
    async getCashBalance(userId: string): Promise<number> {
        const { data, error } = await supabase
            .from('ledger_balances')
            .select('balance')
            .eq('user_id', userId)
            .eq('kind', 'CASH')
            .maybeSingle(); // Use maybeSingle to avoid 406 if row doesn't exist yet (though seed ensures it)

        if (error) {
            console.error('Error fetching cash balance:', error);
            return 0; // Safe default
        }

        return (data as any)?.balance || 0;
    },

    /**
     * Get User Portfolio (Assets)
     */
    async getPortfolio(userId: string): Promise<LedgerBalance[]> {
        // Join with assets AND markets to get current price for value calc
        const { data, error } = await supabase
            .from('ledger_balances')
            .select(`
        *,
        asset:assets(*),
        market:markets(*)
      `)
            .eq('ledger_balances.user_id', userId)
            .eq('ledger_balances.kind', 'ASSET')
            .gt('ledger_balances.balance', 0); // Only positive balances

        if (error) {
            console.error('Error fetching portfolio:', error);
            return [];
        }

        // Normalize data (Supabase joins return arrays or objects)
        return (data || []).map((row: any) => ({
            ...row,
            asset: Array.isArray(row.asset) ? row.asset[0] : row.asset,
            market: Array.isArray(row.market) ? row.market[0] : row.market,
        }));
    }
};
