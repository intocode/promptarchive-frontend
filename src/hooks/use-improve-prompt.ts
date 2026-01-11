"use client";

import { toast } from "sonner";
import { usePostPromptsIdImprove } from "@/lib/api/generated/endpoints/ai/ai";
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
        const errorMessage =
          (error as { response?: { status?: number } })?.response?.status === 429
            ? "Rate limit reached, please try again later"
            : "Failed to improve prompt. Please try again.";
        toast.error(errorMessage);
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
