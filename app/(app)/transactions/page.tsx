"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { DataTable } from "@/components/table/app-table";
import { Loader } from "@/components/ui/loader";
import { useLoading } from "@/hooks/use-loading";
import { Button } from "@/components/ui/button";

import PageContainer from "@/components/app-page-container";
import AppPageHeader from "@/components/app-page-header";

import { columns } from "./column";

export type Transaction = {
  reference: string;
  provider: string;
  customer: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
};

interface TransactionsResponse {
  transaction: {
    data: {
      data: Transaction[];
    };
  };
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { loading, withLoading } = useLoading();

  async function fetchTransactions(): Promise<TransactionsResponse> {
    const response = await fetch("/api/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    console.log("Transactions response:", data);

    if (!response.ok) {
      throw new Error(
        data?.error ??
          data?.message ??
          "Failed to fetch transactions"
      );
    }

    return data;
  }

  useEffect(() => {
    withLoading(fetchTransactions)
      .then((result) => {
        setTransactions(
          result.transaction?.data?.data ?? []
        );
      })
      .catch((error) => {
        console.error(
          "Error fetching transactions:",
          error
        );
      });
  }, []);

  return (
    <PageContainer className="min-h-screen bg-slate-100 space-y-2 p-2">
      <AppPageHeader
        title="Transactions"
        description="Monitor all payment transactions."
        action={
          <Button className="flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader text="Fetching transactions..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          emptyMessage="No transactions found."
        />
      )}
    </PageContainer>
  );
}
