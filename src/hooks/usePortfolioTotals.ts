import { useMemo } from 'react';
import { getPortfolio, getPredictionPortfolio, getArtistById } from '../data/catalog';
import { getEntityMetrics } from '../lib/mockMetrics';

export const usePortfolioTotals = () => {
    const artistHoldings = getPortfolio();
    const predictionHoldings = getPredictionPortfolio();

    const totals = useMemo(() => {
        // Calculate Artists Value (Current Price * Shares)
        let artistTotal = 0;
        artistHoldings.forEach(item => {
            const artist = getArtistById(item.artistId);
            if (artist) {
                const metrics = getEntityMetrics(artist.id);
                // Use current price from metrics, fallback to avgBuyPrice if mocked metrics fail
                const price = metrics.price || item.avgBuyPrice; 
                artistTotal += price * item.shares;
            }
        });

        // Calculate Predictions Value
        const predictionTotal = predictionHoldings.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalArtistsValue: artistTotal,
            totalPredictionsValue: predictionTotal
        };
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return {
        artistsValue: formatCurrency(totals.totalArtistsValue),
        predictionsValue: formatCurrency(totals.totalPredictionsValue)
    };
};
