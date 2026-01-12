"use client";

import type { ReactElement } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@shared/lib";
import type { GithubComIntocodePromptarchiveInternalServiceFolderResponse } from "@/types/api";
import { useReorderFolders } from "@features/folder-management";
import { FolderItem } from "@entities/folder";

interface SortableFolderItemProps {
  folder: GithubComIntocodePromptarchiveInternalServiceFolderResponse;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

function SortableFolderItem({
  folder,
  isActive,
  onClick,
  onDelete,
}: SortableFolderItemProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id ?? "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-50")}
    >
      <FolderItem
        folder={folder}
        isActive={isActive}
        onClick={onClick}
        onDelete={onDelete}
        showDragHandle
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface DraggableFolderListProps {
  folders: GithubComIntocodePromptarchiveInternalServiceFolderResponse[];
  selectedFolderId?: string;
  onFolderSelect: (folderId: string | undefined) => void;
  onFolderDelete: (
    folder: GithubComIntocodePromptarchiveInternalServiceFolderResponse
  ) => void;
}

export function DraggableFolderList({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderDelete,
}: DraggableFolderListProps): ReactElement {
  const { reorderFolders } = useReorderFolders();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = folders.findIndex((f) => f.id === active.id);
      const newIndex = folders.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(folders, oldIndex, newIndex);
        const folderIds = newOrder
          .map((f) => f.id)
          .filter((id): id is string => id !== undefined);
        reorderFolders(folderIds);
      }
    }
  };

  const folderIds = folders
    .map((f) => f.id)
    .filter((id): id is string => id !== undefined);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={folderIds} strategy={verticalListSortingStrategy}>
        {folders.map((folder) => (
          <SortableFolderItem
            key={folder.id}
            folder={folder}
            isActive={selectedFolderId === folder.id}
            onClick={() => onFolderSelect(folder.id)}
            onDelete={() => onFolderDelete(folder)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
