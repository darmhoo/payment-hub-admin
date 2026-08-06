"use client";

import { ReactNode } from "react";
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
        "flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}