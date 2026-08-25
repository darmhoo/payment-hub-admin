'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type Transaction = {
  reference: string;
  provider: string;
  customer: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
};

const columnHelper = createColumnHelper<Transaction>();

export const columns: ColumnDef<Transaction>[] = [
  columnHelper.display({
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
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  }),

  // I really dont know why these column are showing error but its working as intended
  columnHelper.accessor('reference', {
    header: 'Reference',
  }),

  columnHelper.accessor('customer', {
    header: 'Customer',
  }),

  columnHelper.accessor('provider', {
    header: 'Provider',
  }),

  columnHelper.accessor('amount', {
    header: 'Amount',

    cell: ({ getValue }) => {
      const amount = getValue();

      return `Ksh${amount.toLocaleString()}`;
    },
  }),

  columnHelper.accessor('status', {
    header: 'Status',

    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <Badge
          variant={
            status === 'success' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'
          }
        >
          {status}
        </Badge>
      );
    },
  }),

  columnHelper.accessor('date', {
    header: 'Date',

    cell: ({ getValue }) => {
      const date = getValue();
      return new Date(date).toLocaleString();
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),

    enableSorting: false,
    enableHiding: false,
  }),
];
