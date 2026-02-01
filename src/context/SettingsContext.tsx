import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

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

interface SettingsContextType extends UserSettings {
    setTheme: (theme: UserSettings['theme']) => void;
    toggleNotification: (key: keyof UserSettings['notifications']) => void;
    toggleSecurity: (key: keyof UserSettings['security']) => void;
    setAutoLock: (mins: number) => void;
    setProfileVisibility: (vis: 'public' | 'private') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'lstnr_settings_v1';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (loaded) {
            saveSettings(settings);
        }
    }, [settings, loaded]);

    const loadSettings = async () => {
        try {
            const json = await SecureStore.getItemAsync(STORAGE_KEY);
            if (json) {
                const parsed = JSON.parse(json);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            }
        } catch (e) {
            console.warn('Failed to load settings', e);
        } finally {
            setLoaded(true);
        }
    };

    const saveSettings = async (newSettings: UserSettings) => {
        try {
            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(newSettings));
        } catch (e) {
            console.warn('Failed to save settings', e);
        }
    };

    const setTheme = (theme: UserSettings['theme']) => setSettings(s => ({ ...s, theme }));

    const toggleNotification = (key: keyof UserSettings['notifications']) => {
        setSettings(s => ({
            ...s,
            notifications: { ...s.notifications, [key]: !s.notifications[key] }
        }));
    };

    const toggleSecurity = (key: keyof UserSettings['security']) => {
        setSettings(s => {
             // @ts-ignore
             const val = s.security[key];
             if (typeof val === 'boolean') {
                 return { ...s, security: { ...s.security, [key]: !val } };
             }
             return s;
        });
    };

    const setAutoLock = (mins: number) => setSettings(s => ({ ...s, security: { ...s.security, autoLockMins: mins } }));
    
    const setProfileVisibility = (vis: 'public' | 'private') => setSettings(s => ({ ...s, security: { ...s.security, profileVisibility: vis } }));

    return (
        <SettingsContext.Provider value={{
            ...settings,
            setTheme,
            toggleNotification,
            toggleSecurity,
            setAutoLock,
            setProfileVisibility
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
