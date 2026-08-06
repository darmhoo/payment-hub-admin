// components/ui/loader.tsx

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

const sizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-10",
};

export function Loader({ size = "md", text, className }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-6",
        className,
      )}
    >
      <LoaderCircle className={`${sizes[size]} animate-spin text-primary`} />

      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
