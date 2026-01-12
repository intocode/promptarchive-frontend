import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@shared/ui";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-lg font-semibold">Failed to load prompts</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while fetching your prompts.
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-4">
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
