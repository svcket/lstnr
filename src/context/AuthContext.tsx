import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../services/mockApi';
import { AuthService } from '../services/authService';

export type AuthMethod = 'email' | 'whatsapp';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  splashLoading: boolean;
  
  // Auth Flow State
  authIdentifier: string;
  setAuthIdentifier: (val: string) => void;
  authMethod: AuthMethod;
  setAuthMethod: (val: AuthMethod) => void;
  userExists: boolean;
  
  // Actions
  checkUserExists: (identifier: string) => Promise<boolean>;
  requestOtp: () => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  createAccount: (name: string, password?: string) => Promise<void>;
  signIn: (password?: string) => Promise<void>;
  logout: () => Promise<void>;
  
  onboarded: boolean;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ONBOARDING_KEY = 'lstnr_onboarding_completed';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [splashLoading, setSplashLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onboarded, setOnboarded] = useState<boolean>(false);

  // Flow State
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  useEffect(() => {
    if (typeof onboarded !== 'boolean') {
       console.error('AuthContext: onboarded is not boolean!', typeof onboarded, onboarded);
    }
    if (typeof splashLoading !== 'boolean') {
       console.error('AuthContext: splashLoading is not boolean!', typeof splashLoading, splashLoading);
    }
  }, [onboarded, splashLoading]);

  const loadStorageData = async () => {
    try {
      // 1. User Session
      const savedUser = await AuthService.getSession();
      if (savedUser) {
        setUser(savedUser);
      }

      // 2. Onboarding State
      const hasOnboarded = await SecureStore.getItemAsync(ONBOARDING_KEY);
      // Strict boolean parsing: ONLY "true" string becomes true boolean
      const isOnboardedBool = hasOnboarded === 'true';
      setOnboarded(isOnboardedBool);
      
      console.log('[AuthContext] Loaded storage:', { 
        hasOnboardedRaw: hasOnboarded, 
        isOnboardedBool 
      });

    } catch (e) {
      console.error('Failed to load storage data', e);
    } finally {
      setTimeout(() => {
        // Ensure strictly boolean
        setSplashLoading(false);
      }, 1000);
    }
  };

  const checkUserExists = async (identifier: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await AuthService.lookupUserByIdentifier(identifier);
      setUserExists(result.exists);
      setAuthIdentifier(identifier);
      return result.exists;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    setIsLoading(true);
    try {
      await AuthService.sendOtp(authIdentifier);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await AuthService.verifyOtp(authIdentifier, code);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (name: string, password?: string) => {
    setIsLoading(true);
    try {
      const newUser = await AuthService.createAccount({
        identifier: authIdentifier,
        name,
        password
      });
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (password?: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await AuthService.signIn(authIdentifier, password);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const completeOnboarding = async () => {
    setOnboarded(true);
    await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      splashLoading, 
      
      authIdentifier,
      setAuthIdentifier,
      authMethod,
      setAuthMethod,
      userExists,
      
      checkUserExists,
      requestOtp,
      verifyOtp,
      createAccount,
      signIn,
      logout, 
      
      onboarded, 
      completeOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
