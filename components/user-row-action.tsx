"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "@/app/(app)/users/columns";

interface Props {
  user: User;
}

export default function UserRowActions({
  user,
}: Props) {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          size="icon"
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

        <DropdownMenuItem className="text-red-600">
          Delete User
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}