"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Provider } from "../providers/columns";

export type Users = {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: "active" | "inactive";
  last_login_at?: Date;
};

export const columns: ColumnDef<Users, unknown>[] = [
  {
    id: "sn",
    header: "S/N",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    accessorFn: (row) => (row.last_login_at ? new Date(row.last_login_at).toLocaleString() : "N/A"),
  },
];
