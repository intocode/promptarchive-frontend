"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { InternalHandlerUpdatePromptRequest } from "@/types/api";
import {
  usePatchPromptsId,
  getGetPromptsIdQueryKey,
  getGetPromptsQueryKey,
} from "@/lib/api/generated/endpoints/prompts/prompts";

interface UseUpdatePromptOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useUpdatePrompt(
  promptId: string,
  options?: UseUpdatePromptOptions
) {
  const queryClient = useQueryClient();

  const mutation = usePatchPromptsId({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: getGetPromptsIdQueryKey(promptId),
        });

        const previousPrompt = queryClient.getQueryData(
          getGetPromptsIdQueryKey(promptId)
        );

        queryClient.setQueryData(
          getGetPromptsIdQueryKey(promptId),
          (old: unknown) => {
            if (!old || typeof old !== "object") return old;
            const oldData = old as { data?: Record<string, unknown> };
            return {
              ...oldData,
              data: {
                ...oldData.data,
                ...variables.data,
                updated_at: new Date().toISOString(),
              },
            };
          }
        );

        return { previousPrompt };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetPromptsIdQueryKey(promptId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPromptsQueryKey(),
        });

        toast.success("Prompt updated successfully");
        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousPrompt) {
          queryClient.setQueryData(
            getGetPromptsIdQueryKey(promptId),
            context.previousPrompt
          );
        }

        toast.error("Failed to update prompt. Please try again.");
        options?.onError?.();
      },
    },
  });

  function updatePrompt(data: InternalHandlerUpdatePromptRequest) {
    mutation.mutate({ id: promptId, data });
  }

  return {
    updatePrompt,
    isPending: mutation.isPending,
  };
}
