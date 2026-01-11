"use client";

import * as React from "react";
import { Tag, X, Loader2, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetTags } from "@/lib/api/generated/endpoints/tags/tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TagFilterProps {
  value: string[];
  onChange: (ids: string[]) => void;
}

export function TagFilter({ value, onChange }: TagFilterProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data: tagsResponse, isLoading } = useGetTags(
    { search: debouncedSearch || undefined },
    {
      query: {
        enabled: isOpen,
        staleTime: 30000,
      },
    }
  );

  const allTags = React.useMemo(
    () => tagsResponse?.data ?? [],
    [tagsResponse?.data]
  );

  const selectedTags = React.useMemo(
    () => allTags.filter((tag) => tag.id && value.includes(tag.id)),
    [allTags, value]
  );

  const handleToggleTag = (tagId: string | undefined) => {
    if (!tagId) return;

    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
    setSearchInput("");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-start",
            value.length > 0 && "border-primary/50"
          )}
        >
          <Tag className="mr-2 h-4 w-4" />
          <span className="truncate">Tags</span>
          {value.length > 0 && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5">
              {value.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Search tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-8"
          />
        </div>

        <div className="max-h-[200px] overflow-y-auto border-t">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : allTags.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No tags found
            </div>
          ) : (
            allTags.map((tag) => {
              const isSelected = tag.id ? value.includes(tag.id) : false;
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm",
                    "hover:bg-accent/50 transition-colors",
                    isSelected && "bg-accent/30"
                  )}
                  onClick={() => handleToggleTag(tag.id)}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{tag.name}</span>
                </button>
              );
            })
          )}
        </div>

        {value.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-muted-foreground"
              onClick={handleClearAll}
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
