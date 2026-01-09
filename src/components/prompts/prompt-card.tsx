"use client";

import Link from "next/link";
import { Copy, Check, Folder, Globe, Lock } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServicePromptResponse } from "@/types/api";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface VisibilityConfig {
  icon: typeof Lock;
  label: string;
}

const VISIBILITY_CONFIG: Record<string, VisibilityConfig> = {
  public: { icon: Globe, label: "Public prompt" },
  private: { icon: Lock, label: "Private prompt" },
  unlisted: { icon: Globe, label: "Unlisted prompt" },
};

function getVisibilityConfig(visibility: string | undefined): VisibilityConfig {
  return VISIBILITY_CONFIG[visibility ?? "private"] ?? VISIBILITY_CONFIG.private;
}

export function PromptCard({
  prompt,
  className,
}: PromptCardProps): React.ReactElement {
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
            <VisibilityIcon
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-label={visibilityConfig.label}
            />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
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
              <Badge variant="secondary">+{remainingTagsCount} more</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0">
          <span className="text-xs text-muted-foreground">
            Updated {formatRelativeDate(updated_at)} · {use_count ?? 0} uses
          </span>
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
        </CardFooter>
      </Card>
    </Link>
  );
}
