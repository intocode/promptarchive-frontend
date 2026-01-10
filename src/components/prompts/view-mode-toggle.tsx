"use client";

import { List, LayoutGrid } from "lucide-react";

import type { ViewMode } from "@/hooks/use-view-mode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
  className?: string;
}

export function ViewModeToggle({
  viewMode,
  onToggle,
  className,
}: ViewModeToggleProps): React.ReactElement {
  const Icon = viewMode === "compact" ? List : LayoutGrid;
  const label = viewMode === "compact" ? "Compact view" : "Expanded view";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-label={`Switch to ${viewMode === "compact" ? "expanded" : "compact"} view`}
      title={label}
      className={cn("hidden md:inline-flex", className)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
