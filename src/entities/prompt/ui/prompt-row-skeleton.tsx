import { cn } from "@shared/lib";
import { Skeleton } from "@shared/ui";

interface PromptRowSkeletonProps {
  className?: string;
}

export function PromptRowSkeleton({
  className,
}: PromptRowSkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-4 py-3",
        "sm:flex-row sm:items-center sm:gap-4",
        className
      )}
    >
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );
}
