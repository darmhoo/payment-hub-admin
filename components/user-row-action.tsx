"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { User } from "@/app/(app)/users/columns";

interface UserRowActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserRowActions({
  user,
  onEdit,
  onResetPassword,
  onDelete,
}: UserRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />

              <span className="sr-only">
                Open user actions
              </span>
            </Button>
          }
        />

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
            }}
          >
            Edit User
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              onResetPassword(user);
            }}
          >
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              onDelete(user);
            }}
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit User
            </DialogTitle>

            <DialogDescription>
              Update {user.name}&apos;s account information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Name
              </label>

              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                defaultValue={user.name}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                defaultValue={user.email}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Role
              </label>

              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                defaultValue={user.role}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                onEdit(user);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}