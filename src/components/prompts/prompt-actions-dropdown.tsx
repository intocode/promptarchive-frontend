"use client";

import { MoreHorizontal, Pencil, Trash2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PromptActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  onImprove?: () => void;
}

export function PromptActionsDropdown({
  onEdit,
  onDelete,
  onImprove,
}: PromptActionsDropdownProps): React.ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Prompt actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onImprove && (
          <DropdownMenuItem onClick={onImprove}>
            <Sparkles className="h-4 w-4 mr-2" />
            Improve with AI
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
