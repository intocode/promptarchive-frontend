import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@shared/ui";

interface EmptyStateProps {
  search?: string;
  hasActiveFilters?: boolean;
  onCreatePrompt?: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({
  search,
  hasActiveFilters,
  onCreatePrompt,
  onClearFilters,
}: EmptyStateProps): React.ReactElement {
  if (search || hasActiveFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No prompts found</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {search
            ? `No prompts match "${search}".`
            : "No prompts match the selected filters."}{" "}
          Try adjusting your search or filters.
        </p>
        {hasActiveFilters && onClearFilters && (
          <Button variant="outline" onClick={onClearFilters} className="mt-4">
            Clear all filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold">Start your prompt collection</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Create your first prompt to begin organizing your AI workflows.
      </p>
      {onCreatePrompt && (
        <Button onClick={onCreatePrompt} className="mt-6">
          <Plus className="h-4 w-4" />
          Create your first prompt
        </Button>
      )}
    </div>
  );
}
