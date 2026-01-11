import { Skeleton } from "@/components/ui/skeleton";

export function SharedPromptDetailSkeleton(): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-3/4" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-5 w-full" />
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="flex gap-2 mt-6">
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}
