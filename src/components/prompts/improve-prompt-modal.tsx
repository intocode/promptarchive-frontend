"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AutoExpandTextarea } from "@/components/ui/auto-expand-textarea";
import { useImprovePrompt } from "@/hooks/use-improve-prompt";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
import { ImproveLoadingState } from "./improve-loading-state";
import { DiffView } from "./diff-view";

interface ImprovePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  currentContent: string;
}

type ModalState = "loading" | "diff" | "edit";

export function ImprovePromptModal({
  open,
  onOpenChange,
  promptId,
  currentContent,
}: ImprovePromptModalProps): React.ReactElement {
  const [modalState, setModalState] = useState<ModalState>("loading");
  const [improvedContent, setImprovedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const { improvePrompt, isPending, data, reset } = useImprovePrompt({
    onSuccess: (result) => {
      setImprovedContent(result.improved_content ?? "");
      setEditedContent(result.improved_content ?? "");
      setModalState("diff");
    },
    onError: () => {
      onOpenChange(false);
    },
  });

  const { updatePrompt, isPending: isUpdating } = useUpdatePrompt(promptId, {
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  // Start improving when modal opens
  useEffect(() => {
    if (open) {
      setModalState("loading");
      setImprovedContent("");
      setEditedContent("");
      reset();
      improvePrompt(promptId);
    }
  }, [open, promptId]);

  function handleAccept() {
    const contentToSave = modalState === "edit" ? editedContent : improvedContent;
    updatePrompt({ content: contentToSave });
  }

  function handleReject() {
    onOpenChange(false);
  }

  function handleEdit() {
    setEditedContent(improvedContent);
    setModalState("edit");
  }

  function handleCancelEdit() {
    setModalState("diff");
  }

  const isLoading = isPending || modalState === "loading";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" showCloseButton={!isLoading && !isUpdating}>
        <DialogHeader>
          <DialogTitle>Improve with AI</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Analyzing and improving your prompt..."
              : modalState === "edit"
                ? "Edit the improved version before accepting"
                : "Review the suggested improvements"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <ImproveLoadingState />
          ) : modalState === "edit" ? (
            <div className="rounded-lg border bg-muted/30 p-4">
              <AutoExpandTextarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="font-content text-sm leading-relaxed w-full resize-none bg-transparent border-0 p-0 focus-visible:ring-0"
                minRows={5}
                maxRows={15}
              />
            </div>
          ) : (
            <DiffView original={currentContent} improved={improvedContent} />
          )}
        </div>

        {!isLoading && (
          <DialogFooter>
            {modalState === "edit" ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleAccept} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  disabled={isUpdating}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  disabled={isUpdating}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleAccept} disabled={isUpdating}>
                  {isUpdating ? "Accepting..." : "Accept"}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
