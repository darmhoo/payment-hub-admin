'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { FieldLabel } from '@/components/ui/field';
import { notify } from '@/lib/toast';

import type { User } from '@/app/(app)/users/columns';

interface ChangeRoleDialogProps {
  user: User | null;
  open: boolean;
  role: string;
  submitting: boolean;
  onRoleChange: (role: string) => void;
  onSubmit: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export default function EditRoleDialog({
  user,
  open,
  role,
  submitting,
  onRoleChange,
  onSubmit,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const handleSubmit = async () => {
    if (!role.trim()) {
      notify.error('Role is required');
      return;
    }

    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>

          <DialogDescription>Change the role for {user?.email}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <FieldLabel>Current Role</FieldLabel>

            <div className="rounded-md bg-muted px-3 py-2 text-sm">{user?.role || 'No role'}</div>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="new-role">New Role</FieldLabel>

            <Input
              id="new-role"
              type="select"
              value={role}
              onChange={(event) => onRoleChange(event.target.value)}
              placeholder="admin"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !user || !role.trim()}
          >
            {submitting ? (
              <>
                <Loader />
                Changing...
              </>
            ) : (
              'Change Role'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
