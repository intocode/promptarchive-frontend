"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        title="Something went wrong"
        message="An unexpected error occurred. Please try again or return to the home page."
        onRetry={reset}
      />
    </div>
  );
}
