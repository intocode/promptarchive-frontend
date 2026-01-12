"use client";

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { useDeleteFolder } from "@/hooks/use-delete-folder";
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

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: {
    id: string;
    name: string;
    prompts_count?: number;
  };
  onDeleted?: () => void;
}

export function DeleteFolderDialog({
  open,
  onOpenChange,
  folder,
  onDeleted,
}: DeleteFolderDialogProps): ReactElement {
  const { deleteFolder, isPending } = useDeleteFolder({
    onSuccess: () => {
      onOpenChange(false);
      onDeleted?.();
    },
  });

  const handleDelete = () => {
    deleteFolder(folder.id);
  };

  const promptsCount = folder.prompts_count ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete folder &quot;{folder.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {promptsCount > 0 ? (
              <>
                This folder contains {promptsCount} prompt{promptsCount !== 1 ? "s" : ""}.
                The prompts will be moved to &quot;Uncategorized&quot; and won&apos;t be deleted.
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
              "Delete folder"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
