"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import AppPageHeader from "@/components/app-page-header";
import AppStatCard from "@/components/app-stat-card";
import AppToolbar from "@/components/app-toolbar";
import PageContainer from "@/components/app-page-container";
import AppTable from "@/components/app-table";

import { Button } from "@/components/ui/button";

import { columns } from "./column";

const mockTransactions = [
  {
    id: "1",
    reference: "TXN-100001",
    customer: "John Doe",
    amount: 25000,
    paymentMethod: "Card",
    status: "success",
    createdAt: "2026-08-06 12:30 PM",
  },
  {
    id: "2",
    reference: "TXN-100002",
    customer: "Jane Smith",
    amount: 12000,
    paymentMethod: "Transfer",
    status: "pending",
    createdAt: "2026-08-06 11:10 AM",
  },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockTransactions.filter((transaction) =>
      transaction.customer
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <PageContainer>

      <AppPageHeader
        title="Transactions"
        description="Monitor all payment transactions."
        action={
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <AppStatCard
          title="Total Volume"
          value="₦24.8M"
        />

        <AppStatCard
          title="Transactions"
          value="12,486"
        />

        <AppStatCard
          title="Successful"
          value="12,120"
        />

        <AppStatCard
          title="Failed"
          value="366"
        />

      </div>

      <AppToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search transaction..."
      />

      <AppTable
        columns={columns}
        data={filtered}
      />

    </PageContainer>
  );
}