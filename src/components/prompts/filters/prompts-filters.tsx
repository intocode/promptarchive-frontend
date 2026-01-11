"use client";

import { X } from "lucide-react";

import type { GetPromptsVisibility } from "@/types/api";
import { Button } from "@/components/ui/button";
import { FolderFilter } from "./folder-filter";
import { TagFilter } from "./tag-filter";
import { VisibilityFilter } from "./visibility-filter";

interface PromptsFiltersProps {
  folderId?: string;
  tagIds: string[];
  visibility?: GetPromptsVisibility;
  onFolderChange: (id: string | undefined) => void;
  onTagsChange: (ids: string[]) => void;
  onVisibilityChange: (v: GetPromptsVisibility | undefined) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function PromptsFilters({
  folderId,
  tagIds,
  visibility,
  onFolderChange,
  onTagsChange,
  onVisibilityChange,
  onClearAll,
  hasActiveFilters,
}: PromptsFiltersProps): React.ReactElement {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <FolderFilter value={folderId} onChange={onFolderChange} />
      <TagFilter value={tagIds} onChange={onTagsChange} />
      <VisibilityFilter value={visibility} onChange={onVisibilityChange} />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
