"use client";

import { useState, useEffect, useRef, type ReactElement, type KeyboardEvent, type HTMLAttributes } from "react";
import { Folder, FolderOpen, Pencil, Trash2, GripVertical, Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GithubComIntocodePromptarchiveInternalServiceFolderResponse } from "@/types/api";
import { useUpdateFolder } from "@/hooks/use-update-folder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FolderItemProps {
  folder: GithubComIntocodePromptarchiveInternalServiceFolderResponse;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  showDragHandle?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
}

export function FolderItem({
  folder,
  isActive,
  onClick,
  onDelete,
  showDragHandle = false,
  dragHandleProps,
}: FolderItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateFolder, isPending } = useUpdateFolder(folder.id ?? "", {
    onSuccess: () => setIsEditing(false),
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditName(folder.name ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== folder.name) {
      updateFolder({ name: trimmedName });
    } else {
      setIsEditing(false);
      setEditName(folder.name ?? "");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(folder.name ?? "");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const FolderIcon = isActive ? FolderOpen : Folder;

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-2 py-1.5">
        <Input
          ref={inputRef}
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={isPending}
          className="h-7 flex-1 text-sm"
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleSave}
          disabled={isPending || !editName.trim()}
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-foreground"
      )}
    >
      {showDragHandle && (
        <button
          type="button"
          className="cursor-grab opacity-0 group-hover:opacity-100 focus:opacity-100 touch-none"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-2 text-left"
      >
        <FolderIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">{folder.name}</span>
        {folder.prompts_count !== undefined && folder.prompts_count > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {folder.prompts_count}
          </span>
        )}
      </button>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            startEditing();
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface AllFoldersItemProps {
  isActive: boolean;
  onClick: () => void;
  totalCount?: number;
}

export function AllFoldersItem({
  isActive,
  onClick,
  totalCount,
}: AllFoldersItemProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-foreground"
      )}
    >
      <Folder className="h-4 w-4 shrink-0" />
      <span>All Prompts</span>
      {totalCount !== undefined && totalCount > 0 && (
        <span className="ml-auto text-xs text-muted-foreground">
          {totalCount}
        </span>
      )}
    </button>
  );
}
