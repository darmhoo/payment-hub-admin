"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function AppPageHeader({
  title,
  description,
  action,
  className,
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4",
        className
      )}
    >
      {/* Title & Description */}
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {action && (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}