"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PublicPromptDetailErrorProps {
  onRetry?: () => void;
}

export function PublicPromptDetailError({
  onRetry,
}: PublicPromptDetailErrorProps): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Prompt not found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          The prompt you&apos;re looking for doesn&apos;t exist or is no longer
          public.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
