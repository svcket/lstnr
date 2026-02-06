import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Schema ---

export interface UserSettings {
    theme: 'system' | 'dark' | 'light';
    notifications: {
        priceAlerts: boolean;
        predictionResolutions: boolean;
        mentions: boolean;
        marketing: boolean;
    };
    security: {
        biometricLock: boolean;
        autoLockMins: number; 
        profileVisibility: 'public' | 'private';
    };
    payments: {
        defaultMethod: string;
        walletConnected: boolean;
        paymentMethods: Array<{ id: string; name: string; type: 'card'|'paypal'|'venmo'; last4?: string; }>;
    };
}

const DEFAULT_SETTINGS: UserSettings = {
    theme: 'dark',
    notifications: {
        priceAlerts: true,
        predictionResolutions: true,
        mentions: true,
        marketing: false,
    },
    security: {
        biometricLock: false,
        autoLockMins: 0,
        profileVisibility: 'public',
    },
    payments: {
        defaultMethod: 'card_1',
        walletConnected: false,
        paymentMethods: [
            { id: 'card_1', name: 'Visa', type: 'card', last4: '4242' }
        ]
    },
};

// --- Store ---

interface SettingsState extends UserSettings {
    setTheme: (theme: UserSettings['theme']) => void;
    toggleNotification: (key: keyof UserSettings['notifications']) => void;
    toggleSecurity: (key: keyof UserSettings['security']) => void;
    setAutoLock: (mins: number) => void;
    setProfileVisibility: (vis: 'public' | 'private') => void;
    // Add more actions as needed
}

export const useSettings = create<SettingsState>()(
    persist(
        (set: any) => ({
            ...DEFAULT_SETTINGS,
            
            setTheme: (theme: UserSettings['theme']) => set({ theme }),
            
            toggleNotification: (key: keyof UserSettings['notifications']) => set((state: SettingsState) => ({
                notifications: {
                    ...state.notifications,
                    [key]: !state.notifications[key]
                }
            })),
            
            toggleSecurity: (key: keyof UserSettings['security']) => set((state: SettingsState) => {
                if (key === 'autoLockMins' || key === 'profileVisibility') return state; // handled separately
                return {
                    security: {
                        ...state.security,
                        [key]: !state.security[key as 'biometricLock']
                    }
                };
            }),

            setAutoLock: (mins: number) => set((state: SettingsState) => ({
                security: { ...state.security, autoLockMins: mins }
            })),

            setProfileVisibility: (vis: 'public' | 'private') => set((state: SettingsState) => ({
                security: { ...state.security, profileVisibility: vis }
            })),
        }),
        {
            name: 'lstnr_settings_v1',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
