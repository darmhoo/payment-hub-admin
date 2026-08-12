"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

export type Provider = {
  id: string;
  driver: string;
  category: string;
  name: string;
  priority: string;
  status?: "pending" | "processing" | "success" | "failed";
  email?: string;
};

const columnHelper = createColumnHelper<Provider>();

export const columns: ColumnDef<Provider, unknown>[] = [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

    
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
