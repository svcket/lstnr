
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ HARDCODED FOR DEMO/MVP - In production use ENV vars (expo-env or similar)
// These match the standard local Supabase defaults
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Debug Log (To be removed later)
console.log("[SUPABASE] Connecting to:", SUPABASE_URL);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// FEATURE FLAG: Toggle this to reliably switch between Mock and Real Backend
// Eventually make this dynamic via DevSettings or ENV
export const USE_SUPABASE = process.env.EXPO_PUBLIC_USE_SUPABASE === 'true';

// Helper to check connection status (simple ping)
// Helper to check connection status (simple ping with timeout)
export async function checkSupabaseConnection(): Promise<boolean> {
    const timeout = new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );

    const check = async (): Promise<boolean> => {
        const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
        if (error) {
            console.warn('Supabase Connection Error:', error.message);
            return false;
        }
        return true;
    };

    try {
        return await Promise.race([check(), timeout]);
    } catch (e) {
        console.warn('Supabase Connection Exception:', e);
        return false;
    }
}
