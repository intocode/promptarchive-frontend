"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Copy, Check, Sparkles, History } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { formatRelativeDate } from "@/lib/utils";
import { getVisibilityConfig } from "@/lib/utils/visibility";
import { extractVariables, renderTemplate } from "@/lib/utils/templates";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  updatePromptSchema,
  type UpdatePromptFormData,
} from "@/lib/validations/prompt";
import { VISIBILITY_OPTIONS } from "@/lib/constants";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
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
import { HighlightedContent } from "./highlighted-content";
import { VariablesList } from "./variables-list";
import { VariableInputForm } from "./variable-input-form";
import { InlineTagEditor } from "@/components/tags/inline-tag-editor";
import { InlineFolderEditor } from "@/components/folders/inline-folder-editor";
import { ImprovePromptModal } from "./improve-prompt-modal";
import { VersionHistorySheet } from "./version-history-sheet";

interface PromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
}

export function PromptDetailContent({
  prompt,
}: PromptDetailContentProps): React.ReactElement {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
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

  // Extract variables client-side for immediate feedback
  const clientVariables = useMemo(() => {
    if (!content) return [];
    return extractVariables(content);
  }, [content]);

  const promptHasVariables = clientVariables.length > 0;

  // State for variable values from the input form
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );

  // Copy hook for rendered content
  const { copy: copyRendered, copied: copiedRendered } = useCopyToClipboard();

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

  const watchedVisibility = useWatch({
    control: form.control,
    name: "visibility",
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
                    onClick={() => setShowImproveModal(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistorySheet(true)}
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
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
                    onImprove={() => setShowImproveModal(true)}
                    onHistory={() => setShowHistorySheet(true)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {isEditing ? (
            <Select
              value={watchedVisibility}
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

          <InlineFolderEditor
            promptId={prompt.id!}
            currentFolder={folder ?? null}
            disabled={isEditing}
          />

          <span>{formatRelativeDate(updated_at)}</span>

          <span>{use_count ?? 0} uses</span>

          {view_count !== undefined && view_count > 0 && (
            <span>{view_count} views</span>
          )}
        </div>

        <InlineTagEditor
          promptId={prompt.id!}
          currentTags={tags ?? []}
          disabled={isEditing}
        />

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
                variableValues={variableValues}
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
          ) : promptHasVariables ? (
            <HighlightedContent content={content ?? ""} className="pr-10" />
          ) : (
            <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed pr-10">
              {content}
            </pre>
          )}
        </div>

        {/* Variables list and input form - shown below content in view mode */}
        {!isEditing && promptHasVariables && (
          <>
            <VariablesList
              promptId={prompt.id!}
              clientVariables={clientVariables}
            />
            <VariableInputForm
              promptId={prompt.id!}
              variables={clientVariables.map((v) => ({
                name: v.name,
                defaultValue: v.defaultValue,
              }))}
              onValuesChange={setVariableValues}
            />

            {/* Template Preview - shown when variables have values */}
            {Object.keys(variableValues).length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Preview
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyRendered(renderTemplate(content ?? "", variableValues))
                    }
                  >
                    {copiedRendered ? (
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed">
                    {renderTemplate(content ?? "", variableValues)}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
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

      {showImproveModal && (
        <ImprovePromptModal
          open={showImproveModal}
          onOpenChange={setShowImproveModal}
          promptId={prompt.id ?? ""}
          currentContent={content ?? ""}
        />
      )}

      <VersionHistorySheet
        open={showHistorySheet}
        onOpenChange={setShowHistorySheet}
        promptId={prompt.id ?? ""}
        currentContent={content ?? ""}
      />
    </div>
  );
}
