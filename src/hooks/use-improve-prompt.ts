"use client";

import { usePostPromptsIdImprove } from "@/lib/api/generated/endpoints/ai/ai";
import { handleApiError } from "@/lib/utils/api-error";
import type { GithubComIntocodePromptarchiveInternalServiceImprovePromptResponse } from "@/types/api";

interface UseImprovePromptOptions {
  onSuccess?: (data: GithubComIntocodePromptarchiveInternalServiceImprovePromptResponse) => void;
  onError?: () => void;
}

export function useImprovePrompt(options?: UseImprovePromptOptions) {
  const mutation = usePostPromptsIdImprove({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          options?.onSuccess?.(response.data);
        }
      },
      onError: (error) => {
        handleApiError(error, "Failed to improve prompt. Please try again.");
        options?.onError?.();
      },
    },
  });

  function improvePrompt(promptId: string) {
    mutation.mutate({ id: promptId });
  }

  return {
    improvePrompt,
    isPending: mutation.isPending,
    isError: mutation.isError,
    data: mutation.data?.data,
    reset: mutation.reset,
  };
}
