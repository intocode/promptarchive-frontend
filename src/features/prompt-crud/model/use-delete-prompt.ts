"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  useDeletePromptsId,
  getGetPromptsIdQueryKey,
} from "@shared/api/generated/endpoints/prompts/prompts";

interface UseDeletePromptOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useDeletePrompt(
  promptId: string,
  options?: UseDeletePromptOptions
) {
  const queryClient = useQueryClient();

  const mutation = useDeletePromptsId({
    mutation: {
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: getGetPromptsIdQueryKey(promptId),
        });
        queryClient.invalidateQueries({ queryKey: ["/prompts"] });

        toast.success("Prompt deleted successfully");
        options?.onSuccess?.();
      },

      onError: () => {
        toast.error("Failed to delete prompt. Please try again.");
        options?.onError?.();
      },
    },
  });

  function deletePrompt() {
    mutation.mutate({ id: promptId });
  }

  return {
    deletePrompt,
    isPending: mutation.isPending,
  };
}
