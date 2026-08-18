"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { Transaction } from "@/app/(app)/transactions/column";

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionsContext =
  createContext<TransactionsContextType | undefined>(
    undefined
  );

export function TransactionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/transactions",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            `Failed to fetch transactions (${response.status})`
        );
      }

      const transactionData =
        data?.transaction?.data?.data ??
        data?.data?.transactions ??
        data?.transactions ??
        [];

      setTransactions(
        Array.isArray(transactionData)
          ? transactionData
          : []
      );
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error
      );

      setTransactions([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTransactions = useCallback(
    async () => {
      await fetchTransactions();
    },
    [fetchTransactions]
  );

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        fetchTransactions,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(
    TransactionsContext
  );

  if (!context) {
    throw new Error(
      "useTransactions must be used within TransactionsProvider"
    );
  }

  return context;
}