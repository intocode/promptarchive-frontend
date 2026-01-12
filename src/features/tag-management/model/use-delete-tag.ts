"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetTags200 } from "@/types/api";
import {
  useDeleteTagsId,
  getGetTagsQueryKey,
} from "@shared/api/generated/endpoints/tags/tags";
import { getGetPromptsQueryKey } from "@shared/api/generated/endpoints/prompts/prompts";

interface UseDeleteTagOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useDeleteTag(options?: UseDeleteTagOptions) {
  const queryClient = useQueryClient();

  const mutation = useDeleteTagsId({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: getGetTagsQueryKey(),
        });

        const previousTags = queryClient.getQueryData(getGetTagsQueryKey());

        queryClient.setQueryData(
          getGetTagsQueryKey(),
          (old: GetTags200 | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.filter((tag) => tag.id !== variables.id),
            };
          }
        );

        return { previousTags };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetTagsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPromptsQueryKey(),
        });

        toast.success("Tag deleted successfully");
        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousTags) {
          queryClient.setQueryData(getGetTagsQueryKey(), context.previousTags);
        }

        toast.error("Failed to delete tag. Please try again.");
        options?.onError?.();
      },
    },
  });

  function deleteTag(tagId: string) {
    mutation.mutate({ id: tagId });
  }

  return {
    deleteTag,
    isPending: mutation.isPending,
  };
}
