'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import UserAvatar from '@/components/user-avatar';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: 'active' | 'blocked';
  last_login_at?: string | Date | null;
};

type UserColumnActions = {
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onChangeStatus: (user: User) => void;
  onDelete: (user: User) => void;
};

export const getColumns = ({
  onEdit,
  onChangeRole,
  onChangeStatus,
  onDelete,
}: UserColumnActions): ColumnDef<User>[] => [
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
    accessorKey: 'name',
    header: 'User',

    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />

          <div className="space-y-1">
            <p className="font-medium text-zinc-900">{user.name}</p>

            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: 'role',
    header: 'Role',

    cell: ({ row }) => {
      const role = row.original.role;

      return <span className="capitalize">{role?.replace('_', ' ') ?? '—'}</span>;
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',

    cell: ({ row }) => {
      const status = row.original.status ?? 'blocked';

      const isActive = status === 'active';

      return (
        <Badge
          variant={isActive ? 'default' : 'outline'}
          className={
            isActive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'text-red-600'
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: 'last_login_at',
    header: 'Last Login',

    cell: ({ row }) => {
      const value = row.original.last_login_at;

      if (!value) {
        return <span className="text-sm text-zinc-400">Never</span>;
      }

      return <span className="text-sm text-zinc-600">{new Date(value).toLocaleString()}</span>;
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
                aria-label={`Actions for ${user.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem onClick={() => onEdit(user)}>Edit User</DropdownMenuItem> */}

            <DropdownMenuItem onClick={() => onChangeRole(user)}>Change Role</DropdownMenuItem>

            <DropdownMenuItem onClick={() => onChangeStatus(user)}>Change Status</DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(user)}
            >
              Delete User
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
