import { Holder } from '../data/social';

export type HoldingPosition = {
  id: string; // usually same as holder.id
  holderId: string;
  holderName: string;
  holderAvatarUrl?: string;
  entityType: 'SHARE' | 'PREDICTION' | 'LABEL';
  entityId: string;
  entityTitle: string;
  entitySymbol?: string; // For Shares
  outcomeSide?: 'YES' | 'NO'; // For Predictions
  shares: number;
  value: number;
  percent?: number;
  avgBuyPrice?: number;
  pnlValue?: number;
  pnlPercent?: number;
};

export type HoldingActivityItem = {
  id: string;
  type: 'BUY' | 'SELL' | 'PREDICTION_BUY' | 'PREDICTION_SELL';
  timestamp: string;
  sharesDelta: number;
  price: number;
  value: number;
  // Context for predictions
  subtitle?: string; // e.g. "Predicted YES"
  side?: 'YES' | 'NO';
};

export type PortfolioStats = {
    totalValue: number;
    biggestWin: number;
    predictionsCount: number;
    pnlValue: number;
    pnlPercent: number;
    chartData: number[]; // Simple array of values for sparkline
};


export type HolderProfile = {
    stats: PortfolioStats;
    positions: HoldingPosition[];
    closedPositions: HoldingPosition[];
    activity: HoldingActivityItem[];
};

// Mock other positions for a user
const MOCK_OTHER_ENTITIES = [
    { type: 'SHARE', id: 'a2', title: 'Taylor Swift', ticker: '$SWIFT' },
    { type: 'SHARE', id: 'a3', title: 'Drake', ticker: '$DRIZZY' },
    { type: 'SHARE', id: 'a4', title: 'Kendrick Lamar', ticker: '$KDO' },
    { type: 'PREDICTION', id: 'p2', title: 'Will BTC hit 100k?', side: 'YES' },
    { type: 'PREDICTION', id: 'p3', title: 'Will GTA6 release in 2025?', side: 'NO' },
    { type: 'SHARE', id: 'a5', title: 'The Weeknd', ticker: '$XO' },
    { type: 'PREDICTION', id: 'p4', title: 'Will OpenAI release GPT-5?', side: 'YES' },
    { type: 'LABEL', id: 'l1', title: 'OVO Sound', ticker: '$OVO' },
    { type: 'LABEL', id: 'l2', title: 'Roc Nation', ticker: '$ROC' },
    { type: 'LABEL', id: 'l3', title: 'Cactus Jack', ticker: '$JACK' },
    { type: 'SHARE', id: 'a6', title: 'Frank Ocean', ticker: '$BLOND' },
    { type: 'PREDICTION', id: 'p5', title: 'Will ETH flip BTC?', side: 'NO' },
    { type: 'PREDICTION', id: 'p6', title: 'Will Swift endorse a candidate?', side: 'YES' },
    { type: 'PREDICTION', id: 'p7', title: 'Will Twitter rebrand to X again?', side: 'NO' },
    { type: 'PREDICTION', id: 'p8', title: 'Will fed rates drop?', side: 'YES' },
    { type: 'LABEL', id: 'l4', title: 'Top Dawg Ent', ticker: '$TDE' },
];

export const getHoldingActivity = (position: HoldingPosition): HoldingActivityItem[] => {
    // Generate 3-8 mock activities to be populated
    const count = 3 + (position.holderId.charCodeAt(0) % 6);
    const activities: HoldingActivityItem[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const seed = i + position.holderId.charCodeAt(0);
        const isBuy = seed % 2 === 0;
        const timeOffset = i * 86400000 * Math.max(1, (position.holderId.charCodeAt(0) % 3)); // Varied days
        const date = new Date(now.getTime() - timeOffset);
        
        const isPrediction = position.entityType === 'PREDICTION' || (i % 3 === 0); // Mix in if context allows or position IS prediction
        
        let type: any = isBuy ? 'BUY' : 'SELL';
        let subtitle = undefined;
        let side: any = undefined;

        if (position.entityType === 'PREDICTION') {
             type = isBuy ? 'PREDICTION_BUY' : 'PREDICTION_SELL';
             side = position.outcomeSide || (seed % 2 === 0 ? 'YES' : 'NO');
             subtitle = `Predicted ${side}`;
        }

        activities.push({
            id: `act-${position.id}-${i}`,
            type,
            timestamp: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            sharesDelta: Math.floor(position.shares / (i + 2)) + 10,
            price: position.avgBuyPrice || 10,
            value: (position.avgBuyPrice || 10) * (Math.floor(position.shares / (i + 2)) + 10),
            subtitle,
            side
        });
    }
    return activities;
};

export const getHolderProfile = (holderId: string, currentPosition: HoldingPosition): HolderProfile => {
    // Generate deterministic other positions
    // Increase count to 4-9 positions to populate tabs
    const otherCount = (holderId.charCodeAt(0) % 6) + 4; 
    const positions: HoldingPosition[] = [currentPosition];
    
    let totalOtherValue = 0;

    for (let i = 0; i < otherCount; i++) {
        // Use a wider spread of entities
        const entityIndex = (i + holderId.charCodeAt(0)) % MOCK_OTHER_ENTITIES.length;
        
        // UX: Leave some users with no Labels to show empty state (e.g. if ID hash suggests)
        // If holderId ends in '9', skip Label types to force empty state logic demo
        const forceNoLabels = holderId.endsWith('9'); 
        if (forceNoLabels && MOCK_OTHER_ENTITIES[entityIndex].type === 'LABEL') continue;

        const entity = MOCK_OTHER_ENTITIES[entityIndex];
        const shares = (i + 1) * 350;
        const price = 0.5 + (i * 0.15);
        const val = shares * price;
        totalOtherValue += val;

        positions.push({
            id: `pos-${holderId}-${i}`,
            holderId,
            holderName: currentPosition.holderName,
            holderAvatarUrl: currentPosition.holderAvatarUrl,
            entityType: entity.type as any,
            entityId: entity.id,
            entityTitle: entity.title,
            entitySymbol: entity.ticker,
            outcomeSide: entity.side as 'YES' | 'NO',
            shares,
            value: val,
            avgBuyPrice: price * (Math.random() > 0.5 ? 0.8 : 1.1),
            pnlValue: val * ((Math.random() * 0.4) - 0.1), // Mix of profit/loss
            pnlPercent: (Math.random() * 40) - 10
        });
    }

    // Generate closed positions (1-4 closed)
    const closedCount = (holderId.charCodeAt(0) % 4) + 1; 
    const closedPositions: HoldingPosition[] = [];
    
    for (let i = 0; i < closedCount; i++) {
        // Use different entities for closed
        const entityIndex = (i + holderId.charCodeAt(0) + 5) % MOCK_OTHER_ENTITIES.length;
        const entity = MOCK_OTHER_ENTITIES[entityIndex];
        const realizedPnL = (i % 2 === 0) ? 150 * (i+1) : -50 * (i+1);
        
        closedPositions.push({
            id: `closed-${holderId}-${i}`,
            holderId,
            holderName: currentPosition.holderName,
            holderAvatarUrl: currentPosition.holderAvatarUrl,
            entityType: entity.type as any,
            entityId: entity.id,
            entityTitle: entity.title,
            entitySymbol: entity.ticker,
            outcomeSide: entity.side as 'YES' | 'NO',
            shares: 0, // Closed
            value: 0,
            avgBuyPrice: 0.45,
            pnlValue: realizedPnL,
            pnlPercent: realizedPnL > 0 ? 25 : -15
        });
    }

    // sort by value
    positions.sort((a, b) => b.value - a.value);

    // Mock Chart Data
    const chartData = [100, 102, 98, 105, 110, 115, 112, 120, 125, 122, 130];
    
    return {
        stats: {
            totalValue: currentPosition.value + totalOtherValue + 15200, // + Cash
            biggestWin: 4836.07, // Static for style matching
            predictionsCount: 386,
            pnlValue: 106.44,
            pnlPercent: 12.5,
            chartData
        },
        positions,
        closedPositions,
        activity: getHoldingActivity(currentPosition)
    };
};


// Deterministic mock generator
export const getHoldingPosition = (
    holder: Holder, 
    context: { 
        type: 'ARTIST' | 'LABEL' | 'PREDICTION'; 
        entityId: string; 
        name?: string; 
        ticker?: string; 
        side?: 'YES' | 'NO' // Specific for prediction rows
    }
): HoldingPosition => {
    
    // Mock PnL based on string hash of IDs to keep it stable
    const hId = holder.id || 'unknown';
    const eId = context.entityId || 'unknown';
    const seed = ((hId.charCodeAt(0) || 0) + (eId.charCodeAt(0) || 0)) % 100;
    const isProfit = seed > 40;
    const pnlPercent = isProfit ? (seed / 5) : -(seed / 5);
    
    // Calculate derived values
    const currentValue = holder.value || (holder.shares * (context.type === 'PREDICTION' ? 0.65 : 12.50));
    const avgBuy = (currentValue / holder.shares) * (isProfit ? 0.8 : 1.2);
    const pnlValue = currentValue - (avgBuy * holder.shares);

    return {
        id: holder.id,
        holderId: holder.id,
        holderName: holder.name,
        holderAvatarUrl: holder.avatar,
        entityType: context.type === 'PREDICTION' ? 'PREDICTION' : (context.type === 'LABEL' ? 'LABEL' : 'SHARE'),
        entityId: context.entityId,
        entityTitle: context.name || 'Unknown',
        entitySymbol: context.ticker,
        outcomeSide: context.side,
        shares: holder.shares,
        value: currentValue,
        percent: holder.percent,
        avgBuyPrice: avgBuy,
        pnlValue: pnlValue,
        pnlPercent: pnlPercent,
    };
};

export const getUserProfile = (userId: string, userName: string, userAvatar: string): HolderProfile => {
    // Generate a diverse portfolio for the user using MOCK_OTHER_ENTITIES
    
    // 1. User Positions
    const positions: HoldingPosition[] = [];
    let totalPortfolioValue = 0;

    // Fixed mock subset for consistent user profile
    const userEntitiesIndices = [0, 1, 3, 4, 7, 8, 11, 13]; 

    userEntitiesIndices.forEach((idx, i) => {
        if (idx >= MOCK_OTHER_ENTITIES.length) return;
        const entity = MOCK_OTHER_ENTITIES[idx];
        const seed = userId.charCodeAt(0) + i;
        
        // Random shares/values
        const shares = 50 + (seed % 20) * 10;
        const price = 0.5 + ((seed % 50) / 100);
        const val = shares * price;
        totalPortfolioValue += val;

        const isProfit = i % 3 !== 0; // mostly profitable
        const pnlPct = isProfit ? (10 + (i * 2)) : -(5 + i);
        const pnlVal = val * (pnlPct / 100);
        const avgBuy = price / (1 + (pnlPct / 100));

        positions.push({
            id: `my-pos-${i}`,
            holderId: userId,
            holderName: userName,
            holderAvatarUrl: userAvatar,
            entityType: entity.type as any,
            entityId: entity.id,
            entityTitle: entity.title,
            entitySymbol: entity.ticker,
            outcomeSide: entity.side as 'YES' | 'NO',
            shares,
            value: val,
            avgBuyPrice: avgBuy,
            pnlValue: pnlVal,
            pnlPercent: pnlPct
        });
    });

    // Sort by value
    positions.sort((a, b) => b.value - a.value);

    // 2. Closed Positions (History)
    const closedPositions: HoldingPosition[] = [];
    [2, 5].forEach((idx, i) => {
         const entity = MOCK_OTHER_ENTITIES[idx];
         closedPositions.push({
            id: `my-closed-${i}`,
            holderId: userId,
            holderName: userName,
            holderAvatarUrl: userAvatar,
            entityType: entity.type as any,
            entityId: entity.id,
            entityTitle: entity.title,
            entitySymbol: entity.ticker,
            outcomeSide: entity.side as 'YES' | 'NO',
            shares: 0,
            value: 0,
            avgBuyPrice: 0.35,
            pnlValue: 450 * (i + 1), // Realized gains
            pnlPercent: 25
         });
    });

    // 3. User Activity (Mock based on positions)
    const activity: HoldingActivityItem[] = [];
    positions.forEach((p, i) => {
        if (i > 3) return; // Limit activity items
        activity.push({
            id: `my-act-${i}`,
            type: 'BUY',
            timestamp: `${i + 1}d ago`,
            sharesDelta: 50,
            price: p.avgBuyPrice || 0.5,
            value: 50 * (p.avgBuyPrice || 0.5),
            subtitle: p.entityType === 'PREDICTION' ? `Predicted ${p.outcomeSide}` : undefined,
            side: p.outcomeSide
        });
    });

    return {
        stats: {
            totalValue: totalPortfolioValue + 2450.50, // + Cash Balance
            biggestWin: 12500.00,
            predictionsCount: 142,
            pnlValue: 5430.20,
            pnlPercent: 32.4, // Good trader
            chartData: [95, 98, 96, 102, 108, 115, 120, 118, 125, 132, 138] // Upward trend
        },
        positions,
        closedPositions,
        activity
    };
};
