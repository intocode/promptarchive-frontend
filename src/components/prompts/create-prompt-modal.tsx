"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreatePromptForm } from "./create-prompt-form";

interface CreatePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePromptModal({
  open,
  onOpenChange,
}: CreatePromptModalProps): React.ReactElement {
  function closeModal() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
          <DialogDescription>
            Add a new prompt to your collection
          </DialogDescription>
        </DialogHeader>
        <CreatePromptForm onSuccess={closeModal} onCancel={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
