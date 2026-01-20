import { ICONS } from '../constants/assets';

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

const MOCK_THREADS: InboxThread[] = [
    {
        id: 't1',
        type: 'ARTIST',
        entityId: 'a1',
        title: '$YZY Holders',
        subtitle: 'CryptoKing: Price is moving! 🚀',
        timestamp: '2m ago',
        avatar: 'https://i.pravatar.cc/150?u=1', // Placeholder or artist image
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
        title: 'Album Drop 2026',
        subtitle: 'Sarah J: I think it’s delayed...',
        timestamp: '1h ago',
        avatar: null, // Use icon fallback in UI
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
        title: '$TEMS Inner Circle',
        subtitle: 'You: Just bought more!',
        timestamp: '1d ago',
        avatar: 'https://i.pravatar.cc/150?u=2',
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
        title: 'Opium Label Chat',
        subtitle: 'Mod: New signing announcement soon',
        timestamp: '2d ago',
        avatar: null,
        unreadCount: 5,
        context: { 
            screen: 'LabelDetail', 
            params: { labelId: 'l1' } 
        }
    }
];

export const getInboxThreads = (): InboxThread[] => {
    return MOCK_THREADS;
};


