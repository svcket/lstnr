import { getArtistById, getLabelById, getPredictionById } from './catalog';
import { getDeterministicAvatar } from '../lib/avatarResolver';

export interface InboxThread {
    id: string;
    type: 'ARTIST' | 'PREDICTION' | 'LABEL';
    entityId: string;
    title: string; // Chat Name (e.g. "$YZY Holders")
    subtitle: string; // Last message
    timestamp: string;
    avatar: any; // Image source
    unreadCount: number;
    isPinned?: boolean;
    context: {
        screen: string;
        params: any;
    };
}

const getThreadTitle = (thread: Partial<InboxThread>) => {
    if (thread.type === 'ARTIST') {
        const artist = getArtistById(thread.entityId!);
        return artist?.name || thread.title;
    }
    if (thread.type === 'LABEL') {
        const label = getLabelById(thread.entityId!);
        return label?.name || thread.title;
    }
    if (thread.type === 'PREDICTION') {
        const pred = getPredictionById(thread.entityId!);
        return pred?.question || thread.title;
    }
    return thread.title;
};

const getThreadAvatar = (thread: Partial<InboxThread>) => {
    if (thread.type === 'ARTIST') {
        const artist = getArtistById(thread.entityId!);
        return getDeterministicAvatar(artist?.name || '', thread.entityId!, artist?.avatarUrl);
    }
    if (thread.type === 'LABEL') {
        const label = getLabelById(thread.entityId!);
        return getDeterministicAvatar(label?.name || '', thread.entityId!, label?.avatarUrl);
    }
    if (thread.type === 'PREDICTION') {
        const pred = getPredictionById(thread.entityId!);
        // For predictions, we often use the related artist's avatar if it exists
        if (pred?.relatedEntityId) {
            const artist = getArtistById(pred.relatedEntityId);
            return getDeterministicAvatar(artist?.name || '', pred.relatedEntityId, artist?.avatarUrl);
        }
        return getDeterministicAvatar(pred?.question || 'Prediction', thread.entityId!);
    }
    return thread.avatar;
};

const MOCK_THREADS: InboxThread[] = [
    {
        id: 't1',
        type: 'ARTIST',
        entityId: 'a1',
        title: 'Kanye West',
        subtitle: 'CryptoKing: Price is moving! 🚀',
        timestamp: '2m ago',
        avatar: getThreadAvatar({ type: 'ARTIST', entityId: 'a1' }), 
        unreadCount: 3,
        isPinned: true,
        context: { 
            screen: 'HoldersChat', 
            params: { entityId: 'a1', type: 'ARTIST' } 
        }
    },
    {
        id: 't2',
        type: 'PREDICTION',
        entityId: 'p1',
        title: 'Will Kanye West release "Y3"?',
        subtitle: 'Sarah J: I think it’s delayed...',
        timestamp: '1h ago',
        avatar: getThreadAvatar({ type: 'PREDICTION', entityId: 'p1' }),
        unreadCount: 0,
        context: { 
            screen: 'HoldersChat', 
            params: { entityId: 'p1', type: 'PREDICTION' } 
        }
    },
    {
        id: 't3',
        type: 'ARTIST',
        entityId: 'a2',
        title: 'Drake',
        subtitle: 'You: Just bought more!',
        timestamp: '1d ago',
        avatar: getThreadAvatar({ type: 'ARTIST', entityId: 'a2' }),
        unreadCount: 0,
        context: { 
            screen: 'HoldersChat', 
            params: { entityId: 'a2', type: 'ARTIST' } 
        }
    },
    {
        id: 't4',
        type: 'LABEL',
        entityId: 'l1',
        title: 'Death Row Records',
        subtitle: 'Mod: New signing announcement soon',
        timestamp: '2d ago',
        avatar: getThreadAvatar({ type: 'LABEL', entityId: 'l1' }),
        unreadCount: 5,
        context: { 
            screen: 'HoldersChat', 
            params: { entityId: 'l1', type: 'LABEL' } 
        }
    }
];

export const getInboxThreads = (): InboxThread[] => {
    return MOCK_THREADS;
};


