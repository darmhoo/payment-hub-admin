"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Transaction = {
  id: string;
  reference: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      `₦${row.original.amount.toLocaleString()}`,
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={
            status === "success"
              ? "default"
              : status === "pending"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: () => (
      <Button
        variant="ghost"
        size="icon"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];