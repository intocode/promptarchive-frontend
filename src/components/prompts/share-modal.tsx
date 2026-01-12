"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Loader2, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSharePrompt } from "@/hooks/use-share-prompt";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useDeletePromptsIdShare } from "@/lib/api/generated/endpoints/sharing/sharing";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
}

export function ShareModal({
  open,
  onOpenChange,
  promptId,
}: ShareModalProps): React.ReactElement {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { copy, copied } = useCopyToClipboard();

  const { sharePrompt, isPending, reset } = useSharePrompt({
    onSuccess: (result) => {
      setShareUrl(result.share_url ?? null);
    },
    onError: () => {
      onOpenChange(false);
    },
  });

  const { mutate: deleteShare, isPending: isDeleting } =
    useDeletePromptsIdShare({
      mutation: {
        onSuccess: () => {
          toast.success("Share link deleted");
          setShareUrl(null);
          setShowDeleteConfirm(false);
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to delete share link");
        },
      },
    });

  // Generate share link when modal opens
  useEffect(() => {
    if (open && !shareUrl && !isPending) {
      sharePrompt(promptId);
    }
  }, [open, promptId, sharePrompt, shareUrl, isPending]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShareUrl(null);
      reset();
    }
    onOpenChange(newOpen);
  };

  const handleDelete = () => {
    deleteShare({ id: promptId });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent size="sm" showCloseButton={!isPending && !isDeleting}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Share Prompt
            </DialogTitle>
            <DialogDescription>
              {isPending
                ? "Generating share link..."
                : "Anyone with this link can view this prompt"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : shareUrl ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="flex-1" />
                  <Button onClick={() => copy(shareUrl)} size="icon">
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete link
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete share link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the share link. Anyone with the link
              will no longer be able to view this prompt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
