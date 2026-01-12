"use client";

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { useDeleteTag } from "@features/tag-management";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui";

interface DeleteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: {
    id: string;
    name: string;
    prompts_count?: number;
  };
  onDeleted?: () => void;
}

export function DeleteTagDialog({
  open,
  onOpenChange,
  tag,
  onDeleted,
}: DeleteTagDialogProps): ReactElement {
  const { deleteTag, isPending } = useDeleteTag({
    onSuccess: () => {
      onOpenChange(false);
      onDeleted?.();
    },
  });

  const handleDelete = () => {
    deleteTag(tag.id);
  };

  const promptsCount = tag.prompts_count ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete tag &quot;{tag.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {promptsCount > 0 ? (
              <>
                This tag is used by {promptsCount} prompt{promptsCount !== 1 ? "s" : ""}.
                The tag will be removed from all prompts.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete tag"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
