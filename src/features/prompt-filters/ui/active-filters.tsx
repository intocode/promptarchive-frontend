"use client";

import { X, Folder } from "lucide-react";

import type { GetPromptsVisibility } from "@/types/api";
import { useGetFolders } from "@shared/api/generated/endpoints/folders/folders";
import { useGetTags } from "@shared/api/generated/endpoints/tags/tags";
import { getVisibilityConfig } from "@entities/prompt";
import { Badge } from "@shared/ui";
import { Button } from "@shared/ui";

interface ActiveFiltersProps {
  folderId?: string;
  tagIds: string[];
  visibility?: GetPromptsVisibility;
  onRemoveFolder: () => void;
  onRemoveTag: (id: string) => void;
  onRemoveVisibility: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  folderId,
  tagIds,
  visibility,
  onRemoveFolder,
  onRemoveTag,
  onRemoveVisibility,
  onClearAll,
}: ActiveFiltersProps): React.ReactElement | null {
  const { data: foldersData } = useGetFolders();
  const { data: tagsData } = useGetTags();

  const folders = foldersData?.data ?? [];
  const tags = tagsData?.data ?? [];

  const hasActiveFilters =
    folderId !== undefined || tagIds.length > 0 || visibility !== undefined;

  if (!hasActiveFilters) {
    return null;
  }

  const selectedFolder = folders.find((f) => f.id === folderId);
  const selectedTags = tags.filter((t) => t.id && tagIds.includes(t.id));
  const visibilityConfig = visibility ? getVisibilityConfig(visibility) : null;
  const VisibilityIcon = visibilityConfig?.icon;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filters:</span>

      {selectedFolder && (
        <Badge variant="secondary" className="gap-1 pr-1">
          <Folder className="h-3 w-3" />
          {selectedFolder.name}
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={onRemoveFolder}
            aria-label={`Remove folder filter: ${selectedFolder.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {selectedTags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="gap-1 pr-1">
          {tag.name}
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={() => tag.id && onRemoveTag(tag.id)}
            aria-label={`Remove tag filter: ${tag.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {visibilityConfig && VisibilityIcon && (
        <Badge variant="secondary" className="gap-1 pr-1">
          <VisibilityIcon className="h-3 w-3" />
          {visibilityConfig.label}
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={onRemoveVisibility}
            aria-label={`Remove visibility filter: ${visibility}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-auto px-2 py-1 text-xs text-muted-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
