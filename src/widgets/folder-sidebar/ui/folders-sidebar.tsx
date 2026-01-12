"use client";

import { useState, type ReactElement } from "react";
import { Plus, FolderX } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceFolderResponse } from "@/types/api";
import { useGetFolders } from "@shared/api/generated/endpoints/folders/folders";
import { Button } from "@shared/ui";
import { Skeleton } from "@shared/ui";
import { AllFoldersItem } from "@entities/folder";
import { CreateFolderModal } from "@features/folder-management";
import { DeleteFolderDialog } from "@features/folder-management";
import { DraggableFolderList } from "@features/folder-management";

interface FoldersSidebarProps {
  selectedFolderId?: string;
  onFolderSelect: (folderId: string | undefined) => void;
}

export function FoldersSidebar({
  selectedFolderId,
  onFolderSelect,
}: FoldersSidebarProps): ReactElement {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<
    GithubComIntocodePromptarchiveInternalServiceFolderResponse | null
  >(null);

  const { data, isLoading } = useGetFolders();
  const folders = data?.data ?? [];

  const totalPromptsCount = folders.reduce(
    (sum, folder) => sum + (folder.prompts_count ?? 0),
    0
  );

  const handleFolderDeleted = () => {
    if (folderToDelete?.id === selectedFolderId) {
      onFolderSelect(undefined);
    }
    setFolderToDelete(null);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-sm font-medium">Folders</h2>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <FoldersSidebarSkeleton />
        ) : (
          <div className="space-y-0.5">
            <AllFoldersItem
              isActive={selectedFolderId === undefined}
              onClick={() => onFolderSelect(undefined)}
              totalCount={totalPromptsCount}
            />

            {folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FolderX className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No folders yet
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Create folder
                </Button>
              </div>
            ) : (
              <DraggableFolderList
                folders={folders}
                selectedFolderId={selectedFolderId}
                onFolderSelect={onFolderSelect}
                onFolderDelete={setFolderToDelete}
              />
            )}
          </div>
        )}
      </div>

      <CreateFolderModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {folderToDelete && (
        <DeleteFolderDialog
          open={!!folderToDelete}
          onOpenChange={(open) => !open && setFolderToDelete(null)}
          folder={{
            id: folderToDelete.id ?? "",
            name: folderToDelete.name ?? "",
            prompts_count: folderToDelete.prompts_count,
          }}
          onDeleted={handleFolderDeleted}
        />
      )}
    </div>
  );
}

function FoldersSidebarSkeleton(): ReactElement {
  return (
    <div className="space-y-1">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-3/4" />
    </div>
  );
}
