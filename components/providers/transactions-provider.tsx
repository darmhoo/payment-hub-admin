"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Transaction } from "@/app/(app)/transactions/column";

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
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
  const [transactions, setTransactions] = useState<Transaction[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ??
            data?.message ??
            `Failed to fetch transactions (${response.status})`
        );
      }

      const transactionData =
        data?.transaction?.data?.data ?? [];

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        refreshTransactions: fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used within TransactionsProvider"
    );
  }

  return context;
}