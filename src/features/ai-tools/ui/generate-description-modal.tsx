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
} from "@shared/ui";
import { Button } from "@shared/ui";
import { Input } from "@shared/ui";
import { useGenerateDescription } from "@features/ai-tools";
import { useUpdatePrompt } from "@features/prompt-crud";
import { ImproveLoadingState } from "./improve-loading-state";

interface GenerateDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  currentDescription?: string;
}

type ModalState = "preview" | "edit";

export function GenerateDescriptionModal({
  open,
  onOpenChange,
  promptId,
  currentDescription,
}: GenerateDescriptionModalProps): React.ReactElement {
  const [modalState, setModalState] = useState<ModalState>("preview");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const { generateDescription, isPending } = useGenerateDescription({
    onSuccess: (result) => {
      setGeneratedDescription(result.description ?? "");
      setEditedDescription(result.description ?? "");
      setModalState("preview");
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

  // Start generating when component mounts
  useEffect(() => {
    generateDescription(promptId);
  }, [promptId, generateDescription]);

  function handleAccept() {
    const descriptionToSave = modalState === "edit" ? editedDescription : generatedDescription;
    updatePrompt({ description: descriptionToSave });
  }

  function handleReject() {
    onOpenChange(false);
  }

  function handleEdit() {
    setEditedDescription(generatedDescription);
    setModalState("edit");
  }

  function handleCancelEdit() {
    setModalState("preview");
  }

  const isLoading = isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isLoading && !isUpdating}>
        <DialogHeader>
          <DialogTitle>Generate Description</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Analyzing your prompt to generate a description..."
              : modalState === "edit"
                ? "Edit the description before saving"
                : "Review the suggested description"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <ImproveLoadingState />
          ) : modalState === "edit" ? (
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full"
            />
          ) : (
            <div className="space-y-3">
              {currentDescription && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current</p>
                  <p className="text-sm text-muted-foreground line-through">{currentDescription}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Suggested</p>
                <p className="text-sm">{generatedDescription}</p>
              </div>
            </div>
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
