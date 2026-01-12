"use client";

import { usePostPromptsIdShare } from "@/lib/api/generated/endpoints/sharing/sharing";
import { handleApiError } from "@/lib/utils/api-error";
import type { GithubComIntocodePromptarchiveInternalServiceShareLinkResponse } from "@/types/api";

interface UseSharePromptOptions {
  onSuccess?: (data: GithubComIntocodePromptarchiveInternalServiceShareLinkResponse) => void;
  onError?: () => void;
}

export function useSharePrompt(options?: UseSharePromptOptions) {
  const mutation = usePostPromptsIdShare({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          options?.onSuccess?.(response.data);
        }
      },
      onError: (error) => {
        handleApiError(error, "Failed to generate share link. Please try again.");
        options?.onError?.();
      },
    },
  });

  function sharePrompt(promptId: string) {
    mutation.mutate({ id: promptId });
  }

  return {
    sharePrompt,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
}
