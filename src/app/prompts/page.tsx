"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import type { ViewMode } from "@features/prompt-filters";
import type { GetPromptsSort } from "@shared/types";
import { useDebounce } from "@shared/hooks";
import { useIsMobile } from "@shared/hooks";
import { usePromptsFilters } from "@features/prompt-filters";
import { useViewMode } from "@features/prompt-filters";
import { Button } from "@shared/ui";
import { CreatePromptModal } from "@features/prompt-crud";
import {
  ActiveFilters,
  PromptsFilters,
  PromptsFiltersMobile,
} from "@features/prompt-filters";
import { PromptsSearch } from "@features/prompt-filters";
import { PromptsSortDropdown, DEFAULT_SORT } from "@features/prompt-filters";
import { ViewModeToggle } from "@features/prompt-filters";
import { FoldersSidebar, FoldersMobileSheet } from "@widgets/folder-sidebar";
import { PromptList } from "@widgets/prompt-list";

function getInitialModalState(searchParams: URLSearchParams): boolean {
  return searchParams.get("new") === "true";
}

export default function PromptsPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(() =>
    getInitialModalState(new URLSearchParams(searchParams.toString()))
  );
  const [searchInput, setSearchInput] = useState("");
  const { viewMode, toggleViewMode } = useViewMode();
  const isMobile = useIsMobile();

  // Force compact view on mobile
  const effectiveViewMode: ViewMode = isMobile ? "compact" : viewMode;

  // Handle keyboard shortcut for creating prompt
  useEffect(() => {
    const handleCreatePrompt = () => setIsCreateModalOpen(true);
    window.addEventListener("create-prompt", handleCreatePrompt);
    return () => window.removeEventListener("create-prompt", handleCreatePrompt);
  }, []);

  // Clean up ?new=true from URL after modal is shown
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      const query = params.toString();
      router.replace(query ? `?${query}` : "/prompts", { scroll: false });
    }
  }, [searchParams, router]);

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

          <PromptList
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
