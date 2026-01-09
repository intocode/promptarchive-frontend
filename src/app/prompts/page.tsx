"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { useGetPrompts } from "@/lib/api/generated/endpoints/prompts/prompts";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompts/prompt-card";
import { PromptCardSkeleton } from "@/components/prompts/prompt-card-skeleton";

const SKELETON_COUNT = 6;

function PromptsListSkeleton(): React.ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <PromptCardSkeleton key={index} />
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

export default function PromptsPage(): React.ReactElement {
  const { data, isLoading, isError, refetch } = useGetPrompts();

  const prompts = data?.data ?? [];
  const hasPrompts = prompts.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Prompts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and organize your AI prompts
        </p>
      </div>

      {isLoading && <PromptsListSkeleton />}

      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && !hasPrompts && <EmptyState />}

      {!isLoading && !isError && hasPrompts && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}
