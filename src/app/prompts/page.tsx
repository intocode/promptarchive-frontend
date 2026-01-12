"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { AlertCircle, FileText, Loader2, Plus, RefreshCw, Search } from "lucide-react";

import type { ViewMode } from "@/hooks/use-view-mode";
import type { GetPromptsSort, GetPromptsVisibility } from "@/types/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfinitePrompts } from "@/hooks/use-infinite-prompts";
import { useIsMobile } from "@/hooks/use-media-query";
import { usePromptsFilters } from "@/hooks/use-prompts-filters";
import { useViewMode } from "@/hooks/use-view-mode";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompts/prompt-card";
import { PromptCardSkeleton } from "@/components/prompts/prompt-card-skeleton";
import { PromptRow } from "@/components/prompts/prompt-row";
import { PromptRowSkeleton } from "@/components/prompts/prompt-row-skeleton";
import { CreatePromptModal } from "@/components/prompts/create-prompt-modal";
import {
  ActiveFilters,
  PromptsFilters,
  PromptsFiltersMobile,
} from "@/components/prompts/filters";
import { PromptsSearch } from "@/components/prompts/prompts-search";
import { PromptsSortDropdown, DEFAULT_SORT } from "@/components/prompts/prompts-sort";
import { ViewModeToggle } from "@/components/prompts/view-mode-toggle";
import { FoldersSidebar } from "@/components/folders/folders-sidebar";
import { FoldersMobileSheet } from "@/components/folders/folders-mobile-sheet";

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

interface EmptyStateProps {
  search?: string;
  hasActiveFilters?: boolean;
  onCreatePrompt?: () => void;
  onClearFilters?: () => void;
}

function EmptyState({
  search,
  hasActiveFilters,
  onCreatePrompt,
  onClearFilters,
}: EmptyStateProps): React.ReactElement {
  if (search || hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No prompts found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {search
            ? `No prompts match "${search}".`
            : "No prompts match the selected filters."}{" "}
          Try adjusting your search or filters.
        </p>
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters} className="mt-4">
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Start your prompt collection</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first prompt to begin organizing your AI workflows.
      </p>
      {onCreatePrompt && (
        <Button onClick={onCreatePrompt} className="mt-6">
          <Plus className="h-4 w-4" />
          Create your first prompt
        </Button>
      )}
    </div>
  );
}

interface PromptsContentProps {
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

function PromptsContent({
  viewMode,
  search,
  sort,
  folderId,
  tagIds,
  visibility,
  hasActiveFilters,
  onCreatePrompt,
  onClearFilters,
}: PromptsContentProps): React.ReactElement {
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

export default function PromptsPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { viewMode, toggleViewMode } = useViewMode();
  const isMobile = useIsMobile();

  // Force compact view on mobile
  const effectiveViewMode: ViewMode = isMobile ? "compact" : viewMode;

  const {
    filters,
    setFolderId,
    setTagIds,
    setVisibility,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  } = usePromptsFilters();

  const debouncedSearch = useDebounce(searchInput, 300);
  const sortParam = searchParams.get("sort");
  const sort = (sortParam as GetPromptsSort) || DEFAULT_SORT;

  const handleSortChange = (newSort: GetPromptsSort) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === DEFAULT_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "/prompts", { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-20 rounded-lg border bg-card">
            <FoldersSidebar
              selectedFolderId={filters.folderId}
              onFolderSelect={setFolderId}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">My Prompts</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and organize your AI prompts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PromptsSortDropdown value={sort} onChange={handleSortChange} />
              <ViewModeToggle viewMode={viewMode} onToggle={toggleViewMode} />
              <Button onClick={() => setIsCreateModalOpen(true)} className="hidden md:flex">
                <Plus className="h-4 w-4" />
                New Prompt
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Mobile Folders Sheet */}
            <div className="md:hidden">
              <FoldersMobileSheet
                selectedFolderId={filters.folderId}
                onFolderSelect={setFolderId}
              />
            </div>
            <PromptsFilters
              folderId={filters.folderId}
              tagIds={filters.tagIds}
              visibility={filters.visibility}
              onFolderChange={setFolderId}
              onTagsChange={setTagIds}
              onVisibilityChange={setVisibility}
              onClearAll={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
              hideFolderFilter
            />
            <PromptsFiltersMobile
              folderId={filters.folderId}
              tagIds={filters.tagIds}
              visibility={filters.visibility}
              onFolderChange={setFolderId}
              onTagsChange={setTagIds}
              onVisibilityChange={setVisibility}
              onClearAll={clearAllFilters}
              activeFilterCount={activeFilterCount}
              hideFolderFilter
            />
          </div>

          {hasActiveFilters && (
            <div className="mb-4 hidden md:block">
              <ActiveFilters
                folderId={filters.folderId}
                tagIds={filters.tagIds}
                visibility={filters.visibility}
                onRemoveFolder={() => setFolderId(undefined)}
                onRemoveTag={(id) => setTagIds(filters.tagIds.filter((t) => t !== id))}
                onRemoveVisibility={() => setVisibility(undefined)}
                onClearAll={clearAllFilters}
              />
            </div>
          )}

          <div className="mb-4">
            <PromptsSearch value={searchInput} onChange={setSearchInput} />
          </div>

          <PromptsContent
            viewMode={effectiveViewMode}
            search={debouncedSearch}
            sort={sort}
            folderId={filters.folderId}
            tagIds={filters.tagIds}
            visibility={filters.visibility}
            hasActiveFilters={hasActiveFilters}
            onCreatePrompt={() => setIsCreateModalOpen(true)}
            onClearFilters={clearAllFilters}
          />
        </div>
      </div>

      <CreatePromptModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
