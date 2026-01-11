"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Loader2, Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSharePrompt } from "@/hooks/use-share-prompt";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

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
  const { copy, copied } = useCopyToClipboard();

  const { sharePrompt, isPending, reset } = useSharePrompt({
    onSuccess: (result) => {
      setShareUrl(result.share_url ?? null);
    },
    onError: () => {
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="sm" showCloseButton={!isPending}>
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
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
