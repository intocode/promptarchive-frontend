"use client";

import { ErrorFallback } from "@/components/error/error-fallback";

interface PromptDetailErrorProps {
  onRetry?: () => void;
}

export function PromptDetailError({
  onRetry,
}: PromptDetailErrorProps): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <ErrorFallback
        title="Prompt not found"
        message="The prompt you're looking for doesn't exist or you don't have permission to view it."
        backLink={{ href: "/prompts", label: "Back to Prompts" }}
        onRetry={onRetry}
        containerClassName="flex flex-col items-center justify-center py-16 text-center"
      />
    </div>
  );
}
