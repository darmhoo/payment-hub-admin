"use client";

import {
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  Wallet,
} from "lucide-react";

import AppPageHeader from "@/components/app-page-header";
import AppStatCard from "@/components/app-stat-card";
import PageContainer from "@/components/app-page-container";
import AppToolbar from "@/components/app-toolbar";
import AppTable from "@/components/app-table";

import { Button } from "@/components/ui/button";

const transactions = [
  {
    customer: "John Doe",
    amount: "₦25,000",
    status: "Success",
    method: "Card",
    date: "Today",
  },
  {
    customer: "Jane Smith",
    amount: "₦15,000",
    status: "Pending",
    method: "Transfer",
    date: "Today",
  },
];

const columns = [
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>

      <AppPageHeader
        title="Dashboard"
        description="Monitor payments, merchants and system activity."
        
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <AppStatCard
          title="Revenue"
          value="₦24.8M"
          icon={<DollarSign className="h-5 w-5 text-zinc-400" />}
        />

        <AppStatCard
          title="Transactions"
          value="12,486"
          icon={<CreditCard className="h-5 w-5 text-zinc-400" />}
        />

        <AppStatCard
          title="Merchants"
          value="245"
          icon={<Wallet className="h-5 w-5 text-zinc-400" />}
        />

        <AppStatCard
          title="Users"
          value="28"
          icon={<Users className="h-5 w-5 text-zinc-400" />}
        />

      </div>

      <AppToolbar
        search=""
        onSearch={() => {}}
        placeholder="Search transactions..."
      />

      <AppTable
        columns={columns}
        data={transactions}
      />

    </PageContainer>
  );
}