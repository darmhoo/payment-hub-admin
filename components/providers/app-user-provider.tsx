'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { notify } from '@/lib/toast';

export type AppUser = {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
};

type AppUsersContextType = {
  appUsers: AppUser[];
  loading: boolean;
  error: string | null;
  fetchAppUsers: () => Promise<void>;
  reloadAppUsers: () => Promise<void>;
};

const AppUsersContext = createContext<AppUsersContextType | null>(null);

export function AppUsersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users', {
        method: 'GET',
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            result?.message ??
            'Failed to fetch app users'
        );
      }

      const usersData =
        result?.users?.data ??
        result?.data ??
        result?.users ??
        [];

      setAppUsers(Array.isArray(usersData) ? usersData : []);

      notify.success('App users fetched successfully');
    } catch (error) {
      console.error('Error fetching app users:', error);

      setAppUsers([]);

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch app users'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadAppUsers = useCallback(async () => {
    await fetchAppUsers();
  }, [fetchAppUsers]);

  return (
    <AppUsersContext.Provider
      value={{
        appUsers,
        loading,
        error,
        fetchAppUsers,
        reloadAppUsers,
      }}
    >
      {children}
    </AppUsersContext.Provider>
  );
}

export function useAppUsers() {
  const context = useContext(AppUsersContext);

  if (!context) {
    throw new Error(
      'useAppUsers must be used within AppUsersProvider'
    );
  }

  return context;
}