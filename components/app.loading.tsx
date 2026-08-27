'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface AppLoadingProps {
  rows?: number;
}

export default function AppLoading({ rows = 8 }: AppLoadingProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <Skeleton className="mb-6 h-10 w-64" />

      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="mt-2 h-3 w-40" />
            </div>

            <Skeleton className="h-8 w-20" />

            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
