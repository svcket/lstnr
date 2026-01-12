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
    };
    createdBy?: Creator;
}

export type Prediction = 
  | {
      id: string;
      marketType: "binary";
      question: string;
      chance: number;
      volume: number;
      deadline: string;
      isLive?: boolean;
      created: string; // Add created date for sorting/context
      relatedEntityId?: string;
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
    };

// --- SEED DATA ---

// --- SEED DATA ---

export const ARTISTS: Artist[] = [
    {
        id: 'a1',
        type: 'artist',
        name: 'Kanye West',
        symbol: '$YE',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28cropped%29.jpg/440px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28cropped%29.jpg',
        bio: 'A visionary artist, producer, and fashion icon who has consistently redefined hip-hop and popular culture. From "The College Dropout" to "Donda", Ye\'s discography is a testament to his evolving creative genius. He continues to push boundaries in music, fashion, and design.',
        links: { 
            spotify: 'https://spotify.com',
            appleMusic: 'https://apple.com',
            x: 'https://x.com/kanyewest',
            website: 'https://yeezy.com',
            instagram: 'https://instagram.com'
        },
        createdBy: {
            name: 'Yeezy Fan Club',
            avatarUrl: 'https://i.pravatar.cc/150?u=creator1',
            isVerified: true,
            tokenSymbol: '$YZY'
        }
    },
    {
        id: 'a2',
        type: 'artist',
        name: 'Tems',
        symbol: '$TEMS',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Tems_Wait_For_U_video_shoot_%28cropped%29.jpg/440px-Tems_Wait_For_U_video_shoot_%28cropped%29.jpg',
        bio: 'Nigerian singer, songwriter, and record producer who has taken the global stage by storm. Known for her unique vocal style and deep, soulful melodies, Tems has collaborated with giants like Drake, Wizkid, and Beyoncé. A leading voice in the modern Afrobeats movement.',
        links: { 
            instagram: 'https://instagram.com/temsbaby',
            x: 'https://x.com/temsbaby',
            spotify: 'https://spotify.com',
            youtube: 'https://youtube.com'
        },
        createdBy: {
            name: 'Rebel Gang',
            avatarUrl: 'https://i.pravatar.cc/150?u=creator2',
            isVerified: true,
            walletAddress: '0x8...92a'
        }
    },
    {
        id: 'a3',
        type: 'artist',
        name: 'Burna Boy',
        symbol: '$ODG',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Burna_Boy_at_The_O2_Arena.jpg/440px-Burna_Boy_at_The_O2_Arena.jpg',
        bio: 'Grammy-winning Nigerian singer and songwriter, often called the "African Giant". Burna Boy mixes dancehall, reggae, afrobeat, and pop to create a sound that is strictly his own. He is a driving force in bringing African music to the mainstream global audience.',
        links: { 
            website: 'https://onspaceship.com',
            instagram: 'https://instagram.com/burnaboygram',
            x: 'https://x.com/burnaboy',
            spotify: 'https://spotify.com',
            youtube: 'https://youtube.com'
        },
        createdBy: {
            name: 'Spaceship Ent',
            avatarUrl: 'https://i.pravatar.cc/150?u=creator3',
            isVerified: true,
            tokenSymbol: '$SPACE'
        }
    },
    {
        id: 'a4',
        type: 'artist',
        name: 'Frank Ocean',
        symbol: '$BLND',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Frank_Ocean_2014_Coachella_1.jpg/440px-Frank_Ocean_2014_Coachella_1.jpg',
        bio: 'One of the most praised and enigmatic songwriters of his generation. Frank Ocean\'s introspective storytelling and avant-garde R&B style have earned him a cult following. Known for his masterpieces "Channel Orange" and "Blonde".',
        links: { 
            website: 'https://blonded.co',
            instagram: 'https://instagram.com/blonded',
            spotify: 'https://spotify.com'
        },
        createdBy: {
            name: 'Blonded',
            avatarUrl: 'https://i.pravatar.cc/150?u=creator4',
            isVerified: true
        }
    },
    {
        id: 'a5',
        type: 'artist',
        name: 'SZA',
        symbol: '$SZA',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/SZA_Ctrl_Tour_Toronto_2017.jpg/440px-SZA_Ctrl_Tour_Toronto_2017.jpg',
        bio: 'Top Dawg Entertainment\'s first lady, SZA writes honest, deeply personal songs about insecurity, relationships, and self-discovery. Her albums "Ctrl" and "SOS" are critical darlings that have cemented her place as an R&B superstar.',
        links: { 
            x: 'https://x.com/sza',
            instagram: 'https://instagram.com/sza',
            spotify: 'https://spotify.com',
            website: 'https://szasos.com'
        },
        createdBy: {
            name: 'TDE',
            avatarUrl: 'https://i.pravatar.cc/150?u=creator5',
            isVerified: true,
            tokenSymbol: '$TDE'
        }
    }
];

export const LABELS: Label[] = [
    {
        id: 'l1',
        type: 'label',
        name: 'Death Row Records',
        symbol: '$DEATH',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Death_Row_Records_Logo.svg/440px-Death_Row_Records_Logo.svg.png',
        labelBio: 'The most dangerous record label in history. Founded in 1991, Death Row Records defined the sound of West Coast hip-hop with legendary releases from Dr. Dre, Snoop Dogg, and 2Pac. Now reimagined for the modern era under new ownership.',
        signedArtists: ['a1'], 
        links: { 
            website: 'https://deathrow.com',
            instagram: 'https://instagram.com/deathrowrecords',
            x: 'https://x.com/deathrow'
        },
        createdBy: {
            name: 'Snoop Dogg',
            avatarUrl: 'https://i.pravatar.cc/150?u=snoop',
            isVerified: true,
            tokenSymbol: '$DOGG'
        }
    },
    {
        id: 'l2',
        type: 'label',
        name: 'Empire',
        symbol: '$EMP',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Empire_Distribution_logo.svg/440px-Empire_Distribution_logo.svg.png',
        labelBio: 'A premier independent distribution and label services company. Empire empowers artists to maintain control of their careers while providing major-label resources. Home to superstars and rising talent across hip-hop, R&B, and afrobeats.',
        signedArtists: ['a3', 'a2'], 
        links: { 
            instagram: 'https://instagram.com/empire',
            website: 'https://empire.com',
            x: 'https://x.com/empire'
        },
        createdBy: {
            name: 'Ghazi',
            avatarUrl: 'https://i.pravatar.cc/150?u=ghazi',
            isVerified: true
        }
    },
    {
        id: 'l3',
        type: 'label',
        name: 'OVO Sound',
        symbol: '$OVO',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/OVO_Sound_logo.svg/440px-OVO_Sound_logo.svg.png',
        labelBio: 'Founded by Drake, Oliver El-Khatib, and Noah "40" Shebib. OVO Sound has become synonymous with the "Toronto Sound", blending moody R&B with sharp hip-hop production. A cultural powerhouse in modern music.',
        signedArtists: ['a2'], 
        links: { 
            website: 'https://ovosound.com',
            instagram: 'https://instagram.com/ovosound'
        },
        createdBy: {
            name: 'Drake',
            avatarUrl: 'https://i.pravatar.cc/150?u=drake',
            isVerified: true,
            tokenSymbol: '$6GOD'
        }
    },
    {
        id: 'l4',
        type: 'label',
        name: 'Roc Nation',
        symbol: '$ROC',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Roc_Nation_Logo.svg/440px-Roc_Nation_Logo.svg.png',
        labelBio: 'Founded by Jay-Z, Roc Nation is an entertainment company that manages some of the world’s biggest names. It represents a 360-degree approach to music, sports, and media.',
        signedArtists: ['a1'], 
        links: { 
            website: 'https://rocnation.com',
            x: 'https://x.com/rocnation'
        },
        createdBy: {
            name: 'Jay-Z',
            avatarUrl: 'https://i.pravatar.cc/150?u=jayz',
            isVerified: true,
            tokenSymbol: '$HOV'
        }
    },
    {
        id: 'l5',
        type: 'label',
        name: 'Quality Control',
        symbol: '$QC',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Quality_Control_Music_logo.svg/440px-Quality_Control_Music_logo.svg.png',
        labelBio: 'Based in Atlanta, QC dominated the hip-hop charts throughout the 2010s. Founded by Kevin "Coach K" Lee and Pierre "P" Thomas, it is the home to Migos, Lil Baby, and City Girls.',
        signedArtists: ['a3'], 
        links: { 
            instagram: 'https://instagram.com/qualitycontrolmusic',
            website: 'https://qualitycontrolmusic.com'
        },
        createdBy: {
            name: 'Coach K',
            avatarUrl: 'https://i.pravatar.cc/150?u=coachk',
            isVerified: true
        }
    }
];

export const PREDICTIONS: Prediction[] = [
    {
        id: 'p1',
        marketType: 'binary',
        question: 'Will Kanye West release "Y3" before Oct 2026?',
        chance: 42,
        volume: 1250000,
        deadline: '2026-10-01T00:00:00Z',
        created: '2025-01-01T00:00:00Z',
        relatedEntityId: 'a1'
    },
    {
        id: 'p2',
        marketType: 'binary',
        question: 'Will Tems win Album of the Year?',
        chance: 15,
        volume: 450000,
        deadline: '2026-02-04T00:00:00Z',
        created: '2025-02-01T00:00:00Z',
        relatedEntityId: 'a2'
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
        created: '2025-05-15T00:00:00Z'
    },
    {
        id: 'p6',
        marketType: 'binary',
        question: 'Will Spotify raise prices again in Q1 2026?',
        chance: 85,
        volume: 920000,
        deadline: '2026-03-31T00:00:00Z',
        created: '2025-12-10T00:00:00Z'
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
