"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  InternalHandlerUpdateFolderRequest,
  GetFolders200,
} from "@/types/api";
import {
  usePatchFoldersId,
  getGetFoldersQueryKey,
} from "@/lib/api/generated/endpoints/folders/folders";

interface UseUpdateFolderOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useUpdateFolder(
  folderId: string,
  options?: UseUpdateFolderOptions
) {
  const queryClient = useQueryClient();

  const mutation = usePatchFoldersId({
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
              data: old.data.map((folder) =>
                folder.id === folderId
                  ? { ...folder, ...variables.data, updated_at: new Date().toISOString() }
                  : folder
              ),
            };
          }
        );

        return { previousFolders };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFoldersQueryKey(),
        });

        toast.success("Folder updated successfully");
        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            getGetFoldersQueryKey(),
            context.previousFolders
          );
        }

        toast.error("Failed to update folder. Please try again.");
        options?.onError?.();
      },
    },
  });

  function updateFolder(data: InternalHandlerUpdateFolderRequest) {
    mutation.mutate({ id: folderId, data });
  }

  return {
    updateFolder,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
