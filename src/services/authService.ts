import { Storage as SecureStore } from '../utils/storage';
import { User } from './mockApi';

// Mock User Database
const USERS_STORAGE_KEY = 'lstnr_users_db';
const CURRENT_USER_KEY = 'lstnr_user_session';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthService = {
  /**
   * Check if a user exists by email or phone
   */
  lookupUserByIdentifier: async (identifier: string): Promise<{ exists: boolean }> => {
    await delay(600); // Simulate network
    const usersJson = await SecureStore.getItemAsync(USERS_STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Check local mock DB
    const exists = users.some(u => u.email === identifier || u.handle === identifier);

    // Mock "nigerianeagle@seka.io" as existing user for testing if strictly needed,
    // otherwise relies on what's in SecureStore.
    // Let's force true for a specific demo email if DB is empty for easier testing.
    if (identifier === 'demo@lstnr.com') return { exists: true };

    return { exists };
  },

  /**
   * Send OTP (Mock)
   */
  sendOtp: async (identifier: string): Promise<void> => {
    await delay(800);
    console.log(`[AuthService] OTP sent to ${identifier}: 0369`);
  },

  /**
   * Verify OTP (Mock: always accepts '0369')
   */
  verifyOtp: async (identifier: string, code: string): Promise<boolean> => {
    await delay(1000);
    return code === '0369';
  },

  /**
   * Create a new account
   */
  createAccount: async (payload: { identifier: string; name: string; password?: string }): Promise<User> => {
    await delay(1500);
    const usersJson = await SecureStore.getItemAsync(USERS_STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: payload.name,
      handle: `@${payload.name.toLowerCase().replace(/\s/g, '')}`,
      avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
      bio: 'New Listener',
      joinedAt: new Date().toISOString(),
      followers: 0,
      following: 0,
      balance: 0, // Initial balance
      email: payload.identifier.includes('@') ? payload.identifier : undefined,
    };

    users.push(newUser);
    await SecureStore.setItemAsync(USERS_STORAGE_KEY, JSON.stringify(users));
    await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(newUser));

    return newUser;
  },

  /**
   * Sign in existing user (Mock password check)
   */
  signIn: async (identifier: string, password?: string): Promise<User> => {
    await delay(1000);
    const usersJson = await SecureStore.getItemAsync(USERS_STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // In a real app we'd check password. Here we just return the user if found.
    // If not found in DB but is "demo", return mock demo user.
    const user = users.find(u => u.email === identifier || u.handle === identifier);

    if (user) {
      await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }

    if (identifier === 'demo@lstnr.com') {
      const demoUser: User = {
        id: 'demo_123',
        name: 'Demo User',
        handle: '@demouser',
        avatar: 'https://i.pravatar.cc/150?u=demo',
        bio: 'Demo Account',
        joinedAt: new Date().toISOString(),
        followers: 100,
        following: 50,
        balance: 1000,
        email: 'demo@lstnr.com',
      };
      await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(demoUser));
      return demoUser;
    }

    throw new Error('Invalid credentials');
  },

  /**
   * Get current session
   */
  getSession: async (): Promise<User | null> => {
    try {
      const json = await SecureStore.getItemAsync(CURRENT_USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
  }
};
