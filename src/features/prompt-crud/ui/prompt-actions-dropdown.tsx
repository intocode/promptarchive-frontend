"use client";

import { MoreHorizontal, Pencil, Trash2, Sparkles, History, Share2 } from "lucide-react";

import { Button } from "@shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui";

interface PromptActionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onImprove?: () => void;
  onHistory?: () => void;
  onShare?: () => void;
  hideEditActions?: boolean;
}

export function PromptActionsDropdown({
  onEdit,
  onDelete,
  onImprove,
  onHistory,
  onShare,
  hideEditActions = false,
}: PromptActionsDropdownProps): React.ReactElement {
  const showEditActions = !hideEditActions && onEdit && onDelete;

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
        {!hideEditActions && onImprove && (
          <DropdownMenuItem onClick={onImprove}>
            <Sparkles className="h-4 w-4 mr-2" />
            Improve with AI
          </DropdownMenuItem>
        )}
        {onHistory && (
          <DropdownMenuItem onClick={onHistory}>
            <History className="h-4 w-4 mr-2" />
            History
          </DropdownMenuItem>
        )}
        {onShare && (
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
        {showEditActions && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
