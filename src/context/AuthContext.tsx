import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, getUser } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  onboarded: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(async () => {
      const mockUser = await getUser();
      setUser({ ...mockUser, name: email.split('@')[0] }); // distinct mock
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setOnboarded(false);
  };

  const completeOnboarding = () => {
    setOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, onboarded, completeOnboarding }}>
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
