"use client";

import { type ColumnDef, type RowData } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Provider = {
  id: string;
  name: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<any, Provider, string>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];
