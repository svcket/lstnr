
export type InboxEventType = 'PRICE_CHANGE' | 'PREDICTION_UPDATE' | 'MENTION' | 'SYSTEM_ALERT' | 'CHAT_UNLOCK';

export interface InboxEvent {
  id: string;
  type: InboxEventType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  // Navigation context
  context: {
    screen: 'ArtistDetail' | 'PredictionDetail' | 'HoldersChat' | 'Activity';
    params?: any;
  };
  // UI Helpers (mapping to existing Activity UI)
  amountDisplay?: string; // Replaces 'amount'
  isMoneyOut?: boolean;   // For icon color
  iconOverride?: any;     // Optional custom icon
}

export interface ChatConfig {
  entityId: string;
  minSharesToRead: number;
  minSharesToWrite: number;
}
