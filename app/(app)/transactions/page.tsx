"use client";

import { useCallback, useEffect, useState } from "react";
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
  transaction?: {
    data?: {
      data?: Transaction[];
    };
  };
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { loading, withLoading } = useLoading();

  const fetchTransactions = useCallback(
    async (): Promise<TransactionsResponse> => {
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
            `Failed to fetch transactions (${response.status})`
        );
      }

      return data;
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    withLoading(fetchTransactions)
      .then((result) => {
        if (!mounted) return;

        const transactionData =
          result?.transaction?.data?.data ?? [];

        setTransactions(transactionData);
      })
      .catch((error) => {
        if (!mounted) return;

        console.error("Error fetching transactions:", error);
        setTransactions([]);
      });

    return () => {
      mounted = false;
    };

  }, [fetchTransactions]);

  const exportToCSV = useCallback(() => {
    if (!transactions.length) {
      return;
    }

    const headers = [
      "Reference",
      "Provider",
      "Customer",
      "Amount",
      "Status",
      "Date",
    ];

    const rows = transactions.map((transaction) => [
      transaction.reference,
      transaction.provider,
      transaction.customer,
      transaction.amount,
      transaction.status,
      transaction.date,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const escapedValue = String(value).replace(
              /"/g,
              '""'
            );

            return `"${escapedValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `transactions-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [transactions]);

  return (
    <PageContainer className="min-h-screen space-y-2 p-4">
      <AppPageHeader
        title="Transactions"
        description="Monitor all payment transactions."
        action={
          <Button
            type="button"
            onClick={exportToCSV}
            disabled={!transactions.length}
          >
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