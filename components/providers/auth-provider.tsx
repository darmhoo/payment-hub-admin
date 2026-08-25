'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AuthUser = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void hydrate();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      refresh: async () => {
        try {
          setIsLoading(true);
          const response = await fetch('/api/auth/me', {
            cache: 'no-store',
            credentials: 'include',
          });
          if (!response.ok) {
            setUser(null);
            return;
          }
          const data = await response.json();
          setUser(data.user ?? null);
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      },
      login: (nextUser) => setUser(nextUser),
      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } finally {
          setUser(null);
        }
      },
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
