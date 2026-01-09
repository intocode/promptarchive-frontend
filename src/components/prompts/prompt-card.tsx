"use client";

import Link from "next/link";
import { Folder } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PromptCardProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePromptResponse;
  className?: string;
}

const MAX_VISIBLE_TAGS = 3;

const VISIBILITY_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  public: { label: "Public", variant: "default" },
  private: { label: "Private", variant: "secondary" },
  unlisted: { label: "Unlisted", variant: "outline" },
};

const DEFAULT_VISIBILITY = VISIBILITY_CONFIG.private;

function getVisibilityConfig(
  visibility: string | undefined
): { label: string; variant: "default" | "secondary" | "outline" } {
  if (!visibility) return DEFAULT_VISIBILITY;
  return VISIBILITY_CONFIG[visibility] ?? DEFAULT_VISIBILITY;
}

export function PromptCard({
  prompt,
  className,
}: PromptCardProps): React.ReactElement {
  const { id, title, content, folder, tags, visibility, updated_at } = prompt;
  const visibleTags = tags?.slice(0, MAX_VISIBLE_TAGS) ?? [];
  const remainingTagsCount = (tags?.length ?? 0) - MAX_VISIBLE_TAGS;
  const visibilityConfig = getVisibilityConfig(visibility);

  return (
    <Link href={`/prompts/${id}`} className="block">
      <Card
        className={cn(
          "cursor-pointer transition-shadow duration-200 hover:shadow-md",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
            <Badge variant={visibilityConfig.variant} className="shrink-0">
              {visibilityConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
              <Badge variant="secondary">+{remainingTagsCount} more</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeDate(updated_at)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
