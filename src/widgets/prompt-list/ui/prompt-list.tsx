"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

import type { ViewMode } from "@features/prompt-filters";
import type { GetPromptsSort, GetPromptsVisibility } from "@/types/api";
import { useInfinitePrompts } from "@features/prompt-filters";
import { PromptCard, PromptRow } from "@entities/prompt";
import { PromptsListSkeleton } from "./prompt-list-skeleton";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";

interface PromptListProps {
  viewMode: ViewMode;
  search?: string;
  sort: GetPromptsSort;
  folderId?: string;
  tagIds: string[];
  visibility?: GetPromptsVisibility;
  hasActiveFilters: boolean;
  onCreatePrompt?: () => void;
  onClearFilters?: () => void;
}

export function PromptList({
  viewMode,
  search,
  sort,
  folderId,
  tagIds,
  visibility,
  hasActiveFilters,
  onCreatePrompt,
  onClearFilters,
}: PromptListProps): React.ReactElement {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfinitePrompts({
    search,
    sort,
    folder_id: folderId,
    tag_ids: tagIds.length > 0 ? tagIds.join(",") : undefined,
    visibility,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <PromptsListSkeleton viewMode={viewMode} />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const prompts = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  if (prompts.length === 0) {
    return (
      <EmptyState
        search={search}
        hasActiveFilters={hasActiveFilters}
        onCreatePrompt={onCreatePrompt}
        onClearFilters={onClearFilters}
      />
    );
  }

  if (viewMode === "expanded") {
    return (
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>

        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {prompts.map((prompt) => (
          <PromptRow key={prompt.id} prompt={prompt} />
        ))}
      </div>

      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
