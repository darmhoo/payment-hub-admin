"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className,
}: Props) {
  return (
    <main
      className={cn(
        "mx-auto w-full space-y-4 p-6 lg:p-8",
        className
      )}
    >
      {children}
    </main>
  );
}