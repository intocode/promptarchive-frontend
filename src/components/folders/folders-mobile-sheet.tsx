"use client";

import { useState, type ReactElement } from "react";
import { Plus, FolderX, Folder } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceFolderResponse } from "@/types/api";
import { useGetFolders } from "@/lib/api/generated/endpoints/folders/folders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FolderItem, AllFoldersItem } from "./folder-item";
import { CreateFolderModal } from "./create-folder-modal";
import { DeleteFolderDialog } from "./delete-folder-dialog";

interface FoldersMobileSheetProps {
  selectedFolderId?: string;
  onFolderSelect: (folderId: string | undefined) => void;
}

export function FoldersMobileSheet({
  selectedFolderId,
  onFolderSelect,
}: FoldersMobileSheetProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<
    GithubComIntocodePromptarchiveInternalServiceFolderResponse | null
  >(null);

  const { data, isLoading } = useGetFolders({
    query: {
      enabled: isOpen,
    },
  });
  const folders = data?.data ?? [];

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const buttonLabel = selectedFolder?.name ?? "All Prompts";

  const totalPromptsCount = folders.reduce(
    (sum, folder) => sum + (folder.prompts_count ?? 0),
    0
  );

  const handleFolderSelect = (folderId: string | undefined) => {
    onFolderSelect(folderId);
    setIsOpen(false);
  };

  const handleFolderDeleted = () => {
    if (folderToDelete?.id === selectedFolderId) {
      onFolderSelect(undefined);
    }
    setFolderToDelete(null);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Folder className="h-4 w-4" />
            <span className="max-w-[100px] truncate">{buttonLabel}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader className="flex flex-row items-center justify-between">
            <div>
              <SheetTitle>Folders</SheetTitle>
              <SheetDescription>
                Select a folder to filter prompts
              </SheetDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              New
            </Button>
          </SheetHeader>

          <div className="mt-4 flex-1 overflow-y-auto">
            {isLoading ? (
              <FoldersMobileSkeleton />
            ) : (
              <div className="space-y-1">
                <AllFoldersItem
                  isActive={selectedFolderId === undefined}
                  onClick={() => handleFolderSelect(undefined)}
                  totalCount={totalPromptsCount}
                />

                {folders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FolderX className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      No folders yet
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Create your first folder
                    </Button>
                  </div>
                ) : (
                  folders.map((folder) => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      isActive={selectedFolderId === folder.id}
                      onClick={() => handleFolderSelect(folder.id)}
                      onDelete={() => setFolderToDelete(folder)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

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
    </>
  );
}

function FoldersMobileSkeleton(): ReactElement {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
