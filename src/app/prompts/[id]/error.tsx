"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@widgets/error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PromptDetailError({ error, reset }: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    console.error("Prompt detail error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        title="Failed to load prompt"
        message="We couldn't load this prompt. It may have been deleted or you don't have access."
        onRetry={reset}
      />
    </div>
  );
}
