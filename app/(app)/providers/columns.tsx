"use client";

import { type ColumnDef } from "@tanstack/react-table";

export type Provider = {
  id: string;
  driver: string;
  category: string;
  name: string;
  priority: string;
  status?: "pending" | "processing" | "success" | "failed";
  email?: string;
};

export const columns: ColumnDef<Provider, unknown>[] = [
  {
    id: "sn",
    header: "S/N",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "Driver",
    header: "Driver",
  },
  {
    accessorKey: "Category",
    header: "Category",
  },
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "Priority",
    header: "Priority",
  },
];
