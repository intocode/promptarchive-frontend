"use client";

import { Folder, Loader2 } from "lucide-react";

import { useGetFolders } from "@shared/api/generated/endpoints/folders/folders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";

interface FolderFilterProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function FolderFilter({
  value,
  onChange,
}: FolderFilterProps): React.ReactElement {
  const { data, isLoading } = useGetFolders();
  const folders = data?.data ?? [];

  const handleChange = (newValue: string) => {
    onChange(newValue === "all" ? undefined : newValue);
  };

  const selectedFolder = folders.find((f) => f.id === value);
  const displayValue = selectedFolder?.name ?? "All folders";

  return (
    <Select value={value ?? "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px]">
        <Folder className="mr-2 h-4 w-4" />
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue placeholder="All folders">{displayValue}</SelectValue>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All folders</SelectItem>
        {folders.length > 0 && <SelectSeparator />}
        {folders.map((folder) => (
          <SelectItem key={folder.id} value={folder.id ?? ""}>
            <span className="flex items-center justify-between gap-2">
              <span className="truncate">{folder.name}</span>
              {folder.prompts_count !== undefined && (
                <span className="text-muted-foreground">
                  ({folder.prompts_count})
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
