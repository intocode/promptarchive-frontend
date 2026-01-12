import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PromptsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptsSearch({
  value,
  onChange,
}: PromptsSearchProps): React.ReactElement {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search prompts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
        data-search-input="true"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
