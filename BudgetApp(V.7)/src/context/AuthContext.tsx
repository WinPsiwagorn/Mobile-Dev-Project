"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUser } from '../data/mock/mockUser';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Test credentials
const TEST_CREDENTIALS = {
  email: 'test@test.com',
  password: '123456',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(null);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check both test credentials and mock user
      if ((email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) ||
          (email === mockUser.email && password === 'password')) {
        // Create a user object based on the credentials used
        const loggedInUser: User = email === TEST_CREDENTIALS.email ? {
          id: '2',
          name: 'Test User',
          email: TEST_CREDENTIALS.email,
          currency: 'USD',
          language: 'English',
          notifications: {
            push: true,
            email: true,
            sms: false,
          },
          preferences: {
            darkMode: true,
            biometricLogin: false,
          },
          subscription: {
            type: 'premium',
            validUntil: '2024-12-31',
          },
        } : mockUser;

        setUser(loggedInUser);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

