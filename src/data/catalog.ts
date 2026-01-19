export interface Creator {
    name: string;
    avatarUrl: string;
    isVerified: boolean;
    tokenSymbol?: string;
    walletAddress?: string;
}

export interface Artist {
    id: string;
    type: 'artist';
    name: string;
    symbol: string;
    avatarUrl: string;
    bio: string;
    region: 'Global' | 'Africa' | 'North America' | 'Europe' | 'Asia' | 'South America';
    genres: string[];
    links: {
        spotify?: string;
        appleMusic?: string;
        youtube?: string;
        instagram?: string;
        x?: string;
        website?: string;
        discord?: string;
    };
    createdBy?: Creator;
}

export interface Label {
    id: string;
    type: 'label';
    name: string;
    symbol: string;
    avatarUrl: string;
    labelBio: string;
    signedArtists: string[]; // IDs of artists
    links: {
        website?: string;
        x?: string;
        instagram?: string;
        youtube?: string;
    };
    createdBy?: Creator;
}

// --- SEED DATA ---

export const ARTISTS: Artist[] = [
    {
        id: 'a1',
        type: 'artist',
        name: 'Kanye West',
        symbol: '$YZY',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb867008a971fae0f4d913f63a',
        bio: 'A visionary artist, producer, and fashion icon who has consistently redefined hip-hop.',
        region: 'North America',
        genres: ['Hip-Hop', 'Pop'],
        links: { spotify: 'https://spotify.com' }
    },
    {
        id: 'a2',
        type: 'artist',
        name: 'Drake',
        symbol: '$6GOD',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
        bio: 'Canadian rapper, singer, and songwriter. A dominant figure in contemporary popular music.',
        region: 'North America',
        genres: ['Hip-Hop', 'R&B'],
        links: { spotify: 'https://spotify.com' }
    },
    {
        id: 'a3',
        type: 'artist',
        name: 'Taylor Swift',
        symbol: '$TS',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
        bio: 'American singer-songwriter. Her narrative songwriting has received widespread critical praise.',
        region: 'North America',
        genres: ['Pop', 'Country'],
        links: { website: 'https://taylorswift.com' }
    },
    {
        id: 'a4',
        type: 'artist',
        name: 'The Weeknd',
        symbol: '$XO',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe713496bc8af8b',
        bio: 'Canadian singer-songwriter known for his falsetto and dark lyricism.',
        region: 'North America',
        genres: ['R&B', 'Pop'],
        links: { website: 'https://theweeknd.com' }
    },
    {
        id: 'a5',
        type: 'artist',
        name: 'Burna Boy',
        symbol: '$ODG',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9', // Fallback or find specific
        bio: 'Nigerian singer, songwriter, and record producer. An Afro-fusion pioneer.',
        region: 'Africa',
        genres: ['Afrobeats', 'Reggae'],
        links: { instagram: 'https://instagram.com/burnaboygram' }
    },
    {
        id: 'a6',
        type: 'artist',
        name: 'Bad Bunny',
        symbol: '$BB',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb9ad50926f95d8f6945a085d7',
        bio: 'Puerto Rican rapper and singer. The King of Latin Trap.',
        region: 'South America',
        genres: ['Latin', 'Reggaeton'],
        links: { instagram: 'https://instagram.com/badbunnypr' }
    },
    {
        id: 'a7',
        type: 'artist',
        name: 'BTS',
        symbol: '$BTS',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb82a5d58059f81867b871d8b6',
        bio: 'South Korean boy band that has transcended K-Pop to become a global phenomenon.',
        region: 'Asia',
        genres: ['K-Pop', 'Pop'],
        links: { website: 'https://ibighit.com/bts' }
    },
    {
        id: 'a8',
        type: 'artist',
        name: 'Tems',
        symbol: '$TEMS',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5ebc98096238382da4E075677d2',
        bio: 'Nigerian singer, songwriter, and record producer having a breakout global moment.',
        region: 'Africa',
        genres: ['Afrobeats', 'R&B'],
        links: { instagram: 'https://instagram.com/temsbaby' }
    },
    {
        id: 'a9',
        type: 'artist',
        name: 'Rosalía',
        symbol: '$MOTO',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb7a13c907aeb77202377a075c',
        bio: 'Spanish singer-songwriter known for redefining the sounds of flamenco.',
        region: 'Europe',
        genres: ['Latin', 'Pop'],
        links: { website: 'https://rosalia.com' }
    },
    {
        id: 'a10',
        type: 'artist',
        name: 'Central Cee',
        symbol: '$CC',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb5d35272a720137583626786c',
        bio: 'British rapper from Shepherd\'s Bush, London. A leading figure in UK Drill.',
        region: 'Europe',
        genres: ['Hip-Hop', 'Drill'],
        links: { instagram: 'https://instagram.com/centralcee' }
    },
    {
        id: 'a11',
        type: 'artist',
        name: 'NewJeans',
        symbol: '$NWJNS',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb0e090f230756461979927b5e',
        bio: 'South Korean girl group formed by ADOR. Known for their fresh, retro-inspired sound.',
        region: 'Asia',
        genres: ['K-Pop'],
        links: { website: 'https://newjeans.kr' }
    },
    {
        id: 'a12',
        type: 'artist',
        name: 'Rema',
        symbol: '$RAVR',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4e600874e073c66bf97a06ee',
        bio: 'Nigerian singer and rapper. He rose to stardom with the release of the song "Dumebi".',
        region: 'Africa',
        genres: ['Afrobeats'],
        links: { instagram: 'https://instagram.com/heisrema' }
    }
];

export const LABELS: Label[] = [
    {
        id: 'l1',
        type: 'label',
        name: 'Death Row',
        symbol: '$DEATH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Death+Row&background=000&color=fff&size=256',
        labelBio: 'The most dangerous record label in history. Founded in 1991, Death Row Records defined the sound of West Coast hip-hop with legendary releases.',
        signedArtists: ['a1'], 
        links: { 
            website: 'https://deathrow.com',
            instagram: 'https://instagram.com/deathrowrecords',
            x: 'https://x.com/deathrow'
        },
        createdBy: {
            name: 'Snoop Dogg',
            avatarUrl: 'https://ui-avatars.com/api/?name=Snoop+Dogg&background=random',
            isVerified: true,
            tokenSymbol: '$DOGG'
        }
    },
    {
        id: 'l2',
        type: 'label',
        name: 'Empire',
        symbol: '$EMP',
        avatarUrl: 'https://ui-avatars.com/api/?name=Empire&background=0033cc&color=fff&size=256',
        labelBio: 'A premier independent distribution and label services company. Empire empowers artists to maintain control of their careers.',
        signedArtists: ['a3', 'a2'], 
        links: { 
            instagram: 'https://instagram.com/empire',
            website: 'https://empire.com',
            x: 'https://x.com/empire'
        },
        createdBy: {
            name: 'Ghazi',
            avatarUrl: 'https://ui-avatars.com/api/?name=Ghazi&background=random',
            isVerified: true
        }
    },
    {
        id: 'l3',
        type: 'label',
        name: 'OVO Sound',
        symbol: '$OVO',
        avatarUrl: 'https://ui-avatars.com/api/?name=OVO&background=000&color=F5A623&size=256',
        labelBio: 'Founded by Drake, Oliver El-Khatib, and Noah "40" Shebib. OVO Sound has become synonymous with the "Toronto Sound".',
        signedArtists: ['a2'], 
        links: { 
            website: 'https://ovosound.com',
            instagram: 'https://instagram.com/ovosound'
        },
        createdBy: {
            name: 'Drake',
            avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
            isVerified: true,
            tokenSymbol: '$6GOD'
        }
    },
    {
        id: 'l4',
        type: 'label',
        name: 'Roc Nation',
        symbol: '$ROC',
        avatarUrl: 'https://ui-avatars.com/api/?name=Roc+Nation&background=111&color=fff&size=256',
        labelBio: 'Founded by Jay-Z, Roc Nation is an entertainment company that manages some of the world’s biggest names.',
        signedArtists: ['a1'], 
        links: { 
            website: 'https://rocnation.com',
            x: 'https://x.com/rocnation'
        },
        createdBy: {
            name: 'Jay-Z',
            avatarUrl: 'https://ui-avatars.com/api/?name=Jay+Z&background=random',
            isVerified: true,
            tokenSymbol: '$HOV'
        }
    },
    {
        id: 'l5',
        type: 'label',
        name: 'Quality Control',
        symbol: '$QC',
        avatarUrl: 'https://ui-avatars.com/api/?name=QC&background=FF0000&color=fff&size=256',
        labelBio: 'Based in Atlanta, QC dominated the hip-hop charts throughout the 2010s.',
        signedArtists: ['a3'], 
        links: { 
            instagram: 'https://instagram.com/qualitycontrolmusic',
            website: 'https://qualitycontrolmusic.com'
        },
        createdBy: {
            name: 'Coach K',
            avatarUrl: 'https://ui-avatars.com/api/?name=Coach+K&background=random',
            isVerified: true
        }
    },
    {
        id: 'l6',
        type: 'label',
        name: 'XL Recordings',
        symbol: '$XL',
        avatarUrl: 'https://ui-avatars.com/api/?name=XL&background=fff&color=000&size=256',
        labelBio: 'A British independent record label that has released some of the most influential electronic and alternative music.',
        signedArtists: ['a9'],
        links: {
            website: 'https://xlrecordings.com',
            instagram: 'https://instagram.com/xlrecordings'
        },
        createdBy: {
            name: 'Richard Russell',
            avatarUrl: 'https://ui-avatars.com/api/?name=RR&background=random',
            isVerified: false
        }
    },
    {
        id: 'l7',
        type: 'label',
        name: 'Dreamville',
        symbol: '$DRM',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dreamville&background=333&color=fff&size=256',
        labelBio: 'Founded by J. Cole, Dreamville is a record label and media company known for its close-knit roster.',
        signedArtists: ['a6'],
        links: {
            instagram: 'https://instagram.com/dreamville',
            x: 'https://x.com/dreamville'
        },
        createdBy: {
            name: 'J. Cole',
            avatarUrl: 'https://ui-avatars.com/api/?name=J+Cole&background=random',
            isVerified: true,
            tokenSymbol: '$COLE'
        }
    },
    {
        id: 'l8',
        type: 'label',
        name: '88rising',
        symbol: '$88',
        avatarUrl: 'https://ui-avatars.com/api/?name=88&background=EE1C25&color=fff&size=256',
        labelBio: 'A hybrid record label, video production, and marketing company described as a "bridge" between American and Asian artists.',
        signedArtists: ['a8'],
        links: {
            instagram: 'https://instagram.com/88rising',
            youtube: 'https://youtube.com/88rising'
        },
        createdBy: {
            name: 'Sean Miyashiro',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sean&background=random',
            isVerified: true
        }
    }
];

export type Prediction = 
  | {
      id: string;
      marketType: "binary";
      question: string;
      chance: number;
      volume: number;
      deadline: string;
      isLive?: boolean;
      created: string; 
      relatedEntityId?: string;
      region?: string;
    }
  | {
      id: string;
      marketType: "multi-range";
      question: string;
      outcomes: {
        id: string;
        name: string;
        chance: number;
        price: number;
      }[];
      volume: number;
      category: "Music";
      deadline: string;
      isLive?: boolean;
      created: string;
      relatedEntityId?: string;
      region?: string;
    };

export const PREDICTIONS: Prediction[] = [
    {
        id: 'p1',
        marketType: 'binary',
        question: 'Will Kanye West release "Y3" before Oct 2026?',
        chance: 42,
        volume: 1250000,
        deadline: '2026-10-01T00:00:00Z',
        created: '2025-01-01T00:00:00Z',
        relatedEntityId: 'a1',
        region: 'North America'
    },
    {
        id: 'p2',
        marketType: 'binary',
        question: 'Will Tems win Album of the Year?',
        chance: 15,
        volume: 450000,
        deadline: '2026-02-04T00:00:00Z',
        created: '2025-02-01T00:00:00Z',
        relatedEntityId: 'a2',
        region: 'Africa'
    },
    {
        id: 'p3',
        marketType: 'multi-range',
        question: 'Which artist will headline Coachella 2026?',
        volume: 3200000,
        category: 'Music',
        deadline: '2026-01-15T00:00:00Z',
        created: '2025-11-20T00:00:00Z',
        isLive: true,
        region: 'North America',
        outcomes: [
            { id: 'o1', name: 'Kendrick Lamar', chance: 35, price: 0.35 },
            { id: 'o2', name: 'Rihanna', chance: 20, price: 0.20 },
            { id: 'o3', name: 'Dua Lipa', chance: 15, price: 0.15 },
            { id: 'o4', name: 'Travis Scott', chance: 10, price: 0.10 },
        ]
    },
    {
        id: 'p4',
        marketType: 'multi-range',
        question: 'Who will have the #1 Song on Billboard Year-End 2026?',
        volume: 8500000,
        category: 'Music',
        deadline: '2026-12-31T00:00:00Z',
        created: '2026-01-01T00:00:00Z',
        region: 'North America',
        outcomes: [
            { id: 'o1', name: 'Sabrina Carpenter', chance: 20, price: 0.20 },
            { id: 'o2', name: 'Chappell Roan', chance: 18, price: 0.18 },
            { id: 'o3', name: 'The Weeknd', chance: 15, price: 0.15 },
        ]
    },
    {
        id: 'p5',
        marketType: 'binary',
        question: 'Will Frank Ocean drop an album in 2026?',
        chance: 8,
        volume: 5500000,
        deadline: '2026-12-31T00:00:00Z',
        created: '2025-05-15T00:00:00Z',
        region: 'North America'
    },
    {
        id: 'p6',
        marketType: 'binary',
        question: 'Will Spotify raise prices again in Q1 2026?',
        chance: 85,
        volume: 920000,
        deadline: '2026-03-31T00:00:00Z',
        created: '2025-12-10T00:00:00Z',
        region: 'Global'
    }
];

// --- API-LIKE ACCESSORS ---

export const getArtistById = (id: string): Artist | undefined => ARTISTS.find(a => a.id === id);
export const getLabelById = (id: string): Label | undefined => LABELS.find(l => l.id === id);
export const getPredictionById = (id: string): Prediction | undefined => PREDICTIONS.find(p => p.id === id);

export const getAllArtists = () => ARTISTS;
export const getAllLabels = () => LABELS;
export const getAllPredictions = () => PREDICTIONS;

export interface PortfolioItem {
    artistId: string;
    shares: number;
    avgBuyPrice: number;
}

// Mock Portfolio Data (deterministic subset)
export const getPortfolio = (): PortfolioItem[] => {
    return [
        { artistId: 'a1', shares: 120, avgBuyPrice: 12.45 },
        { artistId: 'a2', shares: 450, avgBuyPrice: 8.50 },
        { artistId: 'a4', shares: 60, avgBuyPrice: 14.20 }
    ];
};

export interface PredictionPortfolioItem {
    predictionId: string;
    outcomeId: string;
    amount: number; // Value in USD
}

export const getPredictionPortfolio = (): PredictionPortfolioItem[] => {
    return [
        { predictionId: 'p1', outcomeId: 'yes', amount: 500 },
        { predictionId: 'p2', outcomeId: 'no', amount: 1250 },
        { predictionId: 'p5', outcomeId: 'yes', amount: 300 }
    ];
};

export interface ActivityItem {
    id: string;
    text: string;
    time: string;
    amount: string;
    isMoneyOut: boolean;
}

export const getRecentActivity = (): ActivityItem[] => {
    return [
        { id: 'act_1', text: 'Bought 40 $YE shares', time: '2h ago', amount: '-$180', isMoneyOut: true },
        { id: 'act_2', text: 'Sold 12 $TEMS shares', time: 'Yesterday', amount: '+$64', isMoneyOut: false },
        { id: 'act_3', text: 'Predicted YES: Album 2026', time: '2d ago', amount: '-$50', isMoneyOut: true },
        { id: 'act_4', text: 'Added funds', time: '3d ago', amount: '+$200', isMoneyOut: false },
        { id: 'act_5', text: 'Claimed payout: $SZA', time: '1w ago', amount: '+$92', isMoneyOut: false },
    ];
};
export const formatCompact = (num: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);

// --- DETAIL TYPES ---

export type PredictionDetail = Prediction & {
    description: string;
    outcomes: {
        id: string;
        name: string;
        probability: number; // 0-100 or 0-1
        volume: number;
        color: string; // Hex for graph/pill
    }[];
    chartData: { t: number; yesProb: number }[]; // Mock time series
    marketOpenAt: string;
    marketCloseRule: string;
    payoutNote: string;
    status: 'OPEN' | 'LIVE' | 'RESOLVED';
};

// --- MOCK DETAILS ---

export const getPredictionDetail = (id: string): PredictionDetail | null => {
    const base = PREDICTIONS.find(p => p.id === id);
    if (!base) return null;

    // Generate Chart Data
    // If Binary: Single "Yes" line (or Yes/No if we want). Usually just Yes probability.
    // If Multi: One line per outcome.
    
    let outcomesWithDetails: any[] = [];
    let chartData: any[] = [];

    if (base.marketType === 'multi-range' && 'outcomes' in base) {
        // Use defined outcomes
        outcomesWithDetails = base.outcomes.map((o, i) => ({
             ...o,
             probability: o.chance,
             volume: base.volume * (o.chance/100), // Mock volume share
             color: ['#00B5D8', '#9F7AEA', '#4ADE80', '#F87171', '#F6E05E'][i % 5] // Mock colors
        }));

        // Generate Chart Data for each outcome
        chartData = Array.from({ length: 24 }).map((_, t) => {
            const point: any = { t };
            outcomesWithDetails.forEach(o => {
                // Random walk around chance
                point[o.id] = Math.max(1, Math.min(99, o.chance + Math.sin(t + o.chance) * 5 + (Math.random() * 4 - 2)));
            });
            return point;
        });

    } else {
        // Binary Fallback
        const baseProb = 'chance' in base ? base.chance : 50;
        outcomesWithDetails = [
            { id: 'yes', name: 'Yes', probability: baseProb, volume: base.volume * 0.6, color: '#22c55e' },
            { id: 'no', name: 'No', probability: 100 - baseProb, volume: base.volume * 0.4, color: '#ef4444' }
        ];

        chartData = Array.from({ length: 24 }).map((_, i) => ({
            t: i,
            yes: Math.min(99, Math.max(1, baseProb + Math.sin(i * 0.3) * 3 + (Math.random() * 2 - 1)))
        }));
    }

    return {
        ...base,
        description: `This market resolves to the correct outcome for "${base.question}" by the deadline. The resolution source will be official announcements and reputable news outlets.`,
        outcomes: outcomesWithDetails,
        chartData,
        marketOpenAt: base.created,
        marketCloseRule: 'After outcome occurs or at deadline.',
        payoutNote: 'Usually within two hours of closing.',
        status: base.isLive ? 'LIVE' : 'OPEN'
    } as PredictionDetail;
};
