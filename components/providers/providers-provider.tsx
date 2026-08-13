"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ProviderSetting = {
  key: string;
  value: string;
  encrypted: boolean;
};

export type Provider = {
  id: string;
  name: string;
  category: string;
  driver: string;
  environment: string;
  active: boolean;
  is_default: boolean;
  priority: number;
  settings?: ProviderSetting[];
};

type ProvidersContextType = {
  providers: Provider[];
  loading: boolean;
  reloadProviders: () => Promise<void>;
};

const ProvidersContext =
  createContext<ProvidersContextType | null>(null);

export function ProvidersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/providers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      console.log("Providers response:", result);

      if (!response.ok) {
        throw new Error(
          result?.error ??
            result?.message ??
            "Failed to fetch providers"
        );
      }

      const providerData =
        result?.providers?.data?.data ??
        result?.providers?.data ??
        result?.providers ??
        result?.data?.providers?.data?.data ??
        result?.data?.providers ??
        [];

      setProviders(
        Array.isArray(providerData)
          ? providerData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching providers:",
        error
      );

      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        loading,
        reloadProviders: fetchProviders,
      }}
    >
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const context = useContext(ProvidersContext);

  if (context === null) {
    throw new Error(
      "useProviders must be used within ProvidersProvider"
    );
  }

  return context;
}