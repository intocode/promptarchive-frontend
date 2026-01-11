"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Heart, GitFork, User, Eye, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GithubComIntocodePromptarchiveInternalServicePublicPromptDetail } from "@/types/api";
import { formatRelativeDate } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useAuth } from "@/hooks/use-auth";
import {
  usePostPublicPromptsIdLike,
  usePostPublicPromptsIdFork,
  getGetPublicPromptsIdQueryKey,
} from "@/lib/api/generated/endpoints/public-gallery/public-gallery";
import { Button } from "@/components/ui/button";

interface PublicPromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServicePublicPromptDetail;
}

export function PublicPromptDetailContent({
  prompt,
}: PublicPromptDetailContentProps): React.ReactElement {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { copy, copied } = useCopyToClipboard();

  const [isLiked, setIsLiked] = useState(prompt.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(prompt.likes_count ?? 0);

  const {
    id,
    title,
    content,
    description,
    author,
    created_at,
    use_count,
    view_count,
  } = prompt;

  const likeMutation = usePostPublicPromptsIdLike({
    mutation: {
      onMutate: () => {
        // Optimistic update
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);
        setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));
        return { wasLiked };
      },
      onError: (_error, _variables, context) => {
        // Rollback on error
        if (context) {
          setIsLiked(context.wasLiked);
          setLikesCount((prev) => (context.wasLiked ? prev + 1 : prev - 1));
        }
        toast.error("Failed to update like. Please try again.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetPublicPromptsIdQueryKey(id!),
        });
      },
    },
  });

  const forkMutation = usePostPublicPromptsIdFork({
    mutation: {
      onSuccess: (response) => {
        toast.success("Prompt forked to your collection!");
        if (response.data?.id) {
          router.push(`/prompts/${response.data.id}`);
        }
      },
      onError: () => {
        toast.error("Failed to fork prompt. Please try again.");
      },
    },
  });

  function handleLike(): void {
    if (!isAuthenticated) {
      toast.error("Please log in to like prompts");
      router.push("/login");
      return;
    }
    likeMutation.mutate({ id: id! });
  }

  function handleFork(): void {
    if (!isAuthenticated) {
      toast.error("Please log in to fork prompts");
      router.push("/login");
      return;
    }
    forkMutation.mutate({ id: id! });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {author?.name && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {author.name}
            </span>
          )}

          <span>{formatRelativeDate(created_at)}</span>

          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {view_count ?? 0} views
          </span>

          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {use_count ?? 0} forks
          </span>

          <span className="flex items-center gap-1">
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-current text-red-500" : ""}`}
            />
            {likesCount} likes
          </span>
        </div>

        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}

        <div className="relative rounded-lg border bg-muted/30 p-4">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => copy(content ?? "")}
              aria-label="Copy prompt content"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <pre className="font-content whitespace-pre-wrap text-sm leading-relaxed pr-10">
            {content}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => copy(content ?? "")}>
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy
          </Button>

          <Button
            variant="outline"
            onClick={handleLike}
            disabled={likeMutation.isPending}
          >
            {likeMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 mr-2 ${isLiked ? "fill-current text-red-500" : ""}`}
              />
            )}
            {isLiked ? "Liked" : "Like"}
          </Button>

          <Button onClick={handleFork} disabled={forkMutation.isPending}>
            {forkMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <GitFork className="h-4 w-4 mr-2" />
            )}
            Fork to My Prompts
          </Button>
        </div>
      </div>
    </div>
  );
}
