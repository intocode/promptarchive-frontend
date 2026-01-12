import { cn } from "@shared/lib";
import { Skeleton } from "@shared/ui";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@shared/ui";

interface PromptCardSkeletonProps {
  className?: string;
}

export function PromptCardSkeleton({
  className,
}: PromptCardSkeletonProps): React.ReactElement {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-7 w-7 rounded-md shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
