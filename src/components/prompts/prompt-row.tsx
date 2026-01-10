"use client";

import Link from "next/link";
import { Copy, Check, Folder } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { cn, formatRelativeDate } from "@/lib/utils";
import { getVisibilityConfig } from "@/lib/utils/visibility";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PromptRowProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
  className?: string;
}

const MAX_VISIBLE_TAGS = 3;

export function PromptRow({
  prompt,
  className,
}: PromptRowProps): React.ReactElement {
  const { id, title, content, folder, tags, visibility, updated_at, use_count } =
    prompt;
  const visibleTags = tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const remainingTagsCount = (tags?.length ?? 0) - MAX_VISIBLE_TAGS;
  const visibilityConfig = getVisibilityConfig(visibility);
  const VisibilityIcon = visibilityConfig.icon;

  const { copy, copied } = useCopyToClipboard();

  async function handleCopy(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    await copy(content ?? "");
  }

  return (
    <Link
      href={`/prompts/${id}`}
      className={cn(
        "flex flex-col gap-2 px-4 py-3",
        "sm:flex-row sm:items-center sm:gap-4",
        "transition-colors duration-150 hover:bg-accent/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        className
      )}
    >
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {folder && (
            <Badge variant="outline" className="gap-1">
              <Folder className="h-3 w-3" />
              {folder.name}
            </Badge>
          )}
          {visibleTags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
          {remainingTagsCount > 0 && (
            <Badge variant="secondary">+{remainingTagsCount}</Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-sm text-muted-foreground">
        <VisibilityIcon
          className="h-4 w-4"
          aria-label={visibilityConfig.label}
        />
        <span>{formatRelativeDate(updated_at)}</span>
        <span>{use_count ?? 0} uses</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
          aria-label="Copy prompt content"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Link>
  );
}
