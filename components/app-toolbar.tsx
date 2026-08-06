"use client";

import { ReactNode } from "react";
import { Search, RotateCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AppToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;

  onRefresh?: () => void;

  children?: ReactNode;

  actions?: ReactNode;
}

export default function AppToolbar({
  search,
  onSearch,
  placeholder = "Search...",
  onRefresh,
  children,
  actions,
}: AppToolbarProps) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">

          <div className="relative w-full lg:max-w-sm">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <Input
              value={search}
              placeholder={placeholder}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />

          </div>

          {children}

        </div>

        <div className="flex items-center gap-2">

          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}

          {actions}

        </div>

      </div>

    </div>
  );
}