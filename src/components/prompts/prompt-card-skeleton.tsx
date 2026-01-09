import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface PromptCardSkeletonProps {
  className?: string;
}

export function PromptCardSkeleton({
  className,
}: PromptCardSkeletonProps): React.ReactElement {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Skeleton className="h-3 w-28" />
      </CardFooter>
    </Card>
  );
}
