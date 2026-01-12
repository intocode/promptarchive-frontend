"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackLink {
  href: string;
  label: string;
}

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backLink?: BackLink;
  containerClassName?: string;
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  backLink,
  containerClassName = "flex flex-col items-center justify-center min-h-[400px] text-center px-4",
}: ErrorFallbackProps): React.ReactElement {
  return (
    <div className={containerClassName}>
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      <div className="flex gap-3">
        {backLink && (
          <Button variant="outline" asChild>
            <Link href={backLink.href}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLink.label}
            </Link>
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
