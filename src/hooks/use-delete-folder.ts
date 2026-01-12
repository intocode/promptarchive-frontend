"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetFolders200 } from "@/types/api";
import {
  useDeleteFoldersId,
  getGetFoldersQueryKey,
} from "@/lib/api/generated/endpoints/folders/folders";
import { getGetPromptsQueryKey } from "@/lib/api/generated/endpoints/prompts/prompts";

interface UseDeleteFolderOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useDeleteFolder(options?: UseDeleteFolderOptions) {
  const queryClient = useQueryClient();

  const mutation = useDeleteFoldersId({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: getGetFoldersQueryKey(),
        });

        const previousFolders = queryClient.getQueryData(
          getGetFoldersQueryKey()
        );

        queryClient.setQueryData(
          getGetFoldersQueryKey(),
          (old: GetFolders200 | undefined) => {
            if (!old?.data) return old;
            return {
              ...old,
              data: old.data.filter((folder) => folder.id !== variables.id),
            };
          }
        );

        return { previousFolders };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFoldersQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPromptsQueryKey(),
        });

        toast.success("Folder deleted successfully");
        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            getGetFoldersQueryKey(),
            context.previousFolders
          );
        }

        toast.error("Failed to delete folder. Please try again.");
        options?.onError?.();
      },
    },
  });

  function deleteFolder(folderId: string) {
    mutation.mutate({ id: folderId });
  }

  return {
    deleteFolder,
    isPending: mutation.isPending,
  };
}
