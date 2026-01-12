"use client";

import { useState, type ReactElement, type KeyboardEvent } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usePostTags, getGetTagsQueryKey } from "@/lib/api/generated/endpoints/tags/tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateTagInput(): ReactElement {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createTag, isPending } = usePostTags({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTagsQueryKey() });
        setName("");
        toast.success("Tag created successfully");
      },
      onError: () => {
        toast.error("Failed to create tag. Please try again.");
      },
    },
  });

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName || isPending) return;
    createTag({ data: { name: trimmedName } });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New tag name..."
        disabled={isPending}
        className="flex-1"
      />
      <Button
        onClick={handleCreate}
        disabled={!name.trim() || isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Add
      </Button>
    </div>
  );
}
