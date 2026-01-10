"use client";

import Link from "next/link";
import { Copy, Check, Folder } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { cn, formatRelativeDate } from "@/lib/utils";
import { getVisibilityConfig } from "@/lib/utils/visibility";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface PromptCardProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
  className?: string;
}

const MAX_VISIBLE_TAGS = 3;
const CONTENT_PREVIEW_LENGTH = 150;

export function PromptCard({
  prompt,
  className,
}: PromptCardProps): React.ReactElement {
  const {
    id,
    title,
    content,
    description,
    folder,
    tags,
    visibility,
    updated_at,
    use_count,
    view_count,
  } = prompt;
  const visibleTags = tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const remainingTagsCount = (tags?.length ?? 0) - MAX_VISIBLE_TAGS;
  const visibilityConfig = getVisibilityConfig(visibility);
  const VisibilityIcon = visibilityConfig.icon;

  const { copy, copied } = useCopyToClipboard();

  const contentPreview =
    content && content.length > CONTENT_PREVIEW_LENGTH
      ? `${content.slice(0, CONTENT_PREVIEW_LENGTH)}...`
      : content;

  async function handleCopy(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    await copy(content ?? "");
  }

  return (
    <Link href={`/prompts/${id}`} className="block">
      <Card
        className={cn(
          "h-full transition-colors duration-150 hover:bg-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium line-clamp-1">
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 -mt-1"
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
          <CardDescription className="flex items-center gap-2 text-xs">
            <VisibilityIcon className="h-3 w-3" />
            <span>{formatRelativeDate(updated_at)}</span>
            <span>{use_count ?? 0} uses</span>
            <span>{view_count ?? 0} views</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="py-0 space-y-2">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/70 line-clamp-3 font-content">
            {contentPreview}
          </p>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {folder && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Folder className="h-2.5 w-2.5" />
                {folder.name}
              </Badge>
            )}
            {visibleTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {remainingTagsCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{remainingTagsCount}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
