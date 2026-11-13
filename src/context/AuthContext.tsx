'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserId } from '@/lib/browser';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  phone?: string;
  birthday?: string;
  language?: string;
  causes?: string[];
  isProfilePublic?: boolean;
  createdAt?: string;
  role: 'user' | 'admin' | 'organizer';
}

export type ProfileUpdates = Partial<Pick<User, 'name' | 'avatar' | 'coverImage' | 'bio' | 'location' | 'phone' | 'birthday' | 'language' | 'causes' | 'isProfilePublic'>>;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdates) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'gcc_foundation_auth_user';
const ACCOUNTS_KEY = 'gcc_foundation_accounts';

function readAccounts(): Record<string, User> {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    return saved ? JSON.parse(saved) as Record<string, User> : {};
  } catch {
    return {};
  }
}

function saveAccount(user: User) {
  try {
    const accounts = readAccounts();
    accounts[user.email.toLowerCase()] = user;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Keep the account available in memory for the current browser session.
  }
}

function createUser(name: string, email: string, role: User['role'] = 'user'): User {
  return {
    id: `usr_${createBrowserId()}`,
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    bio: '',
    location: '',
    phone: '',
    birthday: '',
    language: 'English (US)',
    causes: [],
    isProfilePublic: false,
    createdAt: new Date().toISOString(),
    role,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
        if (parsed.email) saveAccount(parsed);
      }
    } catch {
      // Ignore unavailable or invalid browser storage.
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = readAccounts();
    const existing = accounts[normalizedEmail];
    const account = existing ?? createUser(
      normalizedEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase()),
      normalizedEmail,
      normalizedEmail.includes('admin') ? 'admin' : 'user',
    );
    setUser(account);
    saveAccount(account);
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (readAccounts()[normalizedEmail]) throw new Error('An account with this email already exists.');
    const account = createUser(name.trim(), normalizedEmail);
    setUser(account);
    saveAccount(account);
    return true;
  };

  const loginWithSocial = async (provider: 'google' | 'facebook') => {
    const email = `member@${provider}.com`;
    const accounts = readAccounts();
    const account = accounts[email] ?? createUser(`${provider[0].toUpperCase()}${provider.slice(1)} Member`, email);
    setUser(account);
    saveAccount(account);
  };

  const updateProfile = (updates: ProfileUpdates) => {
    if (!user) return;
    const updated = { ...user, ...updates, name: updates.name?.trim() || user.name };
    setUser(updated);
    saveAccount(updated);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore unavailable storage.
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, loginWithSocial, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
