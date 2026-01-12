"use client";

import { ErrorFallback } from "@/components/error/error-fallback";

interface SharedPromptDetailErrorProps {
  onRetry?: () => void;
}

export function SharedPromptDetailError({
  onRetry,
}: SharedPromptDetailErrorProps): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <ErrorFallback
        title="Shared prompt not found"
        message="This shared link is invalid or has expired."
        backLink={{ href: "/", label: "Go Home" }}
        onRetry={onRetry}
        containerClassName="flex flex-col items-center justify-center py-16 text-center"
      />
    </div>
  );
}
