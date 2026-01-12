"use client";

import { usePostPromptsIdImprove } from "@shared/api/generated/endpoints/ai/ai";
import { handleApiError } from "@shared/lib";
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
  };
}
