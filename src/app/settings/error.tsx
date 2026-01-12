"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SettingsError({ error, reset }: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    console.error("Settings error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        title="Failed to load settings"
        message="We couldn't load your settings. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
