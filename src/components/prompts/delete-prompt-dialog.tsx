"use client";

import { Loader2 } from "lucide-react";

import { useDeletePrompt } from "@/hooks/use-delete-prompt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface DeletePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  promptTitle: string;
  onSuccess: () => void;
}

export function DeletePromptDialog({
  open,
  onOpenChange,
  promptId,
  promptTitle,
  onSuccess,
}: DeletePromptDialogProps): React.ReactElement {
  const { deletePrompt, isPending } = useDeletePrompt(promptId, {
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
  });

  function handleDelete(e: React.MouseEvent): void {
    e.preventDefault();
    deletePrompt();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{promptTitle}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
