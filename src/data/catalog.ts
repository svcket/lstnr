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
        bio: 'A visionary artist, producer, and fashion icon who has consistently redefined hip-hop and popular culture. From "The College Dropout" to "Donda", Ye\'s discography is a testament to his evolving creative genius.',
        region: 'North America',
        genres: ['Hip-Hop', 'Pop'],
        links: { 
            spotify: 'https://spotify.com',
            appleMusic: 'https://apple.com',
            x: 'https://x.com/kanyewest',
            website: 'https://yeezy.com',
            instagram: 'https://instagram.com'
        },
        createdBy: {
            name: 'Yeezy Fan Club',
            avatarUrl: 'https://ui-avatars.com/api/?name=Yeezy+Fan+Club&background=random',
            isVerified: true,
            tokenSymbol: '$YZY'
        }
    },
    {
        id: 'a2',
        type: 'artist',
        name: 'Drake',
        symbol: '$6GOD',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9',
        bio: 'Canadian rapper, singer, and songwriter. A dominant figure in contemporary popular music, Drake has been credited for popularizing singing and R&B sensibilities in hip hop.',
        region: 'North America',
        genres: ['Hip-Hop', 'R&B'],
        links: { 
            instagram: 'https://instagram.com/champagnepapi',
            x: 'https://x.com/drake',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'OVO Sound',
            avatarUrl: 'https://ui-avatars.com/api/?name=OVO&background=000&color=fff',
            isVerified: true,
            walletAddress: '0x8...92a'
        }
    },
    {
        id: 'a3',
        type: 'artist',
        name: 'Taylor Swift',
        symbol: '$TS',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0',
        bio: 'American singer-songwriter. Her narrative songwriting, which is often inspired by her personal life, has received widespread critical praise and media coverage.',
        region: 'North America',
        genres: ['Pop', 'Country'],
        links: { 
            website: 'https://taylorswift.com',
            instagram: 'https://instagram.com/taylorswift',
            x: 'https://x.com/taylorswift'
        },
        createdBy: {
            name: 'Swifties',
            avatarUrl: 'https://ui-avatars.com/api/?name=Swifties&background=random',
            isVerified: true,
            tokenSymbol: '$SWIFT'
        }
    },
    {
        id: 'a4',
        type: 'artist',
        name: 'The Weeknd',
        symbol: '$XO',
        avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe713496bc8af8b',
        bio: 'Abel Tesfaye, known as The Weeknd, is a Canadian singer-songwriter and record producer. He helped expand the R&B palette to incorporate indie and electronic music styles.',
        region: 'North America',
        genres: ['R&B', 'Pop'],
        links: { 
            website: 'https://theweeknd.com',
            instagram: 'https://instagram.com/theweeknd',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'XO',
            avatarUrl: 'https://ui-avatars.com/api/?name=XO&background=000&color=fff',
            isVerified: true
        }
    },
    {
        id: 'a5',
        type: 'artist',
        name: 'SZA',
        symbol: '$SZA',
        avatarUrl: 'https://ui-avatars.com/api/?name=SZA&background=1DB954&color=fff&size=256',
        bio: 'Top Dawg Entertainment\'s first lady, SZA writes honest, deeply personal songs about insecurity, relationships, and self-discovery. Her albums "Ctrl" and "SOS" are critical darlings.',
        region: 'North America',
        genres: ['R&B', 'Pop'],
        links: { 
            x: 'https://x.com/sza',
            instagram: 'https://instagram.com/sza',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'TDE',
            avatarUrl: 'https://ui-avatars.com/api/?name=TDE&background=random',
            isVerified: true,
            tokenSymbol: '$TDE'
        }
    },
    {
        id: 'a6',
        type: 'artist',
        name: 'Billie Eilish',
        symbol: '$BLSH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Billie+Eilish&background=bada55&color=000&size=256',
        bio: 'A generational talent known for her whisper-quiet vocals and dark, innovative pop production. Alongside her brother Finneas, Billie has swept the Grammys and Oscars.',
        region: 'North America',
        genres: ['Pop', 'Alternative'],
        links: {
            instagram: 'https://instagram.com/billieeilish',
            spotify: 'https://spotify.com',
            website: 'https://billieeilish.com'
        },
        createdBy: {
            name: 'Finneas',
            avatarUrl: 'https://ui-avatars.com/api/?name=Finneas&background=random',
            isVerified: true
        }
    },
    {
        id: 'a7',
        type: 'artist',
        name: 'Dua Lipa',
        symbol: '$DUA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dua+Lipa&background=ff00cc&color=fff&size=256',
        bio: 'English and Albanian singer and songwriter. Her disco-influenced pop sound has spawned global hits like "Don\'t Start Now" and "Levitating".',
        region: 'Europe',
        genres: ['Pop', 'Disco'],
        links: {
            instagram: 'https://instagram.com/dualipa',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'Sunny Hill',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sunny+Hill&background=random',
            isVerified: true
        }
    },
    {
        id: 'a8',
        type: 'artist',
        name: 'Travis Scott',
        symbol: '$CACS',
        avatarUrl: 'https://ui-avatars.com/api/?name=Travis+Scott&background=553311&color=fff&size=256',
        bio: 'American rapper, singer, songwriter, and record producer. His musical style has been described as a fusion of traditional hip hop, lo-fi and ambient.',
        region: 'North America',
        genres: ['Hip-Hop', 'Trap'],
        links: {
            instagram: 'https://instagram.com/travisscott',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'Cactus Jack',
            avatarUrl: 'https://ui-avatars.com/api/?name=Cactus+Jack&background=random',
            isVerified: true
        }
    },
    {
        id: 'a9',
        type: 'artist',
        name: 'Tyler, The Creator',
        symbol: '$GOLF',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tyler+Creator&background=FFA500&color=fff&size=256',
        bio: 'Rapper, producer, and designer who evolved from the leader of Odd Future into a Grammy-winning auteur.',
        region: 'North America',
        genres: ['Hip-Hop', 'Alternative'],
        links: {
            website: 'https://golfwang.com',
            instagram: 'https://instagram.com/feliciathegoat'
        },
        createdBy: {
            name: 'Odd Future',
            avatarUrl: 'https://ui-avatars.com/api/?name=OFWGKTA&background=random',
            isVerified: true
        }
    },
    {
        id: 'a10',
        type: 'artist',
        name: 'Rosalía',
        symbol: '$MOTO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Rosalia&background=FF0000&color=fff&size=256',
        bio: 'Spanish singer-songwriter known for redefining the sounds of flamenco, fusing it with pop and urban styles.',
        region: 'Europe',
        genres: ['Latin', 'Pop', 'Flamenco'],
        links: {
            instagram: 'https://instagram.com/rosalia.vt',
            website: 'https://rosalia.com'
        },
        createdBy: {
            name: 'Motomami',
            avatarUrl: 'https://ui-avatars.com/api/?name=MM&background=random',
            isVerified: true
        }
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
