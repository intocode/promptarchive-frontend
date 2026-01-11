"use client";

import { Copy, Check, User } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceSharedPromptResponse } from "@/types/api";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";

interface SharedPromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServiceSharedPromptResponse;
}

export function SharedPromptDetailContent({
  prompt,
}: SharedPromptDetailContentProps): React.ReactElement {
  const { copy, copied } = useCopyToClipboard();
  const { title, content, description, author } = prompt;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {author?.name && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Shared by {author.name}</span>
          </div>
        )}

        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

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
          Copy Prompt
        </Button>
      </div>
    </div>
  );
}
