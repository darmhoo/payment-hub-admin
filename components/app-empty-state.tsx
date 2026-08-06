"use client";

import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppEmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function AppEmptyState({
  title,
  description,
  buttonText,
  onClick,
}: AppEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-white py-20">

      <div className="mx-auto max-w-md text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">

          <Inbox className="h-8 w-8 text-zinc-500" />

        </div>

        <h2 className="mt-6 text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          {description}
        </p>

        {buttonText && (
          <Button
            onClick={onClick}
            className="mt-8"
          >
            {buttonText}
          </Button>
        )}

      </div>

    </div>
  );
}