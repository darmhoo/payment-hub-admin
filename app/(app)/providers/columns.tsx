"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";

export type Provider = {
  ID: string;
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

  {
    header: "Actions",
    cell: (info) => {
      console.log("Row Info:", info); // Log the entire row info to the console
      const provider = info.row.original;
      console.log("Provider ID:", provider.ID); // Log the provider ID to the console
      return (
        <div className="flex gap-2">
          <a
            href={`/providers/${provider.ID}`}
            className="text-blue-500 hover:underline"
          >
            View
          </a>
        </div>
      );
    },
  },
];
