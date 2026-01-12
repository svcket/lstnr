import { Artist, Prediction } from "../data/catalog";
import { getEntityMetrics } from "../lib/mockMetrics";

// --- TYPES ---

export type SortDirection = 'asc' | 'desc';

export interface FilterOption {
    label: string;
    value: string;
    isDefault?: boolean;
}

export interface FilterState {
    [key: string]: string | string[]; // Single value or multi-select array
}

// --- CONSTANTS ---

export const REGIONS = [
    { label: 'Global', value: 'Global', isDefault: true },
    { label: 'Africa', value: 'Africa' },
    { label: 'North America', value: 'North America' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Asia', value: 'Asia' },
    { label: 'South America', value: 'South America' },
];

export const TIME_FRAMES = [
    { label: '24 h', value: '24h', isDefault: true },
    { label: '7 d', value: '7d' },
    { label: '30 d', value: '30d' },
];

// ARTIST FILTERS
export const ARTIST_GENRES = [
    { label: 'All', value: 'All', isDefault: true }, // Logic: Empty array or 'All' = all
    { label: 'Afrobeats', value: 'Afrobeats' },
    { label: 'Hip-Hop', value: 'Hip-Hop' },
    { label: 'R&B', value: 'R&B' },
    { label: 'Pop', value: 'Pop' },
    { label: 'Amapiano', value: 'Amapiano' },
    { label: 'Alté', value: 'Alté' },
    { label: 'Dance', value: 'Dance' },
    { label: 'Gospel', value: 'Gospel' },
];

export const ARTIST_RANK_SORT = [
    { label: 'Top', value: 'rank_asc', isDefault: true }, // Default by rank
    { label: 'Gainers', value: 'change_desc' },
    { label: 'Losers', value: 'change_asc' },
    { label: 'Volume', value: 'vol_desc' },
    { label: 'Price', value: 'price_desc' },
];

// PREDICTION FILTERS
export const PRED_OUTCOMES = [
    { label: 'All', value: 'All', isDefault: true },
    { label: 'Binary', value: 'binary' },
    { label: 'Multi-range', value: 'multi-range' },
    { label: 'Live', value: 'live' },
];

export const PRED_END_DATES = [
    { label: 'Anytime', value: 'Anytime', isDefault: true },
    { label: 'Today', value: 'Today' },
    { label: 'This week', value: 'This week' },
    { label: 'This month', value: 'This month' },
    { label: 'Next 3 months', value: 'Next 3 months' },
];

export const EVENT_CATEGORIES = [
    { label: 'All', value: 'All', isDefault: true },
    { label: 'Music Releases', value: 'Music' }, // Mapping 'Music' to mock data category
    { label: 'Awards', value: 'Awards' },
    { label: 'Charts', value: 'Charts' },
    { label: 'Tours', value: 'Tours' },
    { label: 'Viral Moments', value: 'Viral' },
];

// --- LOGIC ---

export const filterArtists = (
    artists: Artist[], 
    filters: { genre?: string[], region?: string, search?: string },
    timeFrame: '24h' | '7d' | '30d' = '24h'
): Artist[] => {
    return artists.filter(a => {
        // Search
        if (filters.search && !a.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
        
        // Region
        if (filters.region && filters.region !== 'Global' && a.region !== filters.region) return false;
        
        // Genres (Multi-select: Match ANY)
        if (filters.genre && filters.genre.length > 0 && !filters.genre.includes('All')) {
            const hasMatch = filters.genre.some(g => a.genres?.includes(g));
            if (!hasMatch) return false;
        }

        return true;
    });
};

export const sortArtists = (artists: Artist[], sortType: string, timeFrameMultiplier: number = 1): Artist[] => {
    // We need metrics for sorting
    const artistsWithMetrics = artists.map(a => ({
        ...a,
        metrics: getEntityMetrics(a.id) // This is consistent per ID
    }));

    return artistsWithMetrics.sort((a, b) => {
        switch (sortType) {
            case 'change_desc': return b.metrics.changeTodayPct - a.metrics.changeTodayPct;
            case 'change_asc': return a.metrics.changeTodayPct - b.metrics.changeTodayPct;
            case 'vol_desc': return b.metrics.volume24h - a.metrics.volume24h; // Only 24h vol in metrics for now, we can scale it
            case 'price_desc': return b.metrics.price - a.metrics.price;
            case 'rank_asc': 
            default:
                // Fallback to original list order serves as "Rank" since catalog is ordered by importance roughly
                return 0; 
        }
    });
};

export const filterPredictions = (
    predictions: Prediction[],
    filters: { outcome?: string, date?: string, region?: string, category?: string, search?: string }
): Prediction[] => {
    const now = new Date();
    
    return predictions.filter(p => {
        // Search
        if (filters.search && !p.question.toLowerCase().includes(filters.search.toLowerCase())) return false;

        // Region
        if (filters.region && filters.region !== 'Global' && p.region !== filters.region) return false;

        // Category
        if (filters.category && filters.category !== 'All') {
            // Only multi-range has 'category' field explicitly in type, but we can assume 'Music' for most binary
            // For now, check if p has category property or default.
            const cat = 'category' in p ? p.category : 'Music'; // Fallback to Music for binary in this app context
            if (cat !== filters.category) return false;
        }

        // Outcome
        if (filters.outcome && filters.outcome !== 'All') {
            if (filters.outcome === 'live') {
                if (!p.isLive) return false;
            } else {
                if (p.marketType !== filters.outcome) return false;
            }
        }

        // Date Range
        if (filters.date && filters.date !== 'Anytime') {
            const deadline = new Date(p.deadline);
            switch (filters.date) {
                case 'Today':
                    return isSameDay(now, deadline);
                case 'This week':
                    // Simple check: within 7 days
                    return deadline >= now && deadline.getTime() <= now.getTime() + 7 * 24 * 60 * 60 * 1000;
                case 'This month':
                    return deadline.getMonth() === now.getMonth() && deadline.getFullYear() === now.getFullYear();
                case 'Next 3 months':
                    const threeMonths = new Date();
                    threeMonths.setMonth(now.getMonth() + 3);
                    return deadline >= now && deadline <= threeMonths;
            }
        }

        return true;
    });
};

// Date helper
const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};
