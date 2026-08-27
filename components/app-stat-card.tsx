'use client';

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AppStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
}

export default function AppStatCard({ title, value, icon, subtitle }: AppStatCardProps) {
  return (
    <Card className="rounded-xl border-zinc-200 shadow-sm">
      <CardContent>
        <div className="flex items-center justify-between wrap-anywhere">
          <span className="text-xl font-heading text-zinc-500 ">{title}</span>

          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">{value}</h2>

        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
