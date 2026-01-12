"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetFolders200 } from "@/types/api";
import {
  usePatchFoldersReorder,
  getGetFoldersQueryKey,
} from "@shared/api/generated/endpoints/folders/folders";

interface UseReorderFoldersOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useReorderFolders(options?: UseReorderFoldersOptions) {
  const queryClient = useQueryClient();

  const mutation = usePatchFoldersReorder({
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

            const folderMap = new Map(
              old.data.map((folder) => [folder.id, folder])
            );

            const reorderedFolders = variables.data.folder_ids
              .map((id, index) => {
                const folder = folderMap.get(id);
                if (!folder) return null;
                return { ...folder, position: index };
              })
              .filter(Boolean);

            return {
              ...old,
              data: reorderedFolders,
            };
          }
        );

        return { previousFolders };
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFoldersQueryKey(),
        });

        options?.onSuccess?.();
      },

      onError: (_error, _variables, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            getGetFoldersQueryKey(),
            context.previousFolders
          );
        }

        toast.error("Failed to reorder folders. Please try again.");
        options?.onError?.();
      },
    },
  });

  function reorderFolders(folderIds: string[]) {
    mutation.mutate({ data: { folder_ids: folderIds } });
  }

  return {
    reorderFolders,
    isPending: mutation.isPending,
  };
}
