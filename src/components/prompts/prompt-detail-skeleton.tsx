import { Skeleton } from "@/components/ui/skeleton";

export function PromptDetailSkeleton(): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-3/4" />

        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-5 w-full mb-6" />

      <div className="space-y-2 rounded-lg border p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
