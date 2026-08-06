"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserAvatar from "@/components/user-avatar";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: "active" | "inactive";
  last_login_at?: string | Date | null;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />

          <div className="space-y-1">
            <p className="font-medium text-zinc-900">
              {user.name}
            </p>

            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.role}
      </Badge>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "inactive";

      return (
        <Badge
          variant={status === "active" ? "default" : "outline"}
          className={
            status === "active"
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => {
      const value = row.original.last_login_at;

      if (!value) {
        return (
          <span className="text-sm text-zinc-400">
            Never
          </span>
        );
      }

      return (
        <span className="text-sm text-zinc-600">
          {new Date(value).toLocaleString()}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "actions",
    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Edit User
          </DropdownMenuItem>

          <DropdownMenuItem>
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600 focus:text-red-600">
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];