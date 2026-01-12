"use client";

import * as React from "react";
import { Folder, Check, Plus, Loader2, FolderOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import type { GithubComIntocodePromptarchiveInternalServiceFolderSummary } from "@/types/api";
import { cn } from "@shared/lib";
import {
  useGetFolders,
  usePostFolders,
  getGetFoldersQueryKey,
} from "@shared/api/generated/endpoints/folders/folders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui";

export interface FolderSelectorProps {
  /** Currently selected folder (null for uncategorized) */
  value: GithubComIntocodePromptarchiveInternalServiceFolderSummary | null;
  /** Callback when selection changes */
  onChange: (
    folder: GithubComIntocodePromptarchiveInternalServiceFolderSummary | null
  ) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function FolderSelector({
  value,
  onChange,
  disabled = false,
  className,
}: FolderSelectorProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch folders
  const { data: foldersResponse, isLoading } = useGetFolders({
    query: {
      enabled: isOpen,
      staleTime: 30000,
    },
  });

  const allFolders = React.useMemo(
    () => foldersResponse?.data ?? [],
    [foldersResponse?.data]
  );

  // Items in the dropdown: "Uncategorized" + all folders
  const dropdownItems = React.useMemo(() => {
    const items: Array<
      | { type: "uncategorized" }
      | {
          type: "folder";
          folder: GithubComIntocodePromptarchiveInternalServiceFolderSummary;
        }
    > = [{ type: "uncategorized" }];

    allFolders.forEach((folder) => {
      items.push({ type: "folder", folder });
    });

    return items;
  }, [allFolders]);

  // Create folder mutation
  const createFolderMutation = usePostFolders({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          const newFolder: GithubComIntocodePromptarchiveInternalServiceFolderSummary =
            {
              id: response.data.id,
              name: response.data.name,
              color: response.data.color,
            };
          onChange(newFolder);
          setNewFolderName("");
          setIsCreating(false);
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: getGetFoldersQueryKey() });
        }
      },
    },
  });

  // Reset state when dropdown closes
  React.useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      setIsCreating(false);
      setNewFolderName("");
    }
  }, [isOpen]);

  // Focus input when creating
  React.useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      );
      highlightedEl?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const handleSelectFolder = (
    folder: GithubComIntocodePromptarchiveInternalServiceFolderSummary | null
  ) => {
    onChange(folder);
    setIsOpen(false);
  };

  const handleCreateFolder = () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName || createFolderMutation.isPending) return;
    createFolderMutation.mutate({ data: { name: trimmedName } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCreating) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCreateFolder();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsCreating(false);
        setNewFolderName("");
      }
      return;
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
          const item = dropdownItems[highlightedIndex];
          if (item.type === "uncategorized") {
            handleSelectFolder(null);
          } else {
            handleSelectFolder(item.folder);
          }
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "cursor-not-allowed opacity-50",
            value ? "border-border" : "border-dashed border-muted-foreground/50",
            className
          )}
        >
          {value ? (
            <>
              <Folder className="h-3 w-3" />
              {value.name}
            </>
          ) : (
            <>
              <FolderOpen className="h-3 w-3" />
              Uncategorized
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[200px] p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={listRef}
          role="listbox"
          className="max-h-[250px] overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </div>
          ) : (
            <>
              {dropdownItems.map((item, index) => {
                const isHighlighted = index === highlightedIndex;

                if (item.type === "uncategorized") {
                  const isSelected = value === null;
                  return (
                    <div
                      key="uncategorized"
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                        isHighlighted && "bg-accent text-accent-foreground",
                        !isHighlighted && "hover:bg-accent/50"
                      )}
                      onClick={() => handleSelectFolder(null)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <FolderOpen className="size-4" />
                      <span>Uncategorized</span>
                    </div>
                  );
                }

                const isSelected = value?.id === item.folder.id;
                return (
                  <div
                    key={item.folder.id}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                      isHighlighted && "bg-accent text-accent-foreground",
                      !isHighlighted && "hover:bg-accent/50"
                    )}
                    onClick={() => handleSelectFolder(item.folder)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Folder className="size-4" />
                    <span>{item.folder.name}</span>
                  </div>
                );
              })}

              <div className="border-t">
                {isCreating ? (
                  <div className="flex items-center gap-2 p-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      disabled={createFolderMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      disabled={
                        !newFolderName.trim() || createFolderMutation.isPending
                      }
                      className="rounded p-1 hover:bg-accent disabled:opacity-50"
                    >
                      {createFolderMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div
                    role="option"
                    aria-selected={false}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="size-4" />
                    <span>Create folder</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
