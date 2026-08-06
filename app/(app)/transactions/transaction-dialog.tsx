"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionDialog({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        Coming soon...

      </DialogContent>
    </Dialog>
  );
}