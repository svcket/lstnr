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
        avatarUrl: 'https://ui-avatars.com/api/?name=Kanye+West&background=000&color=fff&size=256',
        bio: 'A visionary artist, producer, and fashion icon who has consistently redefined hip-hop.',
        region: 'North America',
        genres: ['Hip-Hop', 'Pop'],
        links: { spotify: 'https://spotify.com/kanyewest', website: 'https://kanyewest.com', instagram: 'https://instagram.com/kanyewest' },
        createdBy: { name: 'Roc Nation', avatarUrl: 'https://ui-avatars.com/api/?name=Roc+Nation&background=111&color=fff', isVerified: true }
    },
    {
        id: 'a2',
        type: 'artist',
        name: 'Drake',
        symbol: '$6GOD',
        avatarUrl: 'https://ui-avatars.com/api/?name=Drake&background=F5A623&color=000&size=256',
        bio: 'Canadian rapper, singer, and songwriter. A dominant figure in contemporary popular music.',
        region: 'North America',
        genres: ['Hip-Hop', 'R&B'],
        links: { spotify: 'https://spotify.com/drake', instagram: 'https://instagram.com/champagnepapi' },
        createdBy: { name: 'Lil Wayne', avatarUrl: 'https://ui-avatars.com/api/?name=Lil+Wayne&background=random', isVerified: true }
    },
    {
        id: 'a3',
        type: 'artist',
        name: 'Taylor Swift',
        symbol: '$TS',
        avatarUrl: 'https://ui-avatars.com/api/?name=Taylor+Swift&background=E0115F&color=fff&size=256',
        bio: 'American singer-songwriter. Her narrative songwriting has received widespread critical praise.',
        region: 'North America',
        genres: ['Pop', 'Country'],
        links: { website: 'https://taylorswift.com', spotify: 'https://spotify.com/taylorswift' },
        createdBy: { name: 'Scott Borchetta', avatarUrl: 'https://ui-avatars.com/api/?name=Scott+B&background=random', isVerified: false }
    },
    {
        id: 'a4',
        type: 'artist',
        name: 'The Weeknd',
        symbol: '$XO',
        avatarUrl: 'https://ui-avatars.com/api/?name=The+Weeknd&background=ff0000&color=000&size=256',
        bio: 'Canadian singer-songwriter known for his falsetto and dark lyricism.',
        region: 'North America',
        genres: ['R&B', 'Pop'],
        links: { website: 'https://theweeknd.com', spotify: 'https://spotify.com/theweeknd' },
        createdBy: { name: 'XO Records', avatarUrl: 'https://ui-avatars.com/api/?name=XO&background=000&color=fff', isVerified: true }
    },
    {
        id: 'a5',
        type: 'artist',
        name: 'Burna Boy',
        symbol: '$ODG',
        avatarUrl: 'https://ui-avatars.com/api/?name=Burna+Boy&background=008000&color=fff&size=256',
        bio: 'Nigerian singer, songwriter, and record producer. An Afro-fusion pioneer.',
        region: 'Africa',
        genres: ['Afrobeats', 'Reggae'],
        links: { instagram: 'https://instagram.com/burnaboygram', spotify: 'https://spotify.com/burnaboy' },
        createdBy: { name: 'Spaceship Ent', avatarUrl: 'https://ui-avatars.com/api/?name=Spaceship&background=random', isVerified: true }
    },
    {
        id: 'a6',
        type: 'artist',
        name: 'Bad Bunny',
        symbol: '$BB',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bad+Bunny&background=FFFF00&color=000&size=256',
        bio: 'Puerto Rican rapper and singer. The King of Latin Trap.',
        region: 'South America',
        genres: ['Latin', 'Reggaeton'],
        links: { instagram: 'https://instagram.com/badbunnypr', spotify: 'https://spotify.com/badbunny' },
        createdBy: { name: 'Rimas Ent', avatarUrl: 'https://ui-avatars.com/api/?name=Rimas&background=random', isVerified: true }
    },
    {
        id: 'a7',
        type: 'artist',
        name: 'BTS',
        symbol: '$BTS',
        avatarUrl: 'https://ui-avatars.com/api/?name=BTS&background=9370DB&color=fff&size=256',
        bio: 'South Korean boy band that has transcended K-Pop to become a global phenomenon.',
        region: 'Asia',
        genres: ['K-Pop', 'Pop'],
        links: { website: 'https://ibighit.com/bts', youtube: 'https://youtube.com/bts' },
        createdBy: { name: 'Big Hit', avatarUrl: 'https://ui-avatars.com/api/?name=Big+Hit&background=random', isVerified: true }
    },
    {
        id: 'a8',
        type: 'artist',
        name: 'Tems',
        symbol: '$TEMS',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tems&background=FFA500&color=fff&size=256',
        bio: 'Nigerian singer, songwriter, and record producer having a breakout global moment.',
        region: 'Africa',
        genres: ['Afrobeats', 'R&B'],
        links: { instagram: 'https://instagram.com/temsbaby', spotify: 'https://spotify.com/tems' },
        createdBy: { name: 'Leading Vibe', avatarUrl: 'https://ui-avatars.com/api/?name=Vibe&background=random', isVerified: false }
    },
    {
        id: 'a9',
        type: 'artist',
        name: 'Rosalía',
        symbol: '$MOTO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Rosal%C3%ADa&background=FF69B4&color=fff&size=256',
        bio: 'Spanish singer-songwriter known for redefining the sounds of flamenco.',
        region: 'Europe',
        genres: ['Latin', 'Pop'],
        links: { website: 'https://rosalia.com', spotify: 'https://spotify.com/rosalia' },
        createdBy: { name: 'Columbia', avatarUrl: 'https://ui-avatars.com/api/?name=Columbia&background=random', isVerified: true }
    },
    {
        id: 'a10',
        type: 'artist',
        name: 'Central Cee',
        symbol: '$CC',
        avatarUrl: 'https://ui-avatars.com/api/?name=Central+Cee&background=0000FF&color=fff&size=256',
        bio: 'British rapper from Shepherd\'s Bush, London. A leading figure in UK Drill.',
        region: 'Europe',
        genres: ['Hip-Hop', 'Drill'],
        links: { instagram: 'https://instagram.com/centralcee', spotify: 'https://spotify.com/centralcee' },
        createdBy: { name: 'Live Yours', avatarUrl: 'https://ui-avatars.com/api/?name=Live+Yours&background=random', isVerified: true }
    },
    {
        id: 'a11',
        type: 'artist',
        name: 'NewJeans',
        symbol: '$NWJNS',
        avatarUrl: 'https://ui-avatars.com/api/?name=NewJeans&background=87CEEB&color=fff&size=256',
        bio: 'South Korean girl group formed by ADOR. Known for their fresh, retro-inspired sound.',
        region: 'Asia',
        genres: ['K-Pop'],
        links: { website: 'https://newjeans.kr', spotify: 'https://spotify.com/newjeans' },
        createdBy: { name: 'Min Hee-jin', avatarUrl: 'https://ui-avatars.com/api/?name=MHJ&background=random', isVerified: true }
    },
    {
        id: 'a12',
        type: 'artist',
        name: 'Rema',
        symbol: '$RAVR',
        avatarUrl: 'https://ui-avatars.com/api/?name=Rema&background=800080&color=fff&size=256',
        bio: 'Nigerian singer and rapper. He rose to stardom with the release of the song "Dumebi".',
        region: 'Africa',
        genres: ['Afrobeats'],
        links: { instagram: 'https://instagram.com/heisrema', spotify: 'https://spotify.com/rema' },
        createdBy: { name: 'Mavin Records', avatarUrl: 'https://ui-avatars.com/api/?name=Mavin&background=random', isVerified: true }
    },
    {
        id: 'a13',
        type: 'artist',
        name: 'Travis Scott',
        symbol: '$LAFLAME',
        avatarUrl: 'https://ui-avatars.com/api/?name=Travis+Scott&background=4B3621&color=fff',
        bio: 'Houston rapper known for his atmospheric sound and high-energy performances.',
        region: 'North America',
        genres: ['Hip-Hop'],
        links: { spotify: 'https://spotify.com/travisscott' },
        createdBy: { name: 'Cactus Jack', avatarUrl: 'https://ui-avatars.com/api/?name=Cactus&background=random', isVerified: true }
    },
    {
        id: 'a14',
        type: 'artist',
        name: 'Ariana Grande',
        symbol: '$ARI',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ariana+Grande&background=FFB6C1&color=fff',
        bio: 'Pop powerhouse with an incredible vocal range and numerous hits.',
        region: 'North America',
        genres: ['Pop', 'R&B'],
        links: { website: 'https://arianagrande.com' },
        createdBy: { name: 'Republic', avatarUrl: 'https://ui-avatars.com/api/?name=Republic&background=random', isVerified: true }
    },
    {
        id: 'a15',
        type: 'artist',
        name: 'Kendrick Lamar',
        symbol: '$KDOT',
        avatarUrl: 'https://ui-avatars.com/api/?name=Kendrick+Lamar&background=000&color=fff',
        bio: 'Pulitzer Prize-winning rapper known for his complex lyricism.',
        region: 'North America',
        genres: ['Hip-Hop'],
        links: { website: 'https://oklama.com' },
        createdBy: { name: 'pgLang', avatarUrl: 'https://ui-avatars.com/api/?name=pgLang&background=random', isVerified: true }
    },
    {
        id: 'a16',
        type: 'artist',
        name: 'Billie Eilish',
        symbol: '$BLOSH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Billie+Eilish&background=32CD32&color=000',
        bio: 'Dark pop prodigy known for her whispery vocals and unique style.',
        region: 'North America',
        genres: ['Pop', 'Alternative'],
        links: { website: 'https://billieeilish.com' },
        createdBy: { name: 'Interscope', avatarUrl: 'https://ui-avatars.com/api/?name=Interscope&background=random', isVerified: true }
    },
    {
        id: 'a17',
        type: 'artist',
        name: 'Harry Styles',
        symbol: '$HARRY',
        avatarUrl: 'https://ui-avatars.com/api/?name=Harry+Styles&background=ADD8E6&color=000',
        bio: 'English singer, songwriter, and actor. A modern rock and pop icon.',
        region: 'Europe',
        genres: ['Pop', 'Rock'],
        links: { website: 'https://hstyles.co.uk' },
        createdBy: { name: 'Columbia', avatarUrl: 'https://ui-avatars.com/api/?name=Columbia&background=random', isVerified: true }
    },
    {
        id: 'a18',
        type: 'artist',
        name: 'BLACKPINK',
        symbol: '$BLINK',
        avatarUrl: 'https://ui-avatars.com/api/?name=BLACKPINK&background=FF69B4&color=000',
        bio: 'South Korean girl group dubbed the "biggest girl group in the world".',
        region: 'Asia',
        genres: ['K-Pop', 'Pop'],
        links: { website: 'https://blackpinkofficial.com' },
        createdBy: { name: 'YG Ent', avatarUrl: 'https://ui-avatars.com/api/?name=YG&background=random', isVerified: true }
    },
    {
        id: 'a19',
        type: 'artist',
        name: 'Karol G',
        symbol: '$KG',
        avatarUrl: 'https://ui-avatars.com/api/?name=Karol+G&background=FF1493&color=fff',
        bio: 'Colombian singer and songwriter. A leading voice in Latin urban music.',
        region: 'South America',
        genres: ['Latin', 'Reggaeton'],
        links: { website: 'https://karolgmusic.com' },
        createdBy: { name: 'Universal Latin', avatarUrl: 'https://ui-avatars.com/api/?name=Universal&background=random', isVerified: true }
    },
    {
        id: 'a20',
        type: 'artist',
        name: 'Fred again..',
        symbol: '$FRED',
        avatarUrl: 'https://ui-avatars.com/api/?name=Fred+again&background=ccc&color=000',
        bio: 'British producer and DJ creating emotional electronic music diaries.',
        region: 'Europe',
        genres: ['Electronic', 'House'],
        links: { website: 'https://fredagain.com' },
        createdBy: { name: 'Atlantic', avatarUrl: 'https://ui-avatars.com/api/?name=Atlantic&background=random', isVerified: true }
    },
    {
        id: 'a21',
        type: 'artist',
        name: 'Wizkid',
        symbol: '$BIGWIZ',
        avatarUrl: 'https://ui-avatars.com/api/?name=Wizkid&background=FF4500&color=fff',
        bio: 'Nigerian singer and songwriter. A pioneer of the modern Afrobeats sound.',
        region: 'Africa',
        genres: ['Afrobeats'],
        links: { x: 'https://x.com/wizkidayo' },
        createdBy: { name: 'Starboy', avatarUrl: 'https://ui-avatars.com/api/?name=Starboy&background=random', isVerified: true }
    },
    {
        id: 'a22',
        type: 'artist',
        name: 'SZA',
        symbol: '$SOS',
        avatarUrl: 'https://ui-avatars.com/api/?name=SZA&background=000080&color=fff',
        bio: 'American singer-songwriter known for her vulnerable R&B style.',
        region: 'North America',
        genres: ['R&B'],
        links: { website: 'https://szasos.com' },
        createdBy: { name: 'TDE', avatarUrl: 'https://ui-avatars.com/api/?name=TDE&background=random', isVerified: true }
    },
    {
        id: 'a23',
        type: 'artist',
        name: 'Peso Pluma',
        symbol: '$PESO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Peso+Pluma&background=8B4513&color=fff',
        bio: 'Mexican singer specializing in regional Mexican music and corridos tumbados.',
        region: 'North America', // Geographically Mexico
        genres: ['Latin', 'Regional Mexican'],
        links: { instagram: 'https://instagram.com/pesopluma' },
        createdBy: { name: 'Double P', avatarUrl: 'https://ui-avatars.com/api/?name=PP&background=random', isVerified: true }
    },
    {
        id: 'a24',
        type: 'artist',
        name: 'Dua Lipa',
        symbol: '$DUA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dua+Lipa&background=800000&color=fff',
        bio: 'English-Albanian singer known for her disco-pop sound.',
        region: 'Europe',
        genres: ['Pop', 'Disco'],
        links: { website: 'https://dualipa.com' },
        createdBy: { name: 'Warner', avatarUrl: 'https://ui-avatars.com/api/?name=Warner&background=random', isVerified: true }
    },
    {
        id: 'a25',
        type: 'artist',
        name: 'Stray Kids',
        symbol: '$SKZ',
        avatarUrl: 'https://ui-avatars.com/api/?name=Stray+Kids&background=000&color=f00',
        bio: 'Self-producing K-Pop boy group known for their intense sound.',
        region: 'Asia',
        genres: ['K-Pop', 'Hip-Hop'],
        links: { website: 'https://straykids.jype.com' },
        createdBy: { name: 'JYP', avatarUrl: 'https://ui-avatars.com/api/?name=JYP&background=random', isVerified: true }
    },
    {
        id: 'a26',
        type: 'artist',
        name: 'Playboi Carti',
        symbol: '$VAMP',
        avatarUrl: 'https://ui-avatars.com/api/?name=Carti&background=000&color=f00',
        bio: 'Rapper known for his experimental voice and cult following.',
        region: 'North America',
        genres: ['Hip-Hop', 'Trap'],
        links: { website: 'https://playboicarti.com' },
        createdBy: { name: 'Opium', avatarUrl: 'https://ui-avatars.com/api/?name=Opium&background=random', isVerified: true }
    },
    {
        id: 'a27',
        type: 'artist',
        name: 'Olivia Rodrigo',
        symbol: '$GUTS',
        avatarUrl: 'https://ui-avatars.com/api/?name=Olivia+Rodrigo&background=800080&color=fff',
        bio: 'American singer-songwriter and actress.',
        region: 'North America',
        genres: ['Pop', 'Rock'],
        links: { website: 'https://oliviarodrigo.com' },
        createdBy: { name: 'Geffen', avatarUrl: 'https://ui-avatars.com/api/?name=Geffen&background=random', isVerified: true }
    },
    {
        id: 'a28',
        type: 'artist',
        name: 'Tyler, The Creator',
        symbol: '$GOLF',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tyler&background=FFA500&color=000',
        bio: 'Rapper, producer, and visual artist. Founder of Odd Future.',
        region: 'North America',
        genres: ['Hip-Hop'],
        links: { website: 'https://golfwang.com' },
        createdBy: { name: 'Columbia', avatarUrl: 'https://ui-avatars.com/api/?name=Columbia&background=random', isVerified: true }
    },
    {
        id: 'a29',
        type: 'artist',
        name: 'Shakira',
        symbol: '$SHAK',
        avatarUrl: 'https://ui-avatars.com/api/?name=Shakira&background=DAA520&color=000',
        bio: 'Queen of Latin Music.',
        region: 'South America',
        genres: ['Latin', 'Pop'],
        links: { website: 'https://shakira.com' },
        createdBy: { name: 'Sony Latin', avatarUrl: 'https://ui-avatars.com/api/?name=Sony&background=random', isVerified: true }
    },
    {
        id: 'a30',
        type: 'artist',
        name: 'Ayra Starr',
        symbol: '$STAR',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ayra+Starr&background=FFD700&color=000',
        bio: 'Beninese-born Nigerian singer. A rising star of Afropop.',
        region: 'Africa',
        genres: ['Afrobeats', 'R&B'],
        links: { instagram: 'https://instagram.com/ayrastarr' },
        createdBy: { name: 'Mavin', avatarUrl: 'https://ui-avatars.com/api/?name=Mavin&background=random', isVerified: true }
    },
    {
        id: 'a31',
        type: 'artist',
        name: 'Arctic Monkeys',
        symbol: '$AM',
        avatarUrl: 'https://ui-avatars.com/api/?name=AM&background=000&color=fff',
        bio: 'English rock band formed in Sheffield.',
        region: 'Europe',
        genres: ['Rock', 'Indie'],
        links: { website: 'https://arcticmonkeys.com' },
        createdBy: { name: 'Domino', avatarUrl: 'https://ui-avatars.com/api/?name=Domino&background=random', isVerified: true }
    },
    {
        id: 'a32',
        type: 'artist',
        name: 'Davido',
        symbol: '$OBO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Davido&background=1E90FF&color=fff',
        bio: 'Nigerian singer, songwriter, and record producer.',
        region: 'Africa',
        genres: ['Afrobeats'],
        links: { website: 'https://iamdavido.com' },
        createdBy: { name: 'DMW', avatarUrl: 'https://ui-avatars.com/api/?name=DMW&background=random', isVerified: true }
    },
    {
        id: 'a33',
        type: 'artist',
        name: 'J. Cole',
        symbol: '$COLE',
        avatarUrl: 'https://ui-avatars.com/api/?name=J+Cole&background=333&color=fff',
        bio: 'American rapper and producer. Founder of Dreamville.',
        region: 'North America',
        genres: ['Hip-Hop'],
        links: { website: 'https://dreamville.com' },
        createdBy: { name: 'Dreamville', avatarUrl: 'https://ui-avatars.com/api/?name=Dreamville&background=random', isVerified: true }
    },
    {
        id: 'a34',
        type: 'artist',
        name: 'Rauw Alejandro',
        symbol: '$RAUW',
        avatarUrl: 'https://ui-avatars.com/api/?name=Rauw&background=C0C0C0&color=000',
        bio: 'Puerto Rican singer known for his futuristic reggaeton sound.',
        region: 'South America',
        genres: ['Latin', 'Reggaeton'],
        links: { instagram: 'https://instagram.com/rauwalejandro' },
        createdBy: { name: 'Sony Latin', avatarUrl: 'https://ui-avatars.com/api/?name=Sony&background=random', isVerified: true }
    },
    {
        id: 'a35',
        type: 'artist',
        name: 'SEVENTEEN',
        symbol: '$SVT',
        avatarUrl: 'https://ui-avatars.com/api/?name=SVT&background=F7CAC9&color=fff',
        bio: 'South Korean boy band known for their synchronization and self-production.',
        region: 'Asia',
        genres: ['K-Pop'],
        links: { website: 'https://www.seventeen-17.com' },
        createdBy: { name: 'Pledis', avatarUrl: 'https://ui-avatars.com/api/?name=Pledis&background=random', isVerified: true }
    },
    {
        id: 'a36',
        type: 'artist',
        name: 'Doja Cat',
        symbol: '$DOJA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Doja+Cat&background=FF69B4&color=fff',
        bio: 'American rapper and singer known for her versatility.',
        region: 'North America',
        genres: ['Pop', 'Hip-Hop'],
        links: { website: 'https://dojacat.com' },
        createdBy: { name: 'Kemosabe', avatarUrl: 'https://ui-avatars.com/api/?name=Kemosabe&background=random', isVerified: true }
    },
    {
        id: 'a37',
        type: 'artist',
        name: 'Post Malone',
        symbol: '$POSTY',
        avatarUrl: 'https://ui-avatars.com/api/?name=Post+Malone&background=FFFFE0&color=000',
        bio: 'American rapper, singer, and songwriter known for his variegated vocal styles.',
        region: 'North America',
        genres: ['Pop', 'Hip-Hop'],
        links: { website: 'https://postmalone.com' },
        createdBy: { name: 'Republic', avatarUrl: 'https://ui-avatars.com/api/?name=Republic&background=random', isVerified: true }
    },
    {
        id: 'a38',
        type: 'artist',
        name: 'Calvin Harris',
        symbol: '$CLVN',
        avatarUrl: 'https://ui-avatars.com/api/?name=Calvin+Harris&background=0000CD&color=fff',
        bio: 'Scottish DJ, record producer, singer, and songwriter.',
        region: 'Europe',
        genres: ['Electronic', 'Pop'],
        links: { website: 'https://calvinharris.com' },
        createdBy: { name: 'Sony', avatarUrl: 'https://ui-avatars.com/api/?name=Sony&background=random', isVerified: true }
    },
    {
        id: 'a39',
        type: 'artist',
        name: 'Tame Impala',
        symbol: '$TAME',
        avatarUrl: 'https://ui-avatars.com/api/?name=Tame+Impala&background=linear-gradient&color=fff',
        bio: 'Psych-rock project of Kevin Parker.',
        region: 'Asia', // Technically Australia, mapped to global/Asia often or need 'Oceania'
        genres: ['Rock', 'Alternative'],
        links: { website: 'https://tameimpala.com' },
        createdBy: { name: 'Interscope', avatarUrl: 'https://ui-avatars.com/api/?name=Interscope&background=random', isVerified: true }
    },
    {
        id: 'a40',
        type: 'artist',
        name: 'Stormzy',
        symbol: '$MERKY',
        avatarUrl: 'https://ui-avatars.com/api/?name=Stormzy&background=000&color=fff',
        bio: 'British rapper and grime MC.',
        region: 'Europe',
        genres: ['Hip-Hop', 'Grime'],
        links: { website: 'https://stormzy.com' },
        createdBy: { name: '0207 Def Jam', avatarUrl: 'https://ui-avatars.com/api/?name=DefJam&background=random', isVerified: true }
    },
    {
        id: 'a41',
        type: 'artist',
        name: 'Asake',
        symbol: '$MRMONEY',
        avatarUrl: 'https://ui-avatars.com/api/?name=Asake&background=FFD700&color=000',
        bio: 'Nigerian singer known for blending Afrobeats and Amapiano.',
        region: 'Africa',
        genres: ['Afrobeats'],
        links: { instagram: 'https://instagram.com/asakemusic' },
        createdBy: { name: 'YBNL', avatarUrl: 'https://ui-avatars.com/api/?name=YBNL&background=random', isVerified: true }
    },
    {
        id: 'a42',
        type: 'artist',
        name: 'Feid',
        symbol: '$FERXXO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Feid&background=00FF00&color=000',
        bio: 'Colombian singer and songwriter.',
        region: 'South America',
        genres: ['Reggaeton'],
        links: { website: 'https://ferxxop.com' },
        createdBy: { name: 'Universal', avatarUrl: 'https://ui-avatars.com/api/?name=Univ&background=random', isVerified: true }
    },
    {
        id: 'a43',
        type: 'artist',
        name: 'Future',
        symbol: '$PLUTO',
        avatarUrl: 'https://ui-avatars.com/api/?name=Future&background=00008B&color=fff',
        bio: 'American rapper and singer. Pioneer of mumble rap and melody.',
        region: 'North America',
        genres: ['Hip-Hop', 'Trap'],
        links: { website: 'https://futurefreebandz.com' },
        createdBy: { name: 'Epic', avatarUrl: 'https://ui-avatars.com/api/?name=Epic&background=random', isVerified: true }
    },
    {
        id: 'a44',
        type: 'artist',
        name: 'Lana Del Rey',
        symbol: '$LDR',
        avatarUrl: 'https://ui-avatars.com/api/?name=Lana&background=FFF0F5&color=000',
        bio: 'American singer-songwriter known for her cinematic quality.',
        region: 'North America',
        genres: ['Alternative', 'Pop'],
        links: { website: 'https://lanadelrey.com' },
        createdBy: { name: 'Polydor', avatarUrl: 'https://ui-avatars.com/api/?name=Polydor&background=random', isVerified: true }
    },
    {
        id: 'a45',
        type: 'artist',
        name: 'Dave',
        symbol: '$SAN',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dave&background=000&color=fff',
        bio: 'British rapper known for his socially conscious lyricism.',
        region: 'Europe',
        genres: ['Hip-Hop'],
        links: { website: 'https://santandave.com' },
        createdBy: { name: 'Neighbourhood', avatarUrl: 'https://ui-avatars.com/api/?name=N&background=random', isVerified: true }
    },
    {
        id: 'a46',
        type: 'artist',
        name: 'TWICE',
        symbol: '$ONCE',
        avatarUrl: 'https://ui-avatars.com/api/?name=TWICE&background=FF69B4&color=fff',
        bio: 'South Korean girl group engaged in bubblegum pop and dance-pop.',
        region: 'Asia',
        genres: ['K-Pop'],
        links: { website: 'https://twice.jype.com' },
        createdBy: { name: 'JYP', avatarUrl: 'https://ui-avatars.com/api/?name=JYP&background=random', isVerified: true }
    },
    {
        id: 'a47',
        type: 'artist',
        name: 'Gunna',
        symbol: '$WUNNA',
        avatarUrl: 'https://ui-avatars.com/api/?name=Gunna&background=90EE90&color=000',
        bio: 'American rapper.',
        region: 'North America',
        genres: ['Hip-Hop', 'Trap'],
        links: { website: 'https://gunna.com' },
        createdBy: { name: 'YSL', avatarUrl: 'https://ui-avatars.com/api/?name=YSL&background=random', isVerified: true }
    },
    {
        id: 'a48',
        type: 'artist',
        name: 'Lil Baby',
        symbol: '$BABY',
        avatarUrl: 'https://ui-avatars.com/api/?name=Lil+Baby&background=A9A9A9&color=fff',
        bio: 'American rapper from Atlanta.',
        region: 'North America',
        genres: ['Hip-Hop', 'Trap'],
        links: { website: 'https://lilbaby.com' },
        createdBy: { name: 'QC', avatarUrl: 'https://ui-avatars.com/api/?name=QC&background=random', isVerified: true }
    },
    {
        id: 'a49',
        type: 'artist',
        name: 'Peggy Gou',
        symbol: '$GOU',
        avatarUrl: 'https://ui-avatars.com/api/?name=Peggy+Gou&background=FF4500&color=fff',
        bio: 'South Korean DJ and record producer based in Berlin.',
        region: 'Europe', // Berlin based
        genres: ['Electronic', 'House'],
        links: { instagram: 'https://instagram.com/peggygou_' },
        createdBy: { name: 'Gudu', avatarUrl: 'https://ui-avatars.com/api/?name=Gudu&background=random', isVerified: true }
    },
    {
        id: 'a50',
        type: 'artist',
        name: 'Skepta',
        symbol: '$SK',
        avatarUrl: 'https://ui-avatars.com/api/?name=Skepta&background=000&color=fff',
        bio: 'British MC, rapper, songwriter and record producer.',
        region: 'Europe',
        genres: ['Grime', 'Hip-Hop'],
        links: { instagram: 'https://instagram.com/skeptagram' },
        createdBy: { name: 'Boy Better Know', avatarUrl: 'https://ui-avatars.com/api/?name=BBK&background=random', isVerified: true }
    }
];

export const LABELS: Label[] = [
    {
        id: 'l1',
        type: 'label',
        name: 'Death Row',
        symbol: '$DEATH',
        avatarUrl: 'https://ui-avatars.com/api/?name=Death+Row&background=000&color=fff&size=256',
        labelBio: 'The most dangerous record label in history. West Coast hip-hop legends.',
        signedArtists: ['a1'],
        links: { website: 'https://deathrow.com', instagram: 'https://instagram.com/deathrowrecords' },
        createdBy: { name: 'Snoop Dogg', avatarUrl: 'https://ui-avatars.com/api/?name=Snoop+Dogg&background=random', isVerified: true, tokenSymbol: '$DOGG' }
    },
    {
        id: 'l2',
        type: 'label',
        name: 'Empire',
        symbol: '$EMP',
        avatarUrl: 'https://ui-avatars.com/api/?name=Empire&background=0033cc&color=fff&size=256',
        labelBio: 'Premier independent distribution and label services company.',
        signedArtists: ['a3', 'a2'],
        links: { instagram: 'https://instagram.com/empire', website: 'https://empire.com' },
        createdBy: { name: 'Ghazi', avatarUrl: 'https://ui-avatars.com/api/?name=Ghazi&background=random', isVerified: true }
    },
    {
        id: 'l3',
        type: 'label',
        name: 'OVO Sound',
        symbol: '$OVO',
        avatarUrl: 'https://ui-avatars.com/api/?name=OVO&background=000&color=F5A623&size=256',
        labelBio: 'The Toronto Sound. Founded by Drake, Oliver El-Khatib, and 40.',
        signedArtists: ['a2'], 
        links: { website: 'https://ovosound.com', instagram: 'https://instagram.com/ovosound' },
        createdBy: { name: 'Drake', avatarUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9', isVerified: true, tokenSymbol: '$6GOD' }
    },
    {
        id: 'l4',
        type: 'label',
        name: 'Roc Nation',
        symbol: '$ROC',
        avatarUrl: 'https://ui-avatars.com/api/?name=Roc+Nation&background=111&color=fff&size=256',
        labelBio: 'Entertainment company founded by Jay-Z.',
        signedArtists: ['a1'],
        links: { website: 'https://rocnation.com', x: 'https://x.com/rocnation' },
        createdBy: { name: 'Jay-Z', avatarUrl: 'https://ui-avatars.com/api/?name=Jay+Z&background=random', isVerified: true, tokenSymbol: '$HOV' }
    },
    {
        id: 'l5',
        type: 'label',
        name: 'Quality Control',
        symbol: '$QC',
        avatarUrl: 'https://ui-avatars.com/api/?name=QC&background=FF0000&color=fff&size=256',
        labelBio: 'Based in Atlanta. Innovators of the trap sound.',
        signedArtists: ['a48'],
        links: { instagram: 'https://instagram.com/qualitycontrolmusic', website: 'https://qualitycontrolmusic.com' },
        createdBy: { name: 'Coach K', avatarUrl: 'https://ui-avatars.com/api/?name=Coach+K&background=random', isVerified: true }
    },
    {
        id: 'l6',
        type: 'label',
        name: 'Interscope',
        symbol: '$ISC',
        avatarUrl: 'https://ui-avatars.com/api/?name=Interscope&background=000&color=fff',
        labelBio: 'A major American record label owned by Universal Music Group.',
        signedArtists: ['a16', 'a39'],
        links: { website: 'https://interscope.com' },
        createdBy: { name: 'Jimmy Iovine', avatarUrl: 'https://ui-avatars.com/api/?name=Jimmy&background=random', isVerified: true }
    },
    {
        id: 'l7',
        type: 'label',
        name: 'Dreamville',
        symbol: '$DRM',
        avatarUrl: 'https://ui-avatars.com/api/?name=Dreamville&background=333&color=fff&size=256',
        labelBio: 'Founded by J. Cole. A close-knit roster of lyrical talent.',
        signedArtists: ['a33'],
        links: { instagram: 'https://instagram.com/dreamville' },
        createdBy: { name: 'J. Cole', avatarUrl: 'https://ui-avatars.com/api/?name=J+Cole&background=random', isVerified: true, tokenSymbol: '$COLE' }
    },
    {
        id: 'l8',
        type: 'label',
        name: '88rising',
        symbol: '$88',
        avatarUrl: 'https://ui-avatars.com/api/?name=88&background=EE1C25&color=fff&size=256',
        labelBio: 'Bridging East and West through music and media.',
        signedArtists: [],
        links: { instagram: 'https://instagram.com/88rising', youtube: 'https://youtube.com/88rising' },
        createdBy: { name: 'Sean Miyashiro', avatarUrl: 'https://ui-avatars.com/api/?name=Sean&background=random', isVerified: true }
    },
    {
        id: 'l9',
        type: 'label',
        name: 'TDE',
        symbol: '$TDE',
        avatarUrl: 'https://ui-avatars.com/api/?name=TDE&background=800000&color=fff',
        labelBio: 'Top Dawg Entertainment. West Coast powerhouse.',
        signedArtists: ['a22'],
        links: { website: 'https://tde-onlineshop.com' },
        createdBy: { name: 'Top Dawg', avatarUrl: 'https://ui-avatars.com/api/?name=Top&background=random', isVerified: true }
    },
    {
        id: 'l10',
        type: 'label',
        name: 'Cactus Jack',
        symbol: '$JACK',
        avatarUrl: 'https://ui-avatars.com/api/?name=Cactus+Jack&background=556B2F&color=fff',
        labelBio: 'Record label founded by American rapper Travis Scott.',
        signedArtists: ['a13'],
        links: { website: 'https://travisscott.com' },
        createdBy: { name: 'Travis Scott', avatarUrl: 'https://ui-avatars.com/api/?name=Travis+Scott&background=random', isVerified: true }
    },
    {
        id: 'l11',
        type: 'label',
        name: 'YSL',
        symbol: '$SLATT',
        avatarUrl: 'https://ui-avatars.com/api/?name=YSL&background=006400&color=fff',
        labelBio: 'Young Stoner Life Records. Founded by Young Thug.',
        signedArtists: ['a47'],
        links: { instagram: 'https://instagram.com/yslrecords' },
        createdBy: { name: 'Young Thug', avatarUrl: 'https://ui-avatars.com/api/?name=Thug&background=random', isVerified: true }
    },
    {
        id: 'l12',
        type: 'label',
        name: 'Opium',
        symbol: '$OPIUM',
        avatarUrl: 'https://ui-avatars.com/api/?name=Opium&background=000&color=f00',
        labelBio: 'Founded by Playboi Carti. Known for its dark aesthetic and rage sound.',
        signedArtists: ['a26'],
        links: { website: 'https://opium.com' },
        createdBy: { name: 'Playboi Carti', avatarUrl: 'https://ui-avatars.com/api/?name=Carti&background=random', isVerified: true }
    },
    {
        id: 'l13',
        type: 'label',
        name: 'Republic',
        symbol: '$REP',
        avatarUrl: 'https://ui-avatars.com/api/?name=Republic&background=ADD8E6&color=000',
        labelBio: 'A division of Universal Music Group. Home to many top pop artists.',
        signedArtists: ['a14', 'a37'],
        links: { website: 'https://republicrecords.com' },
        createdBy: { name: 'Monte Lipman', avatarUrl: 'https://ui-avatars.com/api/?name=Monte&background=random', isVerified: true }
    },
    {
        id: 'l14',
        type: 'label',
        name: 'Columbia',
        symbol: '$COL',
        avatarUrl: 'https://ui-avatars.com/api/?name=Columbia&background=000&color=fff',
        labelBio: 'The oldest surviving brand name in the recorded sound business.',
        signedArtists: ['a9', 'a17', 'a28'],
        links: { website: 'https://columbiarecords.com' },
        createdBy: { name: 'Sony', avatarUrl: 'https://ui-avatars.com/api/?name=Sony&background=random', isVerified: true }
    },
    {
        id: 'l15',
        type: 'label',
        name: 'Atlantic',
        symbol: '$ATL',
        avatarUrl: 'https://ui-avatars.com/api/?name=Atlantic&background=FFD700&color=000',
        labelBio: 'American record label founded in October 1947.',
        signedArtists: ['a20'],
        links: { website: 'https://atlanticrecords.com' },
        createdBy: { name: 'WMG', avatarUrl: 'https://ui-avatars.com/api/?name=WMG&background=random', isVerified: true }
    },
    {
        id: 'l16',
        type: 'label',
        name: 'Def Jam',
        symbol: '$DEF',
        avatarUrl: 'https://ui-avatars.com/api/?name=Def+Jam&background=800000&color=fff',
        labelBio: 'Focused predominantly on hip hop, pop, and urban music.',
        signedArtists: ['a40'],
        links: { website: 'https://defjam.com' },
        createdBy: { name: 'Rick Rubin', avatarUrl: 'https://ui-avatars.com/api/?name=Rick&background=random', isVerified: true }
    },
    {
        id: 'l17',
        type: 'label',
        name: 'Mavin',
        symbol: '$MAVIN',
        avatarUrl: 'https://ui-avatars.com/api/?name=Mavin&background=000&color=FFD700',
        labelBio: 'Africa\'s leading entertainment company. Founded by Don Jazzy.',
        signedArtists: ['a12', 'a30'],
        links: { website: 'https://mavinrecords.com' },
        createdBy: { name: 'Don Jazzy', avatarUrl: 'https://ui-avatars.com/api/?name=Don+Jazzy&background=random', isVerified: true }
    },
    {
        id: 'l18',
        type: 'label',
        name: 'HYBE',
        symbol: '$HYBE',
        avatarUrl: 'https://ui-avatars.com/api/?name=HYBE&background=FFFF00&color=000',
        labelBio: 'South Korean entertainment lifestyle platform company.',
        signedArtists: ['a7', 'a11'],
        links: { website: 'https://hybecorp.com' },
        createdBy: { name: 'Bang Si-hyuk', avatarUrl: 'https://ui-avatars.com/api/?name=Bang&background=random', isVerified: true }
    },
    {
        id: 'l19',
        type: 'label',
        name: 'JYP',
        symbol: '$JYP',
        avatarUrl: 'https://ui-avatars.com/api/?name=JYP&background=0000FF&color=fff',
        labelBio: 'JYP Entertainment Corporation is a South Korean multinational entertainment.',
        signedArtists: ['a25', 'a46'],
        links: { website: 'https://jype.com' },
        createdBy: { name: 'J.Y. Park', avatarUrl: 'https://ui-avatars.com/api/?name=JYP&background=random', isVerified: true }
    },
    {
        id: 'l20',
        type: 'label',
        name: 'YG',
        symbol: '$YG',
        avatarUrl: 'https://ui-avatars.com/api/?name=YG&background=000&color=ccc',
        labelBio: 'South Korean entertainment company established in 1996.',
        signedArtists: ['a18'],
        links: { website: 'https://ygfamily.com' },
        createdBy: { name: 'Yang Hyun-suk', avatarUrl: 'https://ui-avatars.com/api/?name=Yang&background=random', isVerified: true }
    },
    {
        id: 'l21',
        type: 'label',
        name: 'Sony Latin',
        symbol: '$SONYL',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sony+Latin&background=FFA07A&color=000',
        labelBio: 'Leading Latin music label.',
        signedArtists: ['a29', 'a34'],
        links: { website: 'https://sonymusiclatin.com' },
        createdBy: { name: 'Sony', avatarUrl: 'https://ui-avatars.com/api/?name=Sony&background=random', isVerified: true }
    },
    {
        id: 'l22',
        type: 'label',
        name: 'Warner',
        symbol: '$WARN',
        avatarUrl: 'https://ui-avatars.com/api/?name=Warner&background=000&color=fff',
        labelBio: 'One of the "big three" recording companies.',
        signedArtists: ['a24'],
        links: { website: 'https://wmg.com' },
        createdBy: { name: 'WMG', avatarUrl: 'https://ui-avatars.com/api/?name=WMG&background=random', isVerified: true }
    },
    {
        id: 'l23',
        type: 'label',
        name: 'Cash Money',
        symbol: '$CMR',
        avatarUrl: 'https://ui-avatars.com/api/?name=Cash+Money&background=008000&color=fff',
        labelBio: 'Taking Over for the 99 & 2000.',
        signedArtists: [],
        links: { website: 'https://cashmoney-records.com' },
        createdBy: { name: 'Birdman', avatarUrl: 'https://ui-avatars.com/api/?name=Birdman&background=random', isVerified: true }
    },
     {
        id: 'l24',
        type: 'label',
        name: 'Bad Boy',
        symbol: '$BAD',
        avatarUrl: 'https://ui-avatars.com/api/?name=Bad+Boy&background=000&color=fff',
        labelBio: 'We ain\'t going nowhere.',
        signedArtists: [],
        links: { website: 'https://badboy.com' },
        createdBy: { name: 'Diddy', avatarUrl: 'https://ui-avatars.com/api/?name=Diddy&background=random', isVerified: true }
    },
    {
        id: 'l25',
        type: 'label',
        name: 'pgLang',
        symbol: '$PGL',
        avatarUrl: 'https://ui-avatars.com/api/?name=pgLang&background=ddd&color=000',
        labelBio: 'Multilingual company.',
        signedArtists: ['a15'],
        links: { website: 'https://pg-lang.com' },
        createdBy: { name: 'Dave Free', avatarUrl: 'https://ui-avatars.com/api/?name=Dave&background=random', isVerified: true }
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
    // a1: Kanye West (3 predictions)
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
        id: 'p1_2',
        marketType: 'binary',
        question: 'Will Kanye announce a stadium tour for 2026?',
        chance: 15,
        volume: 850000,
        deadline: '2026-06-01T00:00:00Z',
        created: '2025-12-15T00:00:00Z',
        relatedEntityId: 'a1',
        region: 'North America'
    },
    {
        id: 'p1_3',
        marketType: 'multi-range',
        question: 'How many albums will Ye drop in 2026?',
        volume: 450000,
        category: 'Music',
        deadline: '2026-12-31T00:00:00Z',
        created: '2026-01-10T00:00:00Z',
        region: 'North America',
        outcomes: [
            { id: 'o1', name: 'Zero', chance: 20, price: 0.20 },
            { id: 'o2', name: 'One', chance: 45, price: 0.45 },
            { id: 'o3', name: 'Two or more', chance: 35, price: 0.35 },
        ]
    },

    // a2: Tems (2 predictions)
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
        id: 'p2_2',
        marketType: 'binary',
        question: 'Will "Love Me Jeje" hit 1B streams in 2026?',
        chance: 65,
        volume: 320000,
        deadline: '2026-12-31T00:00:00Z',
        created: '2025-11-20T00:00:00Z',
        relatedEntityId: 'a2',
        region: 'Global'
    },

    // a4: The Weeknd (3 predictions) - assuming a4 is Weeknd from previous context or generic
    {
        id: 'p4_1',
        marketType: 'binary',
        question: 'Will The Weeknd retire his stage name in 2026?',
        chance: 88,
        volume: 2100000,
        deadline: '2026-07-01T00:00:00Z',
        created: '2025-08-15T00:00:00Z',
        relatedEntityId: 'a4',
        region: 'North America'
    },
    {
        id: 'p4_2',
        marketType: 'binary',
        question: 'Will Abel act in another HBO series?',
        chance: 10,
        volume: 150000,
        deadline: '2026-12-31T00:00:00Z',
        created: '2025-09-01T00:00:00Z',
        relatedEntityId: 'a4',
        region: 'North America'
    },
    {
        id: 'p4_3',
        marketType: 'multi-range',
        question: 'Next Weeknd Era Aesthetic?',
        volume: 980000,
        category: 'Music',
        deadline: '2026-05-01T00:00:00Z',
        created: '2025-12-05T00:00:00Z',
        relatedEntityId: 'a4',
        region: 'Global',
        outcomes: [
            { id: 'o1', name: 'Cyberpunk', chance: 30, price: 0.30 },
            { id: 'o2', name: 'Acoustic/Folk', chance: 15, price: 0.15 },
            { id: 'o3', name: 'Rebirth/Child', chance: 55, price: 0.55 },
        ]
    },

    // General Industry (Coachella, Billboard, Grammys)
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
    },
    {
        id: 'p7',
        marketType: 'binary',
        question: 'Will Kendrick drop a visual album?',
        chance: 45,
        volume: 670000,
        deadline: '2026-08-01T00:00:00Z',
        created: '2025-12-25T00:00:00Z',
        relatedEntityId: 'a20', // Assuming a20 is Kendrick or similar
        region: 'North America'
    },
    {
        id: 'p8',
        marketType: 'binary',
        question: 'Will Playboi Carti start a cult?',
        chance: 99,
        volume: 12000,
        deadline: '2026-04-01T00:00:00Z',
        created: '2025-10-31T00:00:00Z',
        relatedEntityId: 'a3',
        region: 'North America'
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
        { artistId: 'a4', shares: 60, avgBuyPrice: 14.20 },
        { artistId: 'a3', shares: 85, avgBuyPrice: 22.10 },
        { artistId: 'a5', shares: 200, avgBuyPrice: 5.40 },
        { artistId: 'a6', shares: 310, avgBuyPrice: 9.75 },
        { artistId: 'a7', shares: 1500, avgBuyPrice: 1.20 },
        { artistId: 'a8', shares: 75, avgBuyPrice: 18.50 }
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
    type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW' | 'PREDICTION' | 'PAYOUT';
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    date: string; // Full date for detail
}

export const getRecentActivity = (): ActivityItem[] => {
    return [
        { id: 'act_1', text: 'Bought 40 $YE shares', time: '2h ago', amount: '-$180.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Jan 20, 2026' },
        { id: 'act_2', text: 'Sold 12 $TEMS shares', time: 'Yesterday', amount: '+$64.50', isMoneyOut: false, type: 'SELL', status: 'COMPLETED', date: 'Jan 19, 2026' },
        { id: 'act_3', text: 'Predicted YES: Album 2026', time: '2d ago', amount: '-$50.00', isMoneyOut: true, type: 'PREDICTION', status: 'COMPLETED', date: 'Jan 18, 2026' },
        { id: 'act_4', text: 'Added funds', time: '3d ago', amount: '+$200.00', isMoneyOut: false, type: 'DEPOSIT', status: 'COMPLETED', date: 'Jan 17, 2026' },
        { id: 'act_5', text: 'Claimed payout: $SZA', time: '1w ago', amount: '+$92.10', isMoneyOut: false, type: 'PAYOUT', status: 'COMPLETED', date: 'Jan 12, 2026' },
        { id: 'act_6', text: 'Bought 100 $DRAKE', time: '1w ago', amount: '-$450.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Jan 11, 2026' },
        { id: 'act_7', text: 'Sold 5 $KENDRICK', time: '2w ago', amount: '+$22.00', isMoneyOut: false, type: 'SELL', status: 'COMPLETED', date: 'Jan 05, 2026' },
        { id: 'act_8', text: 'Withdrawal to Bank', time: '2w ago', amount: '-$1,000.00', isMoneyOut: true, type: 'WITHDRAW', status: 'COMPLETED', date: 'Jan 04, 2026' },
        { id: 'act_9', text: 'Bought 50 $FUTURE', time: '3w ago', amount: '-$210.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Dec 28, 2025' },
        { id: 'act_10', text: 'Predicted NO: Tour 2025', time: '3w ago', amount: '-$100.00', isMoneyOut: true, type: 'PREDICTION', status: 'COMPLETED', date: 'Dec 27, 2025' },
        { id: 'act_11', text: 'Referral Bonus', time: '1mo ago', amount: '+$25.00', isMoneyOut: false, type: 'PAYOUT', status: 'COMPLETED', date: 'Dec 20, 2025' },
        { id: 'act_12', text: 'Bought 10 $CARTI', time: '1mo ago', amount: '-$45.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Dec 18, 2025' },
        { id: 'act_13', text: 'Sold 20 $YE', time: '1mo ago', amount: '+$98.00', isMoneyOut: false, type: 'SELL', status: 'COMPLETED', date: 'Dec 15, 2025' },
        { id: 'act_14', text: 'Added funds', time: '2mo ago', amount: '+$500.00', isMoneyOut: false, type: 'DEPOSIT', status: 'COMPLETED', date: 'Nov 10, 2025' },
        { id: 'act_15', text: 'Predicted YES: Grammy Win', time: '2mo ago', amount: '-$75.00', isMoneyOut: true, type: 'PREDICTION', status: 'COMPLETED', date: 'Nov 05, 2025' },
        { id: 'act_16', text: 'Bought 200 $TRIVIA', time: '3mo ago', amount: '-$50.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Oct 20, 2025' },
        { id: 'act_17', text: 'Sold 50 $TRIVIA', time: '3mo ago', amount: '+$20.00', isMoneyOut: false, type: 'SELL', status: 'COMPLETED', date: 'Oct 22, 2025' },
        { id: 'act_18', text: 'Deposit Failed', time: '4mo ago', amount: '$0.00', isMoneyOut: false, type: 'DEPOSIT', status: 'FAILED', date: 'Sep 15, 2025' },
        { id: 'act_19', text: 'Bought 5 $JCOLE', time: '5mo ago', amount: '-$25.00', isMoneyOut: true, type: 'BUY', status: 'COMPLETED', date: 'Aug 10, 2025' },
        { id: 'act_20', text: 'Welcome Bonus', time: '6mo ago', amount: '+$10.00', isMoneyOut: false, type: 'PAYOUT', status: 'COMPLETED', date: 'Jul 01, 2025' },
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
