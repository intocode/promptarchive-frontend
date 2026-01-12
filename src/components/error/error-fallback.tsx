"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackLink {
  href: string;
  label: string;
}

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backLink?: BackLink;
  containerClassName?: string;
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  backLink,
  containerClassName = "flex flex-col items-center justify-center min-h-[400px] text-center px-4",
}: ErrorFallbackProps): React.ReactElement {
  return (
    <div className={containerClassName}>
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      <div className="flex gap-3">
        {backLink && (
          <Button variant="outline" asChild>
            <Link href={backLink.href}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLink.label}
            </Link>
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

// Pre-configured error pages for detail views
const DETAIL_PAGE_STYLES = {
  wrapper: "container max-w-4xl py-6",
  container: "flex flex-col items-center justify-center py-16 text-center",
} as const;

interface DetailPageErrorProps {
  onRetry?: () => void;
}

interface DetailPageErrorConfig {
  title: string;
  message: string;
  backLink: BackLink;
}

const ERROR_CONFIGS: Record<"prompt" | "public" | "shared", DetailPageErrorConfig> = {
  prompt: {
    title: "Prompt not found",
    message: "The prompt you're looking for doesn't exist or you don't have permission to view it.",
    backLink: { href: "/prompts", label: "Back to Prompts" },
  },
  public: {
    title: "Prompt not found",
    message: "The prompt you're looking for doesn't exist or is no longer public.",
    backLink: { href: "/gallery", label: "Back to Gallery" },
  },
  shared: {
    title: "Shared prompt not found",
    message: "This shared link is invalid or has expired.",
    backLink: { href: "/", label: "Go Home" },
  },
};

function DetailPageError({ config, onRetry }: { config: DetailPageErrorConfig; onRetry?: () => void }): React.ReactElement {
  return (
    <div className={DETAIL_PAGE_STYLES.wrapper}>
      <ErrorFallback
        title={config.title}
        message={config.message}
        backLink={config.backLink}
        onRetry={onRetry}
        containerClassName={DETAIL_PAGE_STYLES.container}
      />
    </div>
  );
}

export function PromptDetailError({ onRetry }: DetailPageErrorProps): React.ReactElement {
  return <DetailPageError config={ERROR_CONFIGS.prompt} onRetry={onRetry} />;
}

export function PublicPromptDetailError({ onRetry }: DetailPageErrorProps): React.ReactElement {
  return <DetailPageError config={ERROR_CONFIGS.public} onRetry={onRetry} />;
}

export function SharedPromptDetailError({ onRetry }: DetailPageErrorProps): React.ReactElement {
  return <DetailPageError config={ERROR_CONFIGS.shared} onRetry={onRetry} />;
}
