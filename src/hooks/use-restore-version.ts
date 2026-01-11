"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  usePostPromptsIdVersionsVidRestore,
  getGetPromptsIdVersionsQueryKey,
} from "@/lib/api/generated/endpoints/versions/versions";
import {
  getGetPromptsIdQueryKey,
  getGetPromptsQueryKey,
} from "@/lib/api/generated/endpoints/prompts/prompts";

interface UseRestoreVersionOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

interface UseRestoreVersionReturn {
  restoreVersion: (versionId: string) => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export function useRestoreVersion(
  promptId: string,
  options?: UseRestoreVersionOptions
): UseRestoreVersionReturn {
  const queryClient = useQueryClient();

  const mutation = usePostPromptsIdVersionsVidRestore({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetPromptsIdQueryKey(promptId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPromptsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPromptsIdVersionsQueryKey(promptId),
        });

        toast.success("Version restored successfully");
        options?.onSuccess?.();
      },

      onError: () => {
        toast.error("Failed to restore version. Please try again.");
        options?.onError?.();
      },
    },
  });

  function restoreVersion(versionId: string) {
    mutation.mutate({ id: promptId, vid: versionId });
  }

  return {
    restoreVersion,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
