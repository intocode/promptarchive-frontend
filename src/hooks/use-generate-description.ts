"use client";

import { usePostPromptsIdGenerateDescription } from "@/lib/api/generated/endpoints/ai/ai";
import { handleApiError } from "@/lib/utils/api-error";
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
    isError: mutation.isError,
    data: mutation.data?.data,
    reset: mutation.reset,
  };
}
