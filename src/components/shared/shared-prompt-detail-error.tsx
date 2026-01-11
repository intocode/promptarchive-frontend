"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SharedPromptDetailErrorProps {
  onRetry?: () => void;
}

export function SharedPromptDetailError({
  onRetry,
}: SharedPromptDetailErrorProps): React.ReactElement {
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Shared prompt not found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          This shared link is invalid or has expired.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
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
