"use client";

import { useEffect, useState } from "react";

import { Transaction } from "./column";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTransactions() {
    setLoading(true);

    try {
      const response = await fetch("/api/transactions");

      const data = await response.json();

      setTransactions(data.transactions ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    refresh: fetchTransactions,
  };
}