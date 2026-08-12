"use client";

import {
  Info,
  ArrowRight,
  Check,
  Clock3,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Transaction {
  reference: string;
  provider: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  {
    reference: "TRX-2026-00010",
    provider: "Paystack",
    amount: 30000,
    status: "success",
    date: "Today, 11:20 AM",
  },
  {
    reference: "TRX-2026-00009",
    provider: "Flutterwave",
    amount: 9600,
    status: "success",
    date: "Today, 10:45 AM",
  },
  {
    reference: "TRX-2026-00008",
    provider: "Interswitch",
    amount: 7800,
    status: "pending",
    date: "Today, 10:10 AM",
  },
  {
    reference: "TRX-2026-00007",
    provider: "Stripe",
    amount: 5000,
    status: "failed",
    date: "Today, 09:15 AM",
  },
  {
    reference: "TRX-2026-00006",
    provider: "Paystack",
    amount: 20000,
    status: "success",
    date: "Today, 08:40 AM",
  },
];

const formatCurrency = (value: number) => {
  return `Ksh${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
};

function TransactionStatus({
  status,
}: {
  status: Transaction["status"];
}) {
  if (status === "success") {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
        <Check className="h-3 w-3 text-emerald-600" />
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100">
        <Clock3 className="h-3 w-3 text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
      <X className="h-3 w-3 text-red-500" />
    </div>
  );
}

export default function RecentTransactions() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md rounded-xl border-zinc-200 shadow-sm">
      <CardContent className="p-4">

        {/* Header */}
        <div className="mb-4 flex items-center gap-1">
          <h3 className="text-sm font-semibold text-zinc-800">
            Recent Transactions
          </h3>

          <Info className="h-3.5 w-3.5 text-zinc-400" />
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.reference}
              className="flex items-center gap-2"
            >
              <div className="shrink-0">
                <TransactionStatus
                  status={transaction.status}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold text-zinc-700">
                  {transaction.reference}
                </p>

                <p className="text-[9px] text-zinc-500">
                  {transaction.provider}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-semibold text-zinc-700">
                  {formatCurrency(transaction.amount)}
                </p>

                <p className="text-[8px] text-zinc-400">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-zinc-100 pt-3">
          <button
            type="button"
            onClick={() => router.push("/transactions")}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View all transactions

            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </CardContent>
    </Card>
  );
}