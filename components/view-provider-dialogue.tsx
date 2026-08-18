"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Provider } from "@/components/providers/providers-provider";

interface ViewProviderDialogProps {
  provider: Provider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

function DetailItem({
  label,
  value,
  className = "",
}: DetailItemProps) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

function ViewProviderDialog({
  provider,
  open,
  onOpenChange,
}: ViewProviderDialogProps) {
  if (!provider) return null;

  const details = [
    {
      label: "Name",
      value: provider.Name,
    },
    {
      label: "Driver",
      value: provider.Driver,
    },
    {
      label: "Category",
      value: provider.Category,
      className: "capitalize",
    },
    {
      label: "Environment",
      value: provider.Environment,
      className: "capitalize",
    },
    {
      label: "Priority",
      value: provider.Priority,
    },
    {
      label: "Status",
      value: provider.Active ? "Active" : "Inactive",
      valueClassName: provider.Active
        ? "text-emerald-600"
        : "text-red-600",
    },
    {
      label: "Default Provider",
      value: provider.IsDefault ? "Yes" : "No",
    },
    {
      label: "Provider ID",
      value: provider.ID,
      className: "break-all text-sm",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Provider Details</DialogTitle>
          <DialogDescription>
            View provider configuration and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Information */}
          <section>
            <h3 className="mb-4 font-semibold">
              General Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(
                ({
                  label,
                  value,
                  className,
                  valueClassName,
                }) => (
                  <DetailItem
                    key={label}
                    label={label}
                    value={
                      <span className={valueClassName}>
                        {value || "—"}
                      </span>
                    }
                    className={className}
                  />
                )
              )}
            </div>
          </section>

          {/* Settings */}
          <section>
            <h3 className="mb-3 font-semibold">Settings</h3>

            {provider.Settings?.length ? (
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {provider.Settings.map((setting) => (
                  <div
                    key={setting.ID}
                    className="rounded-lg border bg-muted/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="break-all text-sm font-medium">
                        {setting.Key}
                      </span>

                      <span
                        className="shrink-0 text-xs text-muted-foreground"
                        title={
                          setting.Encrypted
                            ? "This value is encrypted"
                            : "This value is stored as plain text"
                        }
                      >
                        {setting.Encrypted
                          ? "Encrypted"
                          : "Plain text"}
                      </span>
                    </div>

                    <p className="mt-2 break-all text-sm text-muted-foreground">
                      {setting.Encrypted
                        ? "••••••••"
                        : setting.Value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No settings configured.
                </p>
              </div>
            )}
          </section>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewProviderDialog;