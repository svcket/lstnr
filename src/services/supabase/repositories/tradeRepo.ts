
import { supabase } from '../client';
import { Database } from '../types';
import { v4 as uuidv4 } from 'uuid'; // We need a UUID generator for client_tx_id. 
// If 'uuid' isn't installed, we can use a simple random string or install it. 
// Expo usually has crypto.randomUUID but let's use a safe helper.
// I'll assume uuid is not installed and write a simple helper.

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const TradeRepository = {
    /**
     * Buy Shares
     * @param marketId Market ID (not asset ID)
     * @param shares Amount of shares to buy
     */
    async buyShares(marketId: string, shares: number): Promise<any> {
        const clientTxId = generateUUID();
        console.log(`[TradeRepo] Buy ${shares} shares on market ${marketId}, txId: ${clientTxId}`);

        const { data, error } = await supabase.rpc('market_buy', {
            p_market_id: marketId,
            p_shares_to_buy: shares,
            p_client_tx_id: clientTxId
        } as any);

        if (error) {
            console.error('[TradeRepo] Buy Error:', error);
            throw error;
        }
        return data;
    },

    /**
     * Sell Shares
     * @param marketId Market ID
     * @param shares Amount of shares to sell
     */
    async sellShares(marketId: string, shares: number): Promise<any> {
        const clientTxId = generateUUID();
        console.log(`[TradeRepo] Sell ${shares} shares on market ${marketId}, txId: ${clientTxId}`);

        const { data, error } = await supabase.rpc('market_sell', {
            p_market_id: marketId,
            p_shares_to_sell: shares,
            p_client_tx_id: clientTxId
        } as any);

        if (error) {
            console.error('[TradeRepo] Sell Error:', error);
            throw error;
        }
        return data;
    },

    /**
     * Get Buy Quote (Cost Estimate)
     * HELPER RPC: get_buy_cost_breakdown(p_market_id, p_shares_to_buy)
     */
    async getBuyQuote(marketId: string, shares: number): Promise<{ total_cost: number, new_price: number, fee: number }> {
        const { data, error } = await supabase.rpc('get_buy_cost_breakdown', {
            p_market_id: marketId,
            p_shares_to_buy: shares
        } as any);

        if (error) throw error;
        return data; // Returns JSON object { total_cost, new_price, fee, ... }
    },

    /**
     * Get Sell Quote (Proceeds Estimate)
     * HELPER RPC: get_sell_proceeds_breakdown(p_market_id, p_shares_to_sell)
     */
    async getSellQuote(marketId: string, shares: number): Promise<{ total_proceeds: number, new_price: number, fee: number }> {
        const { data, error } = await supabase.rpc('get_sell_proceeds_breakdown', {
            p_market_id: marketId,
            p_shares_to_sell: shares
        } as any);

        if (error) throw error;
        return data;
    }
};
