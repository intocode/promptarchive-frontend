"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { InternalHandlerCreateFolderRequest } from "@/types/api";
import {
  usePostFolders,
  getGetFoldersQueryKey,
} from "@/lib/api/generated/endpoints/folders/folders";

interface UseCreateFolderOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useCreateFolder(options?: UseCreateFolderOptions) {
  const queryClient = useQueryClient();

  const mutation = usePostFolders({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetFoldersQueryKey(),
        });

        toast.success("Folder created successfully");
        options?.onSuccess?.();
      },

      onError: () => {
        toast.error("Failed to create folder. Please try again.");
        options?.onError?.();
      },
    },
  });

  function createFolder(data: InternalHandlerCreateFolderRequest) {
    mutation.mutate({ data });
  }

  return {
    createFolder,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
