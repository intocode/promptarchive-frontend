"use client";

import { ErrorFallback } from "@/components/error/error-fallback";

interface PublicPromptDetailErrorProps {
  onRetry?: () => void;
}

export function PublicPromptDetailError({
  onRetry,
}: PublicPromptDetailErrorProps): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <ErrorFallback
        title="Prompt not found"
        message="The prompt you're looking for doesn't exist or is no longer public."
        backLink={{ href: "/gallery", label: "Back to Gallery" }}
        onRetry={onRetry}
        containerClassName="flex flex-col items-center justify-center py-16 text-center"
      />
    </div>
  );
}
