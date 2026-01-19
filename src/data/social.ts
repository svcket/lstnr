import { ImageSourcePropType } from 'react-native';

// --- TYPES ---

export interface User {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
}

export interface Comment {
    id: string;
    user: User;
    text: string;
    createdAt: string; // "2h ago"
    likes: number;
    liked?: boolean;
    isHolder?: boolean;
    repliesCount?: number;
    replies?: Comment[];
    contextType: 'ARTIST' | 'LABEL' | 'PREDICTION';
    symbol: string;
    predictionMeta?: {
        marketType: 'binary' | 'multi-range';
        pickedOutcomeLabel?: string;
        pickedSide?: 'YES' | 'NO' | null;
    };
}

export interface ChatMessage {
    id: string;
    user: User;
    text: string;
    createdAt: string; // ISO or human readble
    isMe?: boolean;
}

export interface Holder {
    id: string;
    name: string;
    avatar: string;
    shares: number;
    percent?: number;
    value: number; // USD Value
    isFollowing?: boolean;
}

export interface ActivityItem {
    id: string;
    user: User; // The actor
    action: 'acquired' | 'released';
    amount: number; // Shares count
    symbol: string;
    timestamp: string;
    value: number; // USD Value
    impact?: number; // % impact
}

export interface EntityPrediction {
    id: string;
    title: string;
    volume: number;
    yesPct: number;
    endDate: string;
}

// --- STORE ---

const commentsStore: Record<string, Comment[]> = {};
const chatStore: Record<string, ChatMessage[]> = {};
const holdersStore: Record<string, Holder[]> = {};
const activityStore: Record<string, ActivityItem[]> = {};
const predictionsStore: Record<string, EntityPrediction[]> = {};

// --- SEEDERS ---

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'CryptoKing', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'u2', name: 'Sarah J', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'u3', name: 'WhaleWatcher', avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 'u4', name: 'MusicFan99', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 'u5', name: 'TraderX', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 'u6', name: 'HODLer', avatar: 'https://i.pravatar.cc/150?u=6' },
    { id: 'u7', name: 'BigBag', avatar: 'https://i.pravatar.cc/150?u=7' },
];

export const getComments = (entityId: string): Comment[] => {
    if (!commentsStore[entityId]) {
        // Seed
        commentsStore[entityId] = Array.from({ length: 15 }).map((_, i) => ({
            id: `c_${entityId}_${i}`,
            user: MOCK_USERS[i % MOCK_USERS.length],
            text: i % 2 === 0 
                ? `Bullish on this entity! 🚀` 
                : `Does anyone know when the next album drops?`,
            createdAt: `${i + 1}h ago`,
            likes: Math.floor(Math.random() * 50),
            isHolder: Math.random() > 0.5,
            repliesCount: i % 3 === 0 ? 3 : 0,
            replies: i % 3 === 0 ? Array.from({ length: 3 }).map((_, r) => ({
                 id: `r_${entityId}_${i}_${r}`,
                 user: MOCK_USERS[(i + r + 1) % MOCK_USERS.length],
                 text: `This is a nested reply #${r+1}`,
                 createdAt: `${r * 10 + 5}m ago`,
                 likes: Math.floor(Math.random() * 10),
                 liked: false,
                 // Nested inherits context
                 contextType: entityId.startsWith('p') ? 'PREDICTION' : 'ARTIST',
                 symbol: '$BIGT',
                 predictionMeta: entityId.startsWith('p') ? {
                     marketType: entityId.includes('multi') ? 'multi-range' : 'binary',
                     pickedOutcomeLabel: entityId.includes('multi') ? 'Kendrick Lamar' : (Math.random() > 0.5 ? 'Yes' : 'No'),
                     pickedSide: entityId.includes('multi') ? null : (Math.random() > 0.5 ? 'YES' : 'NO')
                 } : undefined
            })) : [],
            contextType: entityId.startsWith('p') ? 'PREDICTION' : 'ARTIST',
            symbol: '$BIGT',
            predictionMeta: entityId.startsWith('p') ? {
                 marketType: entityId.includes('multi') ? 'multi-range' : 'binary',
                 pickedOutcomeLabel: entityId.includes('multi') ? 'Kendrick Lamar' : (Math.random() > 0.5 ? 'Yes' : 'No'),
                 pickedSide: entityId.includes('multi') ? null : (Math.random() > 0.5 ? 'YES' : 'NO')
            } : undefined
        }));
    }
    return commentsStore[entityId];
};

export const addComment = (entityId: string, text: string, isHolder: boolean = false) => {
    const list = getComments(entityId);
    const newComment: Comment = {
        id: Date.now().toString(),
        user: { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' },
        text,
        createdAt: 'Just now',
        likes: 0,
        liked: false,
        isHolder,
        contextType: entityId.startsWith('p') ? 'PREDICTION' : 'ARTIST',
        symbol: '$BIGT'
    };
    commentsStore[entityId] = [newComment, ...list];
    return newComment;
};

export const getHoldersChat = (entityId: string): ChatMessage[] => {
    if (!chatStore[entityId]) {
        chatStore[entityId] = Array.from({ length: 20 }).map((_, i) => ({
            id: `msg_${entityId}_${i}`,
            user: MOCK_USERS[i % MOCK_USERS.length],
            text: `Only holders know this alpha about ${entityId}.`,
            createdAt: new Date(Date.now() - i * 60000 * 10).toISOString(),
            isMe: false
        })).reverse();
    }
    return chatStore[entityId];
};

export const addChatMessage = (entityId: string, text: string) => {
    if (!chatStore[entityId]) getHoldersChat(entityId); // Ensure init
    const msg: ChatMessage = {
        id: Date.now().toString(),
        user: { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' },
        text,
        createdAt: new Date().toISOString(),
        isMe: true
    };
    chatStore[entityId] = [...chatStore[entityId], msg];
    return msg;
};

export const getHolders = (entityId: string): Holder[] => {
    if (!holdersStore[entityId]) {
        holdersStore[entityId] = Array.from({ length: 30 }).map((_, i) => ({
            id: `h_${entityId}_${i}`,
            name: MOCK_USERS[i % MOCK_USERS.length].name,
            avatar: MOCK_USERS[i % MOCK_USERS.length].avatar,
            shares: Math.floor(Math.random() * 5000) + 10,
            percent: Math.random() * 5,
            value: (Math.floor(Math.random() * 5000) + 10) * (Math.random() * 10 + 5), // Mock Value
            isFollowing: i % 3 === 0
        })).sort((a,b) => b.shares - a.shares);
    }
    return holdersStore[entityId];
};

export const getPredictionHolders = (entityId: string): { yes: Holder[], no: Holder[] } => {
    const all = getHolders(entityId); 
    // Mock split
    return {
        yes: all.slice(0, Math.ceil(all.length / 2)),
        no: all.slice(Math.ceil(all.length / 2))
    };
};

export const getActivity = (entityId: string): ActivityItem[] => {
    if (!activityStore[entityId]) {
        activityStore[entityId] = Array.from({ length: 15 }).map((_, i) => {
            const user = MOCK_USERS[i % MOCK_USERS.length];
            const isAcquired = Math.random() > 0.3;
            return {
                id: `act_${entityId}_${i}`,
                user: {
                    ...user,
                    isVerified: i % 4 === 0 // Mock verify
                },
                action: isAcquired ? 'acquired' : 'released',
                amount: Math.floor(Math.random() * 1000) + 50,
                symbol: '$TOKEN', // Default mock
                timestamp: `${Math.floor(Math.random() * 24)}h ago`,
                value: Math.floor(Math.random() * 5000),
                impact: Math.random() > 0.8 ? Math.random() * 2 : undefined
            };
        });
    }
    return activityStore[entityId];
}

export const getEntityPredictions = (entityId: string, entityName: string): EntityPrediction[] => {
    if (!predictionsStore[entityId]) {
        predictionsStore[entityId] = [
            {
                id: `p_${entityId}_1`,
                title: `Will ${entityName} release an album in 2026?`,
                volume: 250000,
                yesPct: 65,
                endDate: 'Oct 2026'
            },
            {
                id: `p_${entityId}_2`,
                title: `Will ${entityName} win a Grammy this year?`,
                volume: 120000,
                yesPct: 30,
                endDate: 'Feb 2026'
            },
            {
                id: `p_${entityId}_3`,
                title: `Will ${entityName} tour globally?`,
                volume: 50000,
                yesPct: 88,
                endDate: 'Dec 2026'
            }
        ];
    }
    return predictionsStore[entityId];
};

// --- USER MOCK ---
export const MIN_SHARES_FOR_CHAT = 10;
export const getUserSharesInfo = (entityId: string) => {
    // Mock: User has shares for 'a1' (Kanye) but not 'a2' (Tems)
    const userShares = entityId === 'a1' ? 150 : 0;
    return {
        shares: userShares,
        hasAccess: userShares >= MIN_SHARES_FOR_CHAT
    };
};
