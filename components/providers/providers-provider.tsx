'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type ProviderSetting = {
  ID: string;
  ProviderID: string;
  Key: string;
  Value: string;
  Encrypted: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
};

export type Provider = {
  ID: string;
  Name: string;
  Category: string;
  Driver: string;
  Environment: string;
  Active: boolean;
  IsDefault: boolean;
  Priority: number;
  Settings: ProviderSetting[];
  CreatedAt?: string;
  UpdatedAt?: string;
};

type ProvidersContextType = {
  providers: Provider[];
  loading: boolean;
  error: string | null;
  fetchProviders: () => Promise<void>;
  reloadProviders: () => Promise<void>;
};

const ProvidersContext = createContext<ProvidersContextType | null>(null);

export function ProvidersProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/providers', {
        method: 'GET',
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error ?? result?.message ?? 'Failed to fetch providers');
      }

      const providerData = result?.providers?.data?.data ?? [];

      setProviders(Array.isArray(providerData) ? providerData : []);
    } catch (error) {
      console.error('Error fetching providers:', error);

      setProviders([]);

      setError(error instanceof Error ? error.message : 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadProviders = useCallback(async () => {
    await fetchProviders();
  }, [fetchProviders]);

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        loading,
        error,
        fetchProviders,
        reloadProviders,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProvidersContext);

  if (!context) {
    throw new Error('useProviders must be used within ProvidersProvider');
  }

  return context;
}
