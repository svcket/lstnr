import { COLORS } from '../constants/theme';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  balance: number;
  // Added fields for Auth Flow
  email?: string;
  bio?: string;
  joinedAt?: string;
  followers?: number;
  following?: number;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  sharePrice: number;
  change: number; // percentage
  holders: number;
  bio: string;
}

export interface ArtistMarket extends Artist {
  ticker: string;
  marketCap: number;
  ath: number;
  volume24h: number;
  circulatingSupply: number;
  mcs: number; // 0-100
  momentum: 'high' | 'medium' | 'low';
  priceHistory: { time: string; value: number }[];
  links: { [key: string]: string };
  creator: {
    name: string;
    avatar: string;
    badges: string[];
  };
}

export interface ActivityItem {
  id: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'PREDICTION';
  title: string;
  timestamp: string;
  amount: string;
  iconType: 'in' | 'out' | 'predict' | 'trade';
}

export interface Market {
  id: string;
  question: string;
  volume: number;
  yesPrice: number;
  noPrice: number;
  endsAt: string;
  image: string;
  status: 'OPEN' | 'LOCKED' | 'RESOLVED';
}

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatar: 'https://i.pravatar.cc/300?u=u1',
  balance: 1250.50,
  email: 'alex@example.com',
  bio: 'Music explorer.',
  joinedAt: '2023-01-01T00:00:00Z',
  followers: 120,
  following: 45,
};

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'a1',
    name: 'Neon Dust',
    avatar: 'https://i.pravatar.cc/300?u=a1',
    verified: true,
    sharePrice: 45.20,
    change: 12.5,
    holders: 1240,
    bio: 'Electronic avant-garde collective redefining the sound of the void.',
  },
  {
    id: 'a2',
    name: 'Luna Tide',
    avatar: 'https://i.pravatar.cc/300?u=a2',
    verified: true,
    sharePrice: 28.90,
    change: -2.3,
    holders: 890,
    bio: 'Dream pop for the digital age.',
  },
  {
    id: 'a3',
    name: 'Steel Pulse',
    avatar: 'https://i.pravatar.cc/300?u=a3',
    verified: false,
    sharePrice: 12.10,
    change: 5.4,
    holders: 350,
    bio: 'Industrial beats from the underground.',
  },
];

export const MOCK_ARTIST_DETAILS: Record<string, ArtistMarket> = {
  'a1': {
    ...MOCK_ARTISTS[0],
    ticker: '$DUST',
    marketCap: 10800,
    ath: 15800,
    volume24h: 369000,
    circulatingSupply: 240000,
    mcs: 82,
    momentum: 'high',
    priceHistory: Array.from({ length: 20 }, (_, i) => ({
        time: new Date(Date.now() - i * 3600000).toISOString(),
        value: 40 + Math.random() * 10
    })).reverse(),
    links: {
        'Spotify': 'https://spotify.com',
        'Apple Music': 'https://apple.com',
        'Instagram': 'https://instagram.com',
        'X': 'https://x.com'
    },
    creator: {
        name: 'LSTNR DAO',
        avatar: 'https://i.pravatar.cc/150?u=dao',
        badges: ['Official', 'Verified']
    }
  },
  'a2': {
    ...MOCK_ARTISTS[1],
    ticker: '$LUNA',
    marketCap: 8900,
    ath: 12000,
    volume24h: 150000,
    circulatingSupply: 180000,
    mcs: 35, // Low MCS for testing warning
    momentum: 'medium',
    priceHistory: [],
    links: {
        'Spotify': 'https://spotify.com',
        'Website': 'https://example.com'
    },
    creator: {
        name: 'Indie Label',
        avatar: 'https://i.pravatar.cc/150?u=label',
        badges: ['Verified']
    }
  }
};

export const MOCK_MARKETS: Market[] = [
  {
    id: 'm1',
    question: 'Will Neon Dust break into Billboard Top 50 by July?',
    volume: 54000,
    yesPrice: 0.65,
    noPrice: 0.35,
    endsAt: '2025-07-01T00:00:00Z',
    image: 'https://i.pravatar.cc/300?u=a1',
    status: 'OPEN',
  },
  {
    id: 'm2',
    question: 'Will Luna Tide announce a world tour in Q3?',
    volume: 22000,
    yesPrice: 0.42,
    noPrice: 0.58,
    endsAt: '2025-09-30T00:00:00Z',
    image: 'https://i.pravatar.cc/300?u=a2',
    status: 'OPEN',
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'BUY', title: 'Bought $DUST', timestamp: '2m ago', amount: '50 Shares', iconType: 'trade' },
  { id: '2', type: 'PREDICTION', title: 'Predicted Yes', timestamp: '1h ago', amount: '$500', iconType: 'predict' },
  { id: '3', type: 'DEPOSIT', title: 'Deposited USDC', timestamp: '1d ago', amount: '+$1,000', iconType: 'in' },
];

export const getArtists = () => Promise.resolve(MOCK_ARTISTS);
export const getMarkets = () => Promise.resolve(MOCK_MARKETS);
export const getUser = () => Promise.resolve(MOCK_USER);
export const getArtistDetail = (id: string) => Promise.resolve(MOCK_ARTIST_DETAILS[id] || MOCK_ARTIST_DETAILS['a1']);
export const getActivity = () => Promise.resolve(MOCK_ACTIVITY);
