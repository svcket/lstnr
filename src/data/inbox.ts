import { ICONS } from '../constants/assets';
import { getArtistById, getLabelById } from './catalog';

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
        title: 'Kanye West',
        subtitle: 'CryptoKing: Price is moving! 🚀',
        timestamp: '2m ago',
        avatar: 'https://ui-avatars.com/api/?name=Kanye+West&background=000&color=fff&size=256', // Kanye
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
        avatar: 'https://ui-avatars.com/api/?name=Kanye+West&background=000&color=fff&size=256', // Kanye for Prediction
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
        avatar: 'https://ui-avatars.com/api/?name=Drake&background=F5A623&color=000&size=256', // Drake
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
        avatar: 'https://ui-avatars.com/api/?name=Death+Row&background=000&color=fff&size=256',
        unreadCount: 5,
        context: { 
            screen: 'HoldersChat', // Fixed navigation
            params: { entityId: 'l1', type: 'LABEL' } 
        }
    }
];

export const getInboxThreads = (): InboxThread[] => {
    return MOCK_THREADS;
};


