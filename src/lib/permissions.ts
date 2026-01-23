import { getPortfolio, getPredictionPortfolio } from '../data/catalog';
import { MIN_SHARES_FOR_CHAT } from '../data/social';

// Central Permission Logic

export const checkAccess = (userId: string, entityId: string) => {
    // In this mock, 'userId' is implicit (we only have one user)
    const portfolio = getPortfolio();
    const holding = portfolio.find(p => p.artistId === entityId);
    
    // Default Access Rules
    const MIN_READ = MIN_SHARES_FOR_CHAT || 10;
    const MIN_WRITE = 50; // Higher threshold for writing

    const shares = holding ? holding.shares : 0;

    return {
        canRead: shares >= MIN_READ,
        canWrite: shares >= MIN_WRITE,
        shares,
        requiredRead: MIN_READ,
        requiredWrite: MIN_WRITE,
        isHolder: shares > 0
    };
};

export const checkPredictionAccess = (userId: string, predictionId: string) => {
    const portfolio = getPredictionPortfolio();
    const holding = portfolio.find(p => p.predictionId === predictionId);

    // Prediction Chat Rule: Must have ANY stake
    const hasStake = !!holding && holding.amount > 0;

    return {
        canRead: hasStake,
        canWrite: hasStake, // For now, same as read
        amount: holding ? holding.amount : 0,
        requiredAmount: 1 // $1 min
    };
};

export const getAccess = (userId: string, entityId: string) => {
    if (entityId.startsWith('p')) {
        const access = checkPredictionAccess(userId, entityId);
        return {
            canRead: access.canRead,
            canWrite: access.canWrite,
            shares: access.amount,
            requiredWrite: access.requiredAmount,
            isHolder: access.canRead,
            type: 'PREDICTION' as const
        };
    }

    const access = checkAccess(userId, entityId);
    return {
        ...access,
        type: 'ARTIST' as const
    };
};
