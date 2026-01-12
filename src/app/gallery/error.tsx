"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@widgets/error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GalleryError({ error, reset }: ErrorPageProps): React.ReactElement {
  useEffect(() => {
    console.error("Gallery error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        title="Failed to load gallery"
        message="We couldn't load the public gallery. Please try again."
        onRetry={reset}
      />
    </div>
  );
}
