export interface ChartPoint {
  date: string;
  value: number;
}

export interface Creator {
  name: string;
  avatar: string;
  badges: string[];
  ticker?: string;
  wallet?: string;
}

export interface ArtistMarket {
  id: string;
  name: string;
  ticker: string;
  avatar: string;
  heroImage?: string;
  
  price: number;
  ath: number;
  marketCap: number;
  volume24h: number;
  avgVolume7d: number;
  change24h: number; // Percent
  holders: number;
  holderChange7d: number; // Percent
  circulatingSupply: number;
  
  holdersList: Array<{
    id: string;
    name: string;
    avatar?: string;
    sharesOwned: number;
    followersCount: number;
    isFollowing: boolean;
  }>;
  
  bio: string;
  links?: Record<string, string>;
  
  // MCS Factors
  volatilityIndex: number; // 0-1, high is bad

  activityList: Array<{
    id: string;
    user: {
      username: string;
      avatarUrl: string;
      shares: number;
      followers: number;
      isFollowing: boolean;
      isSelf: boolean;
    };
    type: 'acquired' | 'released';
    deltaShares: number;
    symbol: string;
    percent: number;
    timestampLabel?: string;
  }>;
  
  predictionsList: Array<{
    id: string;
    question: string;
    yesPrice: number; // In cents (e.g. 58.5)
    noPrice: number;
    volume: number;
    chance: number; // 0-100
    resolvesAt: string;
  }>;
  
  creator: Creator;
  
  priceHistory: {
    '1m': ChartPoint[];
    '5m': ChartPoint[];
    '15m': ChartPoint[];
    '30m': ChartPoint[];
    'All': ChartPoint[];
  };
}

// Helpers
export const formatMoney = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatCompact = (val: number) => {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'm';
  if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'k';
  return '$' + val.toFixed(0);
};

// MCS Logic
// MCS = clamp(round(volumeScore + momentumScore + holderScore + volatilityScore), 0, 100)
export const computeMCS = (artist: ArtistMarket): number => {
  let score = 0;
  
  // 1. Volume Score (0-25)
  if (artist.volume24h >= artist.avgVolume7d) score += 22;
  else if (artist.volume24h >= artist.avgVolume7d * 0.5) score += 15;
  else score += 5;
  
  // 2. Momentum Score (0-25)
  if (artist.change24h > 10) score += 25;
  else if (artist.change24h > 0) score += 18;
  else if (artist.change24h > -5) score += 10;
  else score += 2;
  
  // 3. Holder Score (0-25)
  if (artist.holderChange7d > 5) score += 25;
  else if (artist.holderChange7d > 0) score += 15;
  else score += 5;
  
  // 4. Volatility Penalty (0-25... essentially inverted volatility)
  // Low vol = high score
  const stability = 1 - artist.volatilityIndex; // 0.8 means stable
  score += Math.round(stability * 25);
  
  return Math.min(100, Math.max(0, score));
};

// Mock Data Generator
const generateSeries = (basePrice: number, points: number, volatility: number): ChartPoint[] => {
  const data: ChartPoint[] = [];
  let current = basePrice;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility;
    current += change;
    data.push({ date: i.toString(), value: current });
  }
  return data;
};

const generateHolders = (count: number, totalShares: number) => {
  const holders = [];
  const names = ['username123', 'walletxyz.eth', 'artfan007', 'vibehunter', 'nftcollector', 'melodywave', 'creatormind', 'tokenlady', 'cryptoking', 'musiclover'];
  
  // Distribute shares (Power law)
  let remainingShares = totalShares;
  
  for (let i = 0; i < count; i++) {
    const isTop = i < 10;
    // Top holders have much more
    const share = isTop 
       ? Math.floor(remainingShares * (Math.random() * 0.1 + 0.05)) // 5-15%
       : Math.floor(remainingShares * (Math.random() * 0.01)); // Small amts
       
    remainingShares -= share;
    if (remainingShares <= 0) break;

    holders.push({
      id: `h_${i}`,
      name: names[i % names.length] + (i > 9 ? `_${i}` : ''),
      avatar: `https://i.pravatar.cc/150?u=h_${i}`,
      sharesOwned: Math.max(1, share), // Ensure at least 1
      followersCount: Math.floor(Math.random() * 500),
      isFollowing: Math.random() > 0.8, // 20% chance following
    });
  }
  
  return holders.sort((a, b) => b.sharesOwned - a.sharesOwned);
};

const generateActivity = (count: number) => {
  const items = [];
  const names = ['username123', 'walletxyz.eth', 'artfan007', 'vibehunter', 'nftcollector', 'melodywave', 'creatormind', 'tokenlady', 'bluenoise.eth', 'soundscaper'];
  
  for (let i = 0; i < count; i++) {
    const isAcquired = Math.random() > 0.4; // 60% acquired
    const isSelf = i === 2; // Fixed self item
    
    items.push({
      id: `act_${i}`,
      user: {
        username: names[i % names.length],
        avatarUrl: `https://i.pravatar.cc/150?u=act_${i}`,
        shares: Math.floor(Math.random() * 1000) + 50,
        followers: Math.floor(Math.random() * 500),
        isFollowing: Math.random() > 0.7,
        isSelf: isSelf,
      },
      type: isAcquired ? 'acquired' : 'released',
      deltaShares: 420, // Fixed as per mock image/request
      symbol: 'BIGT', // Fixed as per mock image
      percent: parseFloat((Math.random() * 3).toFixed(2)),
      timestampLabel: `${i * 15 + 2}m ago`, // Mock time
    } as const);
  }
  
  return items;
};

const generatePredictions = () => {
  return [
    {
      id: 'p1',
      question: 'Would Tomi Obanure release an album in 2025?',
      yesPrice: 5.8,
      noPrice: 94.5,
      volume: 369000,
      chance: 90,
      resolvesAt: '2025-12-31'
    },
    {
      id: 'p2',
      question: 'Would Tomi Obanure win the “Headies Next Rated Artist Award in 2026?”',
      yesPrice: 32.4,
      noPrice: 67.6,
      volume: 125000,
      chance: 27,
      resolvesAt: '2026-09-01'
    },
    {
      id: 'p3',
      question: 'Will Tomi Obanure appear on COLORS Studios by 2026?',
      yesPrice: 15.2,
      noPrice: 84.8,
      volume: 54000,
      chance: 15,
      resolvesAt: '2026-06-01'
    },
    {
      id: 'p4',
      question: 'Will Tomi Obanure appear on a project produced by Sarz in 2026?',
      yesPrice: 78.5,
      noPrice: 21.5,
      volume: 890000,
      chance: 78,
      resolvesAt: '2026-12-31'
    },
    {
      id: 'p5',
      question: 'Will Tomi Obanure hit 1M monthly listeners on Spotify by Q3 2025?',
      yesPrice: 45.0,
      noPrice: 55.0,
      volume: 42000,
      chance: 45,
      resolvesAt: '2025-09-30'
    }
  ];
};

export const MOCK_ARTIST: ArtistMarket = {
  id: 'a1',
  name: 'Neon Dust',
  ticker: '$DUST',
  avatar: 'https://i.pravatar.cc/150?u=a1',
  
  price: 45.20,
  ath: 58.00,
  marketCap: 10850, // 10.8k
  volume24h: 369000,
  avgVolume7d: 300000, 
  change24h: 12.5,
  holders: 1240,
  holderChange7d: 3.2,
  circulatingSupply: 240000,
  volatilityIndex: 0.2,
  
  holdersList: generateHolders(50, 240000),
  activityList: generateActivity(20),
  predictionsList: generatePredictions(),

  bio: 'Electronic avant-garde collective redefining the sound of the void.',
  links: {
    'Spotify': 'https://spotify.com',
    'Apple Music': 'https://apple.com',
    'YouTube': 'https://youtube.com',
    'X': 'https://x.com',
    'Instagram': 'https://instagram.com',
    'Discord': 'https://discord.com',
    'Website': 'https://neon-dust.com',
  },
  creator: {
    name: 'Tomi Obanure',
    avatar: 'https://i.pravatar.cc/150?u=tomi',
    badges: ['verified'],
    ticker: '$BIGT',
    wallet: '0x6...bgw5'
  },
  
  priceHistory: {
    '1m': generateSeries(45, 20, 0.2),
    '5m': generateSeries(44, 30, 0.5),
    '15m': generateSeries(40, 40, 1.0),
    '30m': generateSeries(38, 50, 2.0),
    'All': generateSeries(10, 100, 5.0),
  }
};

const LUNA_TIDE: ArtistMarket = {
  ...MOCK_ARTIST,
  id: 'a2',
  name: 'Luna Tide',
  ticker: '$TIDE',
  avatar: 'https://i.pravatar.cc/150?u=a2',
  price: 9.45,
  ath: 12.50,
  marketCap: 425000,
  change24h: -2.1,
  bio: 'Ethereal soundscapes straight from the depths of the ocean.',
  creator: { ...MOCK_ARTIST.creator, name: 'Sarah Waves', ticker: '$WAVE' },
  priceHistory: {
    '1m': generateSeries(9.45, 20, 0.1),
    '5m': generateSeries(9.50, 30, 0.2),
    '15m': generateSeries(9.60, 40, 0.5),
    '30m': generateSeries(10.00, 50, 0.5),
    'All': generateSeries(5, 100, 2.0),
  }
};

const STEEL_PULSE: ArtistMarket = {
  ...MOCK_ARTIST,
  id: 'a3',
  name: 'Steel Pulse',
  ticker: '$PULS',
  avatar: 'https://i.pravatar.cc/150?u=a3',
  price: 14.00,
  change24h: 1.2,
  marketCap: 84000,
  bio: 'Industrial rhythm mechanics building the future beat.',
  creator: { ...MOCK_ARTIST.creator, name: 'Rob Steel', ticker: '$ROB' },
  priceHistory: {
    '1m': generateSeries(14, 20, 0.1),
    '5m': generateSeries(13.9, 30, 0.3),
    '15m': generateSeries(13.8, 40, 0.5),
    '30m': generateSeries(13.5, 50, 0.8),
    'All': generateSeries(8, 100, 1.5),
  }
};

const MOCK_DB: Record<string, ArtistMarket> = {
  'a1': MOCK_ARTIST,
  'a2': LUNA_TIDE,
  'a3': STEEL_PULSE,
};

export const getArtistById = async (id: string): Promise<ArtistMarket> => {
  // Simulate API delay
  await new Promise(r => setTimeout(r, 500));
  return MOCK_DB[id] || MOCK_ARTIST;
};
