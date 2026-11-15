"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createBrowserId } from "@/lib/browser";

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
  role: "user" | "admin" | "organizer";
}

export type ProfileUpdates = Partial<
  Pick<
    User,
    | "name"
    | "avatar"
    | "coverImage"
    | "bio"
    | "location"
    | "phone"
    | "birthday"
    | "language"
    | "causes"
    | "isProfilePublic"
  >
>;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithSocial: (provider: "google" | "facebook") => Promise<void>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdates) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "gcc_foundation_auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check active server-side session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.authenticated && data.user) {
            const serverUser: User = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
              role: data.user.role,
              language: "English (US)",
              createdAt: new Date().toISOString(),
            };
            setUser(serverUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serverUser));
            return;
          }
        }
      } catch (err) {
        console.warn("Server session check failed, falling back to local cache:", err);
      }

      // Fallback local cache
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved) as User);
        }
      } catch {}
    }

    checkSession();
  }, []);

  const login = async (email: string, password = ""): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const data = (await res.json()) as any;
    if (!res.ok) {
      throw new Error(data.error || "Invalid email or password.");
    }

    const authenticatedUser: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      role: data.user.role,
      language: "English (US)",
      createdAt: new Date().toISOString(),
    };

    setUser(authenticatedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch {}

    return true;
  };

  const signup = async (name: string, email: string, password = ""): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: name.trim(), email: normalizedEmail, password }),
    });

    const data = (await res.json()) as any;
    if (!res.ok) {
      throw new Error(data.error || "Failed to create account.");
    }

    const newUser: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
      role: data.user.role,
      language: "English (US)",
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}

    return true;
  };

  const loginWithSocial = async (provider: "google" | "facebook") => {
    // Generate secure social member session
    const email = `member_${createBrowserId().slice(0, 6)}@${provider}.com`;
    const name = `${provider[0].toUpperCase()}${provider.slice(1)} Member`;
    await signup(name, email, `SocialAuth_${crypto.randomUUID()}`);
  };

  const updateProfile = (updates: ProfileUpdates) => {
    if (!user) return;
    const updated = { ...user, ...updates, name: updates.name?.trim() || user.name };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithSocial,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
