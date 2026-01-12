"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, User, X, Sparkles } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceSharedPromptResponse } from "@/types/api";
import { useAuth } from "@/hooks/use-auth";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";

const CTA_DISMISSED_KEY = "promptarchive-cta-dismissed";

interface SharedPromptDetailContentProps {
  prompt: GithubComIntocodePromptarchiveInternalServiceSharedPromptResponse;
}

function getInitialDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(CTA_DISMISSED_KEY) === "true";
}

function CreateAccountBanner(): React.ReactElement | null {
  const { user, isLoading } = useAuth();
  const [isDismissed, setIsDismissed] = useState(getInitialDismissed);

  const handleDismiss = () => {
    localStorage.setItem(CTA_DISMISSED_KEY, "true");
    setIsDismissed(true);
  };

  // Don't show if loading, user is logged in, or banner was dismissed
  if (isLoading || user || isDismissed) {
    return null;
  }

  return (
    <div className="relative rounded-lg border border-primary/20 bg-primary/5 p-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-primary/10 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="rounded-full bg-primary/10 p-2">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium">Create an account to save prompts</p>
          <p className="text-sm text-muted-foreground">
            Sign up to save, organize, and share your own AI prompts.
          </p>
          <Button asChild size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
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

      <CreateAccountBanner />
    </div>
  );
}
