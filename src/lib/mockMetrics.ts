export const seedFromId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Park-Miller Pseudo Random Number Generator
const PRNG = (seed: number) => {
  let _seed = seed % 2147483647;
  if (_seed <= 0) _seed += 2147483646;

  return () => {
    _seed = (_seed * 16807) % 2147483647;
    return (_seed - 1) / 2147483646;
  };
};

export const mockCurrency = (seed: number, min: number, max: number): number => {
  const rng = PRNG(seed);
  return min + rng() * (max - min);
};

export const mockPercent = (seed: number, min: number = -10, max: number = 25): number => {
  const rng = PRNG(seed + 123); // Offset seed slightly
  // Weighted towards positive for "growth" feel, but allowing negatives
  const raw = rng();
  // 60% chance of positive
  if (raw > 0.4) {
      return rng() * max;
  }
  return -1 * rng() * Math.abs(min);
};

export const mockInt = (seed: number, min: number, max: number): number => {
  const rng = PRNG(seed + 999);
  return Math.floor(min + rng() * (max - min));
};

export const mockSeries = (seed: number, points: number = 20): number[] => {
    const rng = PRNG(seed + 555);
    const startValue = 100 + rng() * 500; // Random start price
    const data: number[] = [startValue];
    
    let currentValue = startValue;
    for(let i=1; i<points; i++) {
        const volatility = 0.05; // 5% swing max
        const change = (rng() - 0.5) * 2 * volatility;
        currentValue = currentValue * (1 + change);
        data.push(currentValue);
    }
    return data;
};

// New helpers for consistent derivatons
export const getEntityMetrics = (id: string) => {
    const seed = seedFromId(id);
    const price = mockCurrency(seed, 0.5, 500);
    const marketCap = mockInt(seed, 1_000_000, 500_000_000);
    const volume24h = mockInt(seed, 50_000, marketCap * 0.2);
    const holders = mockInt(seed, 500, 150_000);
    const changeTodayPct = mockPercent(seed);
    const ath = price * (1 + mockPercent(seed + 1, 0, 50) / 100); // ATH is always >= price
    
    // Confidence Score 0-100
    const scoreVal = mockInt(seed + 7, 40, 98);
    const scoreLevel = scoreVal > 80 ? 'High' : scoreVal > 50 ? 'Medium' : 'Low';

    const momentumOpts = ["Bullish", "Neutral", "Bearish"];
    const momentum = momentumOpts[seed % 3];

    return {
        price,
        marketCap,
        volume24h,
        holders,
        changeTodayPct,
        ath,
        marketConfidenceScore: { value: scoreVal, level: scoreLevel },
        momentum,
        circulatingSupply: Math.floor(marketCap / price)
    };
};

// --- HOLDERS GENERATOR ---

export interface Holder {
  id: string;
  name: string;
  avatar: string;
  sharesOwned: number;
  followersCount: number;
  isFollowing: boolean;
}

export const getHoldersList = (entityId: string, circulatingSupply: number): Holder[] => {
    // Deterministic seed simulation
    // We want a stable list for a given ID
    let seed = 0;
    for (let i = 0; i < entityId.length; i++) {
        seed = (seed << 5) - seed + entityId.charCodeAt(i);
    }
    seed = Math.abs(seed);

    const count = 20 + (seed % 30); // 20-50 visible holders
    
    const holders: Holder[] = [];
    const names = ['crypto_king', 'nft_collector', 'music_fan_01', 'whale_watcher', 'diamond_hands', 'artist_supporter', 'web3_native', 'dao_member'];
    
    let remainingShares = circulatingSupply;
    
    for (let i = 0; i < count; i++) {
        // Top holders hold 2-5% each, others hold tiny amounts
        const factor = (i < 5) ? (0.02 + (seed % 5)/100) : 0.001;
        const share = Math.max(1, Math.floor(remainingShares * factor));
            
        remainingShares -= share;
        if (remainingShares <= 0) break;
        
        holders.push({
            id: `h_${entityId}_${i}`,
            name: names[(seed + i) % names.length] + (i > 3 ? `_${i}` : ''),
            avatar: `https://i.pravatar.cc/150?u=h_${entityId}_${i}`,
            sharesOwned: share,
            followersCount: (seed * (i + 1) * 33) % 1000,
            isFollowing: (seed + i) % 3 === 0
        });
    }
    
    return holders.sort((a, b) => b.sharesOwned - a.sharesOwned);
};
