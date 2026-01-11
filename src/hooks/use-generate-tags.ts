"use client";

import { toast } from "sonner";
import { usePostPromptsIdGenerateTags } from "@/lib/api/generated/endpoints/ai/ai";

interface UseGenerateTagsOptions {
  onSuccess?: (suggestedTags: string[]) => void;
  onError?: () => void;
}

interface UseGenerateTagsReturn {
  generateTags: (promptId: string) => void;
  isPending: boolean;
  isError: boolean;
  suggestedTags: string[];
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
        const errorMessage =
          (error as { response?: { status?: number } })?.response?.status === 429
            ? "Rate limit reached, please try again later"
            : "Failed to generate tags. Please try again.";
        toast.error(errorMessage);
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
    isError: mutation.isError,
    suggestedTags: mutation.data?.data?.suggested_tags ?? [],
    reset: mutation.reset,
  };
}
