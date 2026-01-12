"use client";

import { ArrowDownUp } from "lucide-react";

import { GetPromptsSort } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";

const SORT_OPTIONS = [
  { label: "Recently Modified", value: GetPromptsSort["-updated_at"] },
  { label: "Date Created", value: GetPromptsSort["-created_at"] },
  { label: "Most Used", value: GetPromptsSort["-use_count"] },
] as const;

export const DEFAULT_SORT = GetPromptsSort["-updated_at"];

interface PromptsSortDropdownProps {
  value: GetPromptsSort;
  onChange: (value: GetPromptsSort) => void;
}

export function PromptsSortDropdown({
  value,
  onChange,
}: PromptsSortDropdownProps): React.ReactElement {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as GetPromptsSort)}>
      <SelectTrigger className="w-[180px]">
        <ArrowDownUp className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
