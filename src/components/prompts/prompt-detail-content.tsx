"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, Pencil, Trash2 } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { formatRelativeDate } from "@/lib/utils";
import { getVisibilityConfig } from "@/lib/utils/visibility";
import {
  updatePromptSchema,
  type UpdatePromptFormData,
} from "@/lib/validations/prompt";
import { VISIBILITY_OPTIONS } from "@/lib/constants";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AutoExpandTextarea } from "@/components/ui/auto-expand-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyPromptDropdown } from "./copy-prompt-dropdown";
import { DeletePromptDialog } from "./delete-prompt-dialog";
import { PromptActionsDropdown } from "./prompt-actions-dropdown";

interface PromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
}

export function PromptDetailContent({
  prompt,
}: PromptDetailContentProps): React.ReactElement {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const editContainerRef = useRef<HTMLDivElement>(null);

  const {
    title,
    content,
    description,
    folder,
    tags,
    visibility,
    created_at,
    updated_at,
    use_count,
    view_count,
  } = prompt;

  const visibilityConfig = getVisibilityConfig(visibility);
  const VisibilityIcon = visibilityConfig.icon;

  const form = useForm<UpdatePromptFormData>({
    resolver: zodResolver(updatePromptSchema),
    defaultValues: {
      title: title ?? "",
      content: content ?? "",
      description: description ?? "",
      visibility: (visibility as "private" | "public" | "unlisted") ?? "private",
    },
    mode: "onSubmit",
  });

  const { updatePrompt, isPending } = useUpdatePrompt(prompt.id!, {
    onSuccess: () => setIsEditing(false),
  });

  // Reset form when prompt data changes or when entering edit mode
  useEffect(() => {
    if (isEditing) {
      form.reset({
        title: title ?? "",
        content: content ?? "",
        description: description ?? "",
        visibility: (visibility as "private" | "public" | "unlisted") ?? "private",
      });
    }
  }, [isEditing, title, content, description, visibility, form]);

  // Handle Escape key to cancel edit mode
  useEffect(() => {
    if (!isEditing) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") {
        form.reset();
        setIsEditing(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, form]);

  function handleSave(data: UpdatePromptFormData): void {
    const changes: Record<string, unknown> = {};

    if (data.title !== title) changes.title = data.title;
    if (data.content !== content) changes.content = data.content;
    if (data.description !== (description ?? "")) {
      changes.description = data.description || undefined;
    }
    if (data.visibility !== visibility) changes.visibility = data.visibility;

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    updatePrompt(changes);
  }

  function handleCancel(): void {
    form.reset();
    setIsEditing(false);
  }

  // Auto-save when focus leaves the edit container
  function handleContainerBlur(e: React.FocusEvent): void {
    // Check if the new focus target is outside our container
    const relatedTarget = e.relatedTarget as Node | null;
    if (relatedTarget && editContainerRef.current?.contains(relatedTarget)) {
      // Focus moved within the container, don't save
      return;
    }

    // Don't auto-save if clicking on Cancel button or if already saving
    if (isPending) return;

    // Focus left the container, trigger save if there are changes
    const data = form.getValues();
    handleSave(data);
  }

  return (
    <div className="space-y-6">
      <div
        ref={isEditing ? editContainerRef : undefined}
        onBlur={isEditing ? handleContainerBlur : undefined}
        className="space-y-4"
      >
        <div className="flex items-start justify-between gap-4">
          {isEditing ? (
            <Input
              {...form.register("title")}
              className="text-2xl font-semibold tracking-tight h-auto py-1 border-primary"
              autoFocus
            />
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          <div className="shrink-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={form.handleSubmit(handleSave)}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop: Individual buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
                {/* Mobile: Dropdown menu */}
                <div className="md:hidden">
                  <PromptActionsDropdown
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => setShowDeleteDialog(true)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {isEditing ? (
            <Select
              value={form.watch("visibility")}
              onValueChange={(value) =>
                form.setValue("visibility", value as "private" | "public" | "unlisted")
              }
            >
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-1.5">
              <VisibilityIcon className="h-4 w-4" />
              <span>{visibilityConfig.label}</span>
            </div>
          )}

          {folder && (
            <Badge variant="outline" className="gap-1">
              <Folder className="h-3 w-3" />
              {folder.name}
            </Badge>
          )}

          <span>{formatRelativeDate(updated_at)}</span>

          <span>{use_count ?? 0} uses</span>

          {view_count !== undefined && view_count > 0 && (
            <span>{view_count} views</span>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {isEditing ? (
          <Input
            {...form.register("description")}
            placeholder="Add a description (optional)"
            className="text-muted-foreground"
          />
        ) : (
          description && (
            <p className="text-muted-foreground">{description}</p>
          )
        )}

        <div className="relative rounded-lg border bg-muted/30 p-4">
          {!isEditing && (
            <div className="absolute top-2 right-2">
              <CopyPromptDropdown
                content={content ?? ""}
                title={title ?? "Untitled"}
                description={description}
                tags={tags}
              />
            </div>
          )}

          {isEditing ? (
            <AutoExpandTextarea
              {...form.register("content")}
              className="font-content text-sm leading-relaxed w-full resize-none bg-transparent border-0 p-0 focus-visible:ring-0"
              minRows={5}
              maxRows={20}
            />
          ) : (
            <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed pr-10">
              {content}
            </pre>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Created {formatRelativeDate(created_at)}
      </p>

      <DeletePromptDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        promptId={prompt.id ?? ""}
        promptTitle={title ?? "Untitled"}
        onSuccess={() => router.push("/prompts")}
      />
    </div>
  );
}
