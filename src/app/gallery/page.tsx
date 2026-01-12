"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AlertCircle, FileText, Loader2, RefreshCw, Search } from "lucide-react";

import type { GetPublicPromptsSort } from "@/types/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfinitePublicPrompts } from "@/hooks/use-infinite-public-prompts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublicPromptCard,
  PublicPromptCardSkeleton,
} from "@/components/gallery/public-prompt-card";

const SORT_OPTIONS = [
  { value: "-likes_count", label: "Popular" },
  { value: "-created_at", label: "Newest" },
] as const;

const DEFAULT_SORT: GetPublicPromptsSort = "-likes_count";

const SKELETON_COUNT = 6;

function GalleryListSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <PublicPromptCardSkeleton key={index} />
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
        Something went wrong while fetching public prompts.
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
}

function EmptyState({ search }: EmptyStateProps): React.ReactElement {
  if (search) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No prompts found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          No public prompts match &quot;{search}&quot;. Try a different search
          term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">No public prompts yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Be the first to share a prompt with the community!
      </p>
    </div>
  );
}

interface GalleryContentProps {
  search?: string;
  sort?: GetPublicPromptsSort;
}

function GalleryContent({ search, sort }: GalleryContentProps): React.ReactElement {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfinitePublicPrompts({ search, sort });

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
    return <GalleryListSkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  const prompts = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  if (prompts.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PublicPromptCard key={prompt.id} prompt={prompt} />
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

export default function GalleryPage(): React.ReactElement {
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<GetPublicPromptsSort>(DEFAULT_SORT);
  const debouncedSearch = useDebounce(searchInput, 300);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Public Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover and explore prompts shared by the community
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search public prompts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(value) => setSort(value as GetPublicPromptsSort)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <GalleryContent search={debouncedSearch} sort={sort} />
    </div>
  );
}
