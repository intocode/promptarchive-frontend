"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AlertCircle, Loader2, Plus, RefreshCw } from "lucide-react";

import type { ViewMode } from "@/hooks/use-view-mode";
import { useInfinitePrompts } from "@/hooks/use-infinite-prompts";
import { useViewMode } from "@/hooks/use-view-mode";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompts/prompt-card";
import { PromptCardSkeleton } from "@/components/prompts/prompt-card-skeleton";
import { PromptRow } from "@/components/prompts/prompt-row";
import { PromptRowSkeleton } from "@/components/prompts/prompt-row-skeleton";
import { CreatePromptModal } from "@/components/prompts/create-prompt-modal";
import { ViewModeToggle } from "@/components/prompts/view-mode-toggle";

const SKELETON_COUNT = 6;

interface PromptsListSkeletonProps {
  viewMode: ViewMode;
}

function PromptsListSkeleton({
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

interface ErrorStateProps {
  onRetry: () => void;
}

function ErrorState({ onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-lg font-semibold">Failed to load prompts</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while fetching your prompts.
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-lg font-semibold">No prompts yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your prompts will appear here once you create them.
      </p>
    </div>
  );
}

interface PromptsContentProps {
  viewMode: ViewMode;
}

function PromptsContent({ viewMode }: PromptsContentProps): React.ReactElement {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfinitePrompts();

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
    return <EmptyState />;
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

export default function PromptsPage(): React.ReactElement {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Prompts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize your AI prompts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} onToggle={toggleViewMode} />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      <PromptsContent viewMode={viewMode} />

      <CreatePromptModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
