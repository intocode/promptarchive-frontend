"use client";

import { useState } from "react";
import { Copy, Check, Folder, Pencil } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { formatRelativeDate } from "@/lib/utils";
import { getVisibilityConfig } from "@/lib/utils/visibility";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditPromptForm } from "./edit-prompt-form";

interface PromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
}

export function PromptDetailContent({
  prompt,
}: PromptDetailContentProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);

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

  const { copy, copied } = useCopyToClipboard();

  function handleCopy(): void {
    copy(content ?? "");
  }

  function exitEditMode(): void {
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <EditPromptForm
        prompt={prompt}
        onSuccess={exitEditMode}
        onCancel={exitEditMode}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="shrink-0"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <VisibilityIcon className="h-4 w-4" />
            <span>{visibilityConfig.label}</span>
          </div>

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
      </div>

      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}

      <div className="relative rounded-lg border bg-muted/30 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleCopy}
          aria-label="Copy prompt content"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed pr-10">
          {content}
        </pre>
      </div>

      <p className="text-xs text-muted-foreground">
        Created {formatRelativeDate(created_at)}
      </p>
    </div>
  );
}
