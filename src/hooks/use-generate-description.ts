"use client";

import { toast } from "sonner";
import { usePostPromptsIdGenerateDescription } from "@/lib/api/generated/endpoints/ai/ai";
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
        const errorMessage =
          (error as { response?: { status?: number } })?.response?.status === 429
            ? "Rate limit reached, please try again later"
            : "Failed to generate description. Please try again.";
        toast.error(errorMessage);
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
