'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { AuditLog } from '@/components/providers/audit-log-provider';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import UserAvatar from '@/components/user-avatar';


interface AuditLogColumnActions {
  onView: (provider: AuditLog) => void;
}


export const getColumns = ({ onView }: AuditLogColumnActions): ColumnDef<AuditLog>[] => [
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
    accessorKey: 'action',
    header: 'Action',
  },

  {
    accessorKey: 'actorName',
    header: 'Actor Name',
  },

  {
    accessorKey: 'entityType',
    header: 'Entity Type',
  },

  {
    accessorKey: 'ipAddress',
    header: 'IP Addresss',
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

          </DropdownMenuContent>
        </DropdownMenu>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];
