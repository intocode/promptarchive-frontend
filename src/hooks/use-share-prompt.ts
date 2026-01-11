"use client";

import { toast } from "sonner";
import { usePostPromptsIdShare } from "@/lib/api/generated/endpoints/sharing/sharing";
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
        const errorMessage =
          (error as { response?: { status?: number } })?.response?.status === 429
            ? "Rate limit reached, please try again later"
            : "Failed to generate share link. Please try again.";
        toast.error(errorMessage);
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
    isError: mutation.isError,
    data: mutation.data?.data,
    reset: mutation.reset,
  };
}
