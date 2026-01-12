"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PromptsError({ error, reset }: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    console.error("Prompts page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        title="Failed to load prompts"
        message="We couldn't load your prompts. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
