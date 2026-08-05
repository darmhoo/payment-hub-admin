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
    accessorKey: "driver",
    header: "Driver",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
];
