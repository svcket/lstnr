// MOCK IN-MEMORY STORE (Fallback since AsyncStorage is not installed)
// Data will reset on app reload.

export type Card = {
    id: string;
    brand: string; // 'Visa', 'Mastercard', etc.
    last4: string;
    expMonth: string;
    expYear: string;
    nameOnCard?: string; // Optional
    nickname?: string; // Optional
    isDefault?: boolean;
};

export type Wallet = {
    id: string;
    provider: 'Phantom' | 'WalletConnect';
    address: string;
    chain: 'Solana' | 'Ethereum'; // For visual clarity if we expand later
    isConnected: boolean;
    isDefault?: boolean;
};

export type PaymentPrefs = {
    defaultMethodId: string | 'ask';
    autoSelectBest: boolean;
    requireConfirmation: boolean;
};

// Initial Mock Data
const INITIAL_PREFS: PaymentPrefs = {
    defaultMethodId: 'ask',
    autoSelectBest: false,
    requireConfirmation: true,
};

// In-Memory Storage
let _cards: Card[] = [];
let _wallets: Wallet[] = [];
let _prefs: PaymentPrefs = { ...INITIAL_PREFS };

// --- STORE LOGIC ---

export const PaymentStore = {
    // --- LOADERS ---
    getCards: async (): Promise<Card[]> => {
        // Simulate async delay
        return [..._cards]; 
    },

    getWallets: async (): Promise<Wallet[]> => {
        return [..._wallets];
    },

    getPrefs: async (): Promise<PaymentPrefs> => {
        return { ..._prefs };
    },

    getData: async () => {
        return { 
            cards: [..._cards], 
            wallets: [..._wallets], 
            prefs: { ..._prefs } 
        };
    },

    // --- MUTATIONS ---
    
    saveCard: async (newCard: Card) => {
        // If it's the first card, make it default automatically? (Optional rule)
        _cards = [..._cards, newCard];
        
        // If user had 'ask' and this is the first method, maybe set it? 
        if (_cards.length === 1 && _wallets.length === 0) {
             await PaymentStore.setDefaultMethod(newCard.id);
        }
    },

    removeCard: async (cardId: string) => {
        _cards = _cards.filter(c => c.id !== cardId);
        
        // If default was this card, reset to 'ask'
        if (_prefs.defaultMethodId === cardId) {
            await PaymentStore.setDefaultMethod('ask');
        }
    },

    saveWallet: async (newWallet: Wallet) => {
        _wallets = [..._wallets, newWallet];
        
        if (_wallets.length === 1 && _cards.length === 0) {
            await PaymentStore.setDefaultMethod(newWallet.id);
        }
    },

    disconnectWallet: async (walletId: string) => {
        _wallets = _wallets.filter(w => w.id !== walletId);

        if (_prefs.defaultMethodId === walletId) {
            await PaymentStore.setDefaultMethod('ask');
        }
    },

    updatePrefs: async (newPrefs: Partial<PaymentPrefs>) => {
        _prefs = { ..._prefs, ...newPrefs };
    },

    setDefaultMethod: async (methodId: string | 'ask') => {
        await PaymentStore.updatePrefs({ defaultMethodId: methodId });
    },
    
    // Helper to get formatted default label
    getDefaultLabel: async () => {
        const { cards, wallets, prefs } = await PaymentStore.getData();
        if (prefs.defaultMethodId === 'ask') return "Ask every time";
        
        const card = cards.find(c => c.id === prefs.defaultMethodId);
        if (card) return `${card.brand} •••• ${card.last4}`;
        
        const wallet = wallets.find(w => w.id === prefs.defaultMethodId);
        if (wallet) return `${wallet.provider} (${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)})`;
        
        return "Select a method";
    }
};
