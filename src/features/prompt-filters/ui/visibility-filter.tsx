"use client";

import { Eye } from "lucide-react";

import type { GetPromptsVisibility } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";

const VISIBILITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Unlisted", value: "unlisted" },
] as const;

interface VisibilityFilterProps {
  value?: GetPromptsVisibility;
  onChange: (value: GetPromptsVisibility | undefined) => void;
}

export function VisibilityFilter({
  value,
  onChange,
}: VisibilityFilterProps): React.ReactElement {
  const handleChange = (newValue: string) => {
    onChange(newValue === "all" ? undefined : (newValue as GetPromptsVisibility));
  };

  return (
    <Select value={value ?? "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px]">
        <Eye className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Visibility" />
      </SelectTrigger>
      <SelectContent>
        {VISIBILITY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
