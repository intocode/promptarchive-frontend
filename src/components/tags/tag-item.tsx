"use client";

import { useState, useEffect, useRef, type ReactElement, type KeyboardEvent } from "react";
import { Tag, Pencil, Trash2, Check, X } from "lucide-react";
import type { GithubComIntocodePromptarchiveInternalServiceTagResponse } from "@/types/api";
import { useUpdateTag } from "@/hooks/use-update-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagItemProps {
  tag: GithubComIntocodePromptarchiveInternalServiceTagResponse;
  onDelete: () => void;
}

export function TagItem({ tag, onDelete }: TagItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateTag, isPending } = useUpdateTag(tag.id ?? "", {
    onSuccess: () => setIsEditing(false),
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setEditName(tag.name ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== tag.name) {
      updateTag({ name: trimmedName });
    } else {
      setIsEditing(false);
      setEditName(tag.name ?? "");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(tag.name ?? "");
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

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2">
        <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
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
    <div className="group flex items-center gap-2 rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent/50">
      <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm">{tag.name}</span>
      {tag.prompts_count !== undefined && tag.prompts_count > 0 && (
        <span className="text-xs text-muted-foreground">
          {tag.prompts_count} prompt{tag.prompts_count !== 1 ? "s" : ""}
        </span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={startEditing}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
