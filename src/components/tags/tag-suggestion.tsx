"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSuggestionProps {
  name: string;
  onAccept: () => void;
  onDismiss: () => void;
  className?: string;
}

export function TagSuggestion({
  name,
  onAccept,
  onDismiss,
  className,
}: TagSuggestionProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs",
        "bg-muted/70 text-muted-foreground border border-dashed border-muted-foreground/30",
        "animate-pulse cursor-pointer transition-colors",
        "hover:bg-muted hover:border-primary/50",
        className
      )}
    >
      <button
        type="button"
        onClick={onAccept}
        className="hover:text-foreground transition-colors"
        title={`Add "${name}" tag`}
      >
        {name}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="hover:text-destructive transition-colors ml-0.5"
        title="Dismiss suggestion"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function LoadingDots(): React.ReactElement {
  return (
    <div className="flex items-center gap-1.5 px-2">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
    </div>
  );
}
