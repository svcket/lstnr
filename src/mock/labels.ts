export interface SignedArtist {
  artistId: string;
  name: string;
  avatarUrl: string;
  price: number;
  changeTodayPct: number;
  volume: number;
}

// Copied/Adapted from ArtistMarket to satisfy shared components
export interface Label {
  id: string;
  name: string;
  symbol: string; // e.g. $UMG
  avatarUrl: string;
  mc: number;      // market cap style number
  ath: number;     // all time high value
  changeTodayPct: number; // e.g. +163.9
  price: number;
  volume24h: number;
  marketCap: number;
  holders: number;

  bio: string;

  circulatingSupply: number;
  marketConfidenceScore: { value: number; level: "High" | "Medium" | "Low" };
  momentum: "Bullish" | "Neutral" | "Bearish";

  links: {
    website?: string;
    x?: string;
    instagram?: string;
    youtube?: string;
    spotify?: string;
    appleMusic?: string;
  };

  signedArtists: SignedArtist[];

  // ADDED TO PREVENT CRASHES IN REUSED TABS
  holdersList: Array<{
    id: string;
    name: string;
    avatar?: string;
    sharesOwned: number;
    followersCount: number;
    isFollowing: boolean;
  }>;
  
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

  predictionsList: Array<any>; 
  
  // Added to match ArtistDetail structure
  // Added to match ArtistDetail structure
  createdBy?: {
    name: string;
    avatarUrl: string; // Changed from avatar
    isVerified: boolean; // New
    tokenSymbol?: string; // Changed from ticker
    walletAddress?: string; // Changed from wallet
  };
}

export const MOCK_LABELS: Label[] = [
  {
    id: "l1",
    name: "UMG",
    symbol: "$UMG",
    avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Universal_Music_Group.svg/1200px-Universal_Music_Group.svg.png",
    mc: 5000000,
    ath: 45.00,
    changeTodayPct: 2.5,
    price: 32.50,
    volume24h: 120000,
    marketCap: 5000000,
    holders: 1200,
    bio: "Universal Music Group N.V. is a Dutch-American multinational music corporation. UMG is the biggest music company in the world.",
    circulatingSupply: 1000000,
    marketConfidenceScore: { value: 85, level: "High" },
    momentum: "Bullish",
    links: {
      website: "https://universalmusic.com",
      instagram: "universalmusicgroup",
      x: "umg"
    },
    signedArtists: [
      { artistId: "a1", name: "Drake", avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9", price: 154.20, changeTodayPct: 12.5, volume: 450000 },
      { artistId: "a2", name: "The Weeknd", avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe713496bc8af8b", price: 132.50, changeTodayPct: -2.1, volume: 320000 },
      { artistId: "a3", name: "Taylor Swift", avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0", price: 180.00, changeTodayPct: 5.4, volume: 500000 }
    ],
    // MOCK DATA TO SATISFY TABS
    holdersList: [
        { id: 'h1', name: 'Alice', sharesOwned: 12000, followersCount: 450, isFollowing: true },
        { id: 'h2', name: 'Bob', sharesOwned: 8500, followersCount: 120, isFollowing: false },
        { id: 'h3', name: 'Charlie', sharesOwned: 5000, followersCount: 890, isFollowing: true },
    ],
    activityList: [
        { 
            id: 'act1', 
            type: 'acquired', 
            deltaShares: 500, 
            symbol: '$UMG', 
            percent: 5.2,
            user: { username: 'investor_01', avatarUrl: '', shares: 120, followers: 40, isFollowing: false, isSelf: false } 
        }
    ],

    createdBy: {
      name: "Lucian Grainge",
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Universal_Music_Group.svg/1200px-Universal_Music_Group.svg.png",
      isVerified: true,
      tokenSymbol: "$LUC",
      walletAddress: "0x12...3456"
    },
    predictionsList: []
  },
  {
    id: "l2",
    name: "Rockafella",
    symbol: "$ROC",
    avatarUrl: "https://i.pinimg.com/originals/a1/32/38/a13238eb583d7350cb4219be47137453.jpg",
    mc: 2000000,
    ath: 25.00,
    changeTodayPct: -1.2,
    price: 18.20,
    volume24h: 50000,
    marketCap: 2000000,
    holders: 800,
    bio: "Rock-A-Fella Records was an American hip hop record label founded by Shawn 'Jay-Z' Carter, Damon 'Dame' Dash, and Kareem 'Biggs' Burke in 1995.",
    circulatingSupply: 500000,
    marketConfidenceScore: { value: 60, level: "Medium" },
    momentum: "Neutral",
    links: {},
    signedArtists: [
       { artistId: "a4", name: "Kanye West", avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb867008a971fae0f4d913f63a", price: 98.40, changeTodayPct: 15.0, volume: 800000 }
    ],

    createdBy: {
        name: "Shawn Carter",
        avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Jay-Z_%40_Shawn_%27Jay-Z%27_Carter_Foundation_Carnival_2006_-_09.jpg",
        isVerified: true,
        tokenSymbol: "$JAYZ",
        walletAddress: "0x77...888"
    },
    holdersList: [],
    activityList: [],
    predictionsList: []
  }
];

export const getLabelById = async (id: string): Promise<Label | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_LABELS.find(l => l.id === id) || MOCK_LABELS[0]);
    }, 100);
  });
};

export const formatCompact = (val: number) => {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
  return '$' + val.toFixed(0);
};
