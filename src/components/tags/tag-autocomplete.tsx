"use client";

import * as React from "react";
import { X, Check, Plus, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useGetTags,
  usePostTags,
  getGetTagsQueryKey,
} from "@/lib/api/generated/endpoints/tags/tags";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";

export interface TagAutocompleteProps {
  /** Currently selected tags */
  value: GithubComIntocodePromptarchiveInternalServiceTagSummary[];
  /** Callback when selection changes */
  onChange: (tags: GithubComIntocodePromptarchiveInternalServiceTagSummary[]) => void;
  /** Maximum number of tags that can be selected */
  maxTags?: number;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Allow creating new tags inline (default: true) */
  allowCreate?: boolean;
}

export function TagAutocomplete({
  value,
  onChange,
  maxTags,
  placeholder = "Add tags...",
  disabled = false,
  className,
  allowCreate = true,
}: TagAutocompleteProps): React.ReactElement {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(inputValue, 300);
  const queryClient = useQueryClient();

  const isAtMaxTags = maxTags !== undefined && value.length >= maxTags;

  // Fetch tags with search
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

  // Filter out already selected tags
  const availableTags = React.useMemo(() => {
    const selectedIds = new Set(value.map((t) => t.id));
    return allTags.filter((t) => !selectedIds.has(t.id));
  }, [allTags, value]);

  // Check if input matches an existing tag exactly
  const exactMatch = React.useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase();
    return allTags.some((t) => t.name?.toLowerCase() === trimmed);
  }, [allTags, inputValue]);

  // Show "Create" option when there's input, no exact match, and creation is allowed
  const showCreateOption =
    allowCreate && inputValue.trim() && !exactMatch && !isAtMaxTags;

  // Total items in the dropdown
  const dropdownItems = React.useMemo(() => {
    const items: Array<
      | { type: "tag"; tag: GithubComIntocodePromptarchiveInternalServiceTagSummary }
      | { type: "create"; name: string }
    > = availableTags.map((tag) => ({ type: "tag" as const, tag }));

    if (showCreateOption) {
      items.push({ type: "create", name: inputValue.trim() });
    }

    return items;
  }, [availableTags, showCreateOption, inputValue]);

  // Create tag mutation
  const createTagMutation = usePostTags({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          const newTag: GithubComIntocodePromptarchiveInternalServiceTagSummary = {
            id: response.data.id,
            name: response.data.name,
            color: response.data.color,
          };
          onChange([...value, newTag]);
          setInputValue("");
          // Invalidate tags query to refresh the list
          queryClient.invalidateQueries({ queryKey: getGetTagsQueryKey() });
        }
      },
    },
  });

  // Reset highlighted index when dropdown items change
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [dropdownItems.length]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      highlightedEl?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSelectTag = (
    tag: GithubComIntocodePromptarchiveInternalServiceTagSummary
  ) => {
    if (isAtMaxTags) return;
    onChange([...value, tag]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string | undefined) => {
    onChange(value.filter((t) => t.id !== tagId));
    inputRef.current?.focus();
  };

  const handleCreateTag = (name: string) => {
    if (isAtMaxTags || createTagMutation.isPending) return;
    createTagMutation.mutate({ data: { name } });
  };

  const handleSelectItem = (index: number) => {
    const item = dropdownItems[index];
    if (!item) return;

    if (item.type === "tag") {
      handleSelectTag(item.tag);
    } else if (item.type === "create") {
      handleCreateTag(item.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== "Backspace") {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < dropdownItems.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : dropdownItems.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectItem(highlightedIndex);
        } else if (showCreateOption) {
          handleCreateTag(inputValue.trim());
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      case "Backspace":
        if (!inputValue && value.length > 0) {
          handleRemoveTag(value[value.length - 1].id);
        }
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            "border-input flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-3 py-1.5 shadow-xs transition-[color,box-shadow]",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Selected tags */}
          {value.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {tag.name}
              <button
                type="button"
                className="hover:bg-muted-foreground/20 ml-0.5 rounded-full p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag.id);
                }}
                disabled={disabled}
                aria-label={`Remove ${tag.name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}

          {/* Input */}
          {!isAtMaxTags && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
              className="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls="tag-listbox"
              aria-autocomplete="list"
            />
          )}

          {/* Max tags indicator */}
          {isAtMaxTags && (
            <span className="text-muted-foreground text-xs">
              Max {maxTags} tags
            </span>
          )}
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          ref={listRef}
          id="tag-listbox"
          role="listbox"
          className="max-h-[200px] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          ) : dropdownItems.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center text-sm">
              No tags found
            </div>
          ) : (
            dropdownItems.map((item, index) => {
              const isHighlighted = index === highlightedIndex;

              if (item.type === "tag") {
                const isSelected = value.some((t) => t.id === item.tag.id);
                return (
                  <div
                    key={item.tag.id}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                      isHighlighted && "bg-accent text-accent-foreground",
                      !isHighlighted && "hover:bg-accent/50"
                    )}
                    onClick={() => handleSelectTag(item.tag)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{item.tag.name}</span>
                  </div>
                );
              }

              // Create option
              return (
                <div
                  key="create-option"
                  data-index={index}
                  role="option"
                  aria-selected={false}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                    isHighlighted && "bg-accent text-accent-foreground",
                    !isHighlighted && "hover:bg-accent/50",
                    createTagMutation.isPending && "opacity-50"
                  )}
                  onClick={() => handleCreateTag(item.name)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {createTagMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  <span>Create &quot;{item.name}&quot;</span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
