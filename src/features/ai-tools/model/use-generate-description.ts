"use client";

import { usePostPromptsIdGenerateDescription } from "@shared/api/generated/endpoints/ai/ai";
import { handleApiError } from "@shared/lib";
import type { GithubComIntocodePromptarchiveInternalServiceGenerateDescriptionResponse } from "@/types/api";

interface UseGenerateDescriptionOptions {
  onSuccess?: (data: GithubComIntocodePromptarchiveInternalServiceGenerateDescriptionResponse) => void;
  onError?: () => void;
}

export function useGenerateDescription(options?: UseGenerateDescriptionOptions) {
  const mutation = usePostPromptsIdGenerateDescription({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          options?.onSuccess?.(response.data);
        }
      },
      onError: (error) => {
        handleApiError(error, "Failed to generate description. Please try again.");
        options?.onError?.();
      },
    },
  });

  function generateDescription(promptId: string) {
    mutation.mutate({ id: promptId });
  }

  return {
    generateDescription,
    isPending: mutation.isPending,
  };
}
