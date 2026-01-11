"use client";

import { Filter, X } from "lucide-react";

import type { GetPromptsVisibility } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FolderFilter } from "./folder-filter";
import { TagFilter } from "./tag-filter";
import { VisibilityFilter } from "./visibility-filter";

interface PromptsFiltersMobileProps {
  folderId?: string;
  tagIds: string[];
  visibility?: GetPromptsVisibility;
  onFolderChange: (id: string | undefined) => void;
  onTagsChange: (ids: string[]) => void;
  onVisibilityChange: (v: GetPromptsVisibility | undefined) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export function PromptsFiltersMobile({
  folderId,
  tagIds,
  visibility,
  onFolderChange,
  onTagsChange,
  onVisibilityChange,
  onClearAll,
  activeFilterCount,
}: PromptsFiltersMobileProps): React.ReactElement {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Filter prompts</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-2">
            <Label>Folder</Label>
            <FolderFilter value={folderId} onChange={onFolderChange} />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagFilter value={tagIds} onChange={onTagsChange} />
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <VisibilityFilter value={visibility} onChange={onVisibilityChange} />
          </div>
        </div>

        <SheetFooter>
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={onClearAll} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Clear all filters
            </Button>
          )}
          <SheetClose asChild>
            <Button className="w-full">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
