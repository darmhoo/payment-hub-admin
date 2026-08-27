'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

import type { User } from '@/app/(app)/users/columns';

interface ChangeStatusDialogProps {
  user: User | null;
  open: boolean;
  submitting: boolean;
  onSubmit: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export default function EditStatusDialog({
  user,
  open,
  submitting,
  onSubmit,
  onOpenChange,
}: ChangeStatusDialogProps) {
  const isActive = user?.status === 'active';
  const newStatus = isActive ? 'blocked' : 'active';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>

          <DialogDescription>Change the status for {user?.email}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Current status</p>

            <p className="mt-1 font-medium capitalize">{user?.status || 'blocked'}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            This will change the user to <strong className="text-foreground">{newStatus}</strong>.
          </p>
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
            variant={isActive ? 'destructive' : 'default'}
            onClick={onSubmit}
            disabled={submitting || !user}
          >
            {submitting ? (
              <>
                <Loader />
                Changing...
              </>
            ) : (
              'Change Status'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
