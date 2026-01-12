import type { ViewMode } from "@features/prompt-filters";
import { PromptCardSkeleton, PromptRowSkeleton } from "@entities/prompt";

const SKELETON_COUNT = 6;

interface PromptsListSkeletonProps {
  viewMode: ViewMode;
}

export function PromptsListSkeleton({
  viewMode,
}: PromptsListSkeletonProps): React.ReactElement {
  if (viewMode === "expanded") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <PromptCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <PromptRowSkeleton key={index} />
      ))}
    </div>
  );
}
