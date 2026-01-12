"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  InternalHandlerUpdateTagRequest,
  GetTags200,
} from "@/types/api";
import {
  usePatchTagsId,
  getGetTagsQueryKey,
} from "@/lib/api/generated/endpoints/tags/tags";
import { getGetPromptsQueryKey } from "@/lib/api/generated/endpoints/prompts/prompts";

interface UseUpdateTagOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useUpdateTag(
  tagId: string,
  options?: UseUpdateTagOptions
) {
  const queryClient = useQueryClient();

  const mutation = usePatchTagsId({
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
              data: old.data.map((tag) =>
                tag.id === tagId
                  ? { ...tag, ...variables.data, updated_at: new Date().toISOString() }
                  : tag
              ),
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

        toast.success("Tag updated successfully");
        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousTags) {
          queryClient.setQueryData(getGetTagsQueryKey(), context.previousTags);
        }

        toast.error("Failed to update tag. Please try again.");
        options?.onError?.();
      },
    },
  });

  function updateTag(data: InternalHandlerUpdateTagRequest) {
    mutation.mutate({ id: tagId, data });
  }

  return {
    updateTag,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
