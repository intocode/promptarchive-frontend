"use client";

import { usePostPromptsIdGenerateTags } from "@shared/api/generated/endpoints/ai/ai";
import { handleApiError } from "@shared/lib";

interface UseGenerateTagsOptions {
  onSuccess?: (suggestedTags: string[]) => void;
  onError?: () => void;
}

interface UseGenerateTagsReturn {
  generateTags: (promptId: string) => void;
  isPending: boolean;
  reset: () => void;
}

export function useGenerateTags(options?: UseGenerateTagsOptions): UseGenerateTagsReturn {
  const mutation = usePostPromptsIdGenerateTags({
    mutation: {
      onSuccess: (response) => {
        if (response.data?.suggested_tags) {
          options?.onSuccess?.(response.data.suggested_tags);
        }
      },
      onError: (error) => {
        handleApiError(error, "Failed to generate tags. Please try again.");
        options?.onError?.();
      },
    },
  });

  function generateTags(promptId: string) {
    mutation.mutate({ id: promptId });
  }

  return {
    generateTags,
    isPending: mutation.isPending,
    reset: mutation.reset,
  };
}
