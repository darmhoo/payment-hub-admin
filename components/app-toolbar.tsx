'use client';

import type { ReactNode } from 'react';
import { Search, RotateCw } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  placeholder = 'Search...',
  onRefresh,
  children,
  actions,
}: AppToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side */}
      <div className="flex flex-1 items-center gap-2">
        {/* Search */}
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border bg-white px-3 py-2 dark:bg-background">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />

          <Input
            value={search}
            placeholder={placeholder}
            onChange={(e) => onSearch(e.target.value)}
            className="h-auto w-full border-none bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0"
          />
        </div>

        {children}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            type="button"
            aria-label="Refresh"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        )}

        {actions}
      </div>
    </div>
  );
}
