"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AppStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
}

export default function AppStatCard({
  title,
  value,
  icon,
  subtitle,
}: AppStatCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm border-zinc-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            {title}
          </span>

          {icon}
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight">
          {value}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm text-zinc-500">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}