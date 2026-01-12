"use client";

import * as React from "react";

import type { GithubComIntocodePromptarchiveInternalServiceFolderSummary } from "@/types/api";
import { useUpdatePrompt } from "@features/prompt-crud";
import { FolderSelector } from "./folder-selector";

interface InlineFolderEditorProps {
  promptId: string;
  currentFolder: GithubComIntocodePromptarchiveInternalServiceFolderSummary | null;
  disabled?: boolean;
}

export function InlineFolderEditor({
  promptId,
  currentFolder,
  disabled = false,
}: InlineFolderEditorProps): React.ReactElement {
  // Local state for optimistic updates
  const [folder, setFolder] =
    React.useState<GithubComIntocodePromptarchiveInternalServiceFolderSummary | null>(
      currentFolder
    );

  // Sync with props when server data changes
  React.useEffect(() => {
    setFolder(currentFolder);
  }, [currentFolder]);

  const { updatePrompt, isPending } = useUpdatePrompt(promptId, {
    onError: () => setFolder(currentFolder), // Revert on error
  });

  const handleFolderChange = (
    newFolder: GithubComIntocodePromptarchiveInternalServiceFolderSummary | null
  ) => {
    setFolder(newFolder); // Optimistic update
    // Use empty string to clear folder, or folder ID to set
    updatePrompt({ folder_id: newFolder?.id || "" });
  };

  return (
    <FolderSelector
      value={folder}
      onChange={handleFolderChange}
      disabled={disabled || isPending}
    />
  );
}
