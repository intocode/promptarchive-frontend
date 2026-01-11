"use client";

import { cn } from "@/lib/utils";

interface ImproveLoadingStateProps {
  className?: string;
}

export function ImproveLoadingState({
  className,
}: ImproveLoadingStateProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Improving your prompt...
      </p>
    </div>
  );
}
