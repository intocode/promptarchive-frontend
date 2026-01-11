"use client";

import Link from "next/link";
import { Copy, Check, Eye, GitFork, User } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePublicPromptListItem } from "@/types/api";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface PublicPromptCardProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePublicPromptListItem;
  className?: string;
}

const CONTENT_PREVIEW_LENGTH = 200;

export function PublicPromptCard({
  prompt,
  className,
}: PublicPromptCardProps): React.ReactElement {
  const {
    id,
    title,
    preview,
    description,
    author,
    created_at,
    use_count,
    view_count,
  } = prompt;

  const { copy, copied } = useCopyToClipboard();

  const contentPreview =
    preview && preview.length > CONTENT_PREVIEW_LENGTH
      ? `${preview.slice(0, CONTENT_PREVIEW_LENGTH)}...`
      : preview;

  async function handleCopy(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    await copy(preview ?? "");
  }

  return (
    <Link href={`/gallery/${id}`} className="block">
      <Card
        className={cn(
          "h-full transition-colors duration-150 hover:bg-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <CardHeader className="pb-2">
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
          <CardDescription className="flex items-center gap-2 text-xs flex-wrap">
            {author?.name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {author.name}
              </span>
            )}
            <span>{formatRelativeDate(created_at)}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {view_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {use_count ?? 0}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/70 line-clamp-4 font-content">
            {contentPreview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PublicPromptCardSkeleton(): React.ReactElement {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-7 w-7 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
          <div className="h-3 w-12 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="h-3 w-full bg-muted animate-pulse rounded" />
        <div className="h-3 w-full bg-muted animate-pulse rounded" />
        <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}
