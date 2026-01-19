import { getRecentActivity, PREDICTIONS, ARTISTS } from './catalog';
import { InboxEvent } from '../types/logic';

// Mock Generator for Inbox Events
// Merges "Financial Activity" with "System Events"

const SYSTEM_EVENTS: InboxEvent[] = [
    {
        id: 'evt_1',
        type: 'PRICE_CHANGE',
        title: 'Kanye West ($YZY)',
        body: 'Price up +12% in the last hour. Momentum is strong.',
        timestamp: '15m ago',
        isRead: false,
        priority: 'HIGH',
        context: { screen: 'ArtistDetail', params: { artistId: 'a1' } },
        amountDisplay: '+12%',
        isMoneyOut: false 
    },
    {
        id: 'evt_2',
        type: 'PREDICTION_UPDATE',
        title: 'Prediction Resolving Soon',
        body: 'Will Kanye release "Y3"? Market closes in 24h.',
        timestamp: '2h ago',
        isRead: true,
        priority: 'NORMAL',
        context: { screen: 'PredictionDetail', params: { predictionId: 'p1' } },
        amountDisplay: '24h Left',
        isMoneyOut: true // Red/Orange tint
    },
    {
        id: 'evt_3',
        type: 'CHAT_UNLOCK',
        title: 'New Group Chat Unlocked',
        body: 'You now hold enough $TEMS to join the Holders Chat.',
        timestamp: '1d ago',
        isRead: true,
        priority: 'NORMAL',
        context: { screen: 'ArtistDetail', params: { artistId: 'a8', initialTab: 'Holders', openChat: true } },
        amountDisplay: 'UNLOCKED',
        isMoneyOut: false
    }
];

export const getInboxItems = (): any[] => {
    // 1. Get Financial Activity (Existing)
    const financialActivity = getRecentActivity().map(item => ({
        ...item,
        type: 'FINANCIAL',
        // Ensure consistent shape if needed, or we just handle mixed types in the UI
        title: item.text,
        body: 'Financial Transaction', // Fallback
        timestamp: item.time,
        priority: 'LOW',
        context: { screen: 'Activity', params: {} },
        amountDisplay: item.amount,
        // isMoneyOut is already there
    }));

    // 2. Merge with System Events
    // In a real app, we'd sort by actual timestamp objects.
    // Here we just interleave for demo purposes.
    
    return [
        SYSTEM_EVENTS[0], // Kanye Price (High Priority)
        financialActivity[0], // Bought Shares
        SYSTEM_EVENTS[1], // Prediction Closing
        financialActivity[1], // Sold Shares
        SYSTEM_EVENTS[2], // Chat Unlock
        ...financialActivity.slice(2)
    ];
};
