'use client';

import { MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

export type Provider = {
  ID: string;
  Name: string;
  Category: string;
  Driver: string;
  Environment: string;
  Active: boolean;
  IsDefault: boolean;
  Priority: number;
  Settings: {
    ID: string;
    ProviderID: string;
    Key: string;
    Value: string;
    Encrypted: boolean;
  }[];
};

interface ProviderColumnActions {
  onView: (provider: Provider) => void;
  onEdit: (provider: Provider) => void;
}

export const getColumns = ({ onView, onEdit }: ProviderColumnActions): ColumnDef<Provider>[] => [
  {
    id: 'select',

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'sn',
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },

  {
    accessorKey: 'Driver',
    header: 'Driver',
  },

  {
    accessorKey: 'Category',
    header: 'Category',
  },

  {
    accessorKey: 'Name',
    header: 'Name',
  },

  {
    accessorKey: 'Priority',
    header: 'Priority',
  },

  {
    id: 'actions',
    header: 'Actions',

    cell: ({ row }) => {
      const provider = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions</span>
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(provider)}>View Provider</DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(provider)}>Edit Provider</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
