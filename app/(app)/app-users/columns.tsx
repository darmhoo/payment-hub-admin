'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type AppUsers = {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
};

interface AppUsersColumnActions {
  onView: (user: AppUsers) => void;
}

export const getColumns = ({
  onView,
}: AppUsersColumnActions): ColumnDef<AppUsers>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-zinc-500">
        {row.original.id}
      </span>
    ),
  },

  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.name ?? '—'}
      </span>
    ),
  },

  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className="text-sm text-zinc-600">
        {row.original.email}
      </span>
    ),
  },

  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const value = row.original.created_at;

      if (!value) {
        return <span className="text-zinc-400">—</span>;
      }

      return (
        <span className="text-sm text-zinc-600">
          {new Date(value).toLocaleString()}
        </span>
      );
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="User actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(user)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];