"use client";

import { useState } from "react";
import { History, Loader2, RotateCcw } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceVersionResponse } from "@/types/api";
import { formatRelativeDate } from "@/lib/utils";
import { useGetPromptsIdVersions } from "@/lib/api/generated/endpoints/versions/versions";
import { useRestoreVersion } from "@/hooks/use-restore-version";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DiffView } from "@/components/prompts/diff-view";

interface VersionHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  currentContent: string;
}

const CONTENT_PREVIEW_LENGTH = 100;

function getContentPreview(content: string | undefined): string {
  if (!content) return "No content";
  return content.length > CONTENT_PREVIEW_LENGTH
    ? `${content.slice(0, CONTENT_PREVIEW_LENGTH)}...`
    : content;
}

interface VersionItemProps {
  version: GithubComIntocodePromptarchiveInternalServiceVersionResponse;
  isSelected: boolean;
  onClick: () => void;
}

function VersionItem({
  version,
  isSelected,
  onClick,
}: VersionItemProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">
          Version {version.version_number}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeDate(version.created_at)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 font-content">
        {getContentPreview(version.content)}
      </p>
    </button>
  );
}

export function VersionHistorySheet({
  open,
  onOpenChange,
  promptId,
  currentContent,
}: VersionHistorySheetProps): React.ReactElement {
  const [selectedVersion, setSelectedVersion] =
    useState<GithubComIntocodePromptarchiveInternalServiceVersionResponse | null>(
      null
    );
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const { data, isLoading, isError, refetch } = useGetPromptsIdVersions(
    promptId,
    {
      query: {
        enabled: open,
      },
    }
  );

  const { restoreVersion, isPending: isRestoring } = useRestoreVersion(
    promptId,
    {
      onSuccess: () => {
        setShowRestoreConfirm(false);
        setSelectedVersion(null);
        onOpenChange(false);
      },
    }
  );

  const versions = data?.data?.versions ?? [];

  function handleRestore() {
    if (selectedVersion?.id) {
      restoreVersion(selectedVersion.id);
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </SheetTitle>
            <SheetDescription>
              View and restore previous versions of your prompt
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4 px-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Failed to load versions
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="mt-2"
                >
                  Try again
                </Button>
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <History className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No version history yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Versions are created when you edit the prompt content
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto -mx-4 px-4">
                  <div className="space-y-2 pb-4">
                    {versions.map((version) => (
                      <VersionItem
                        key={version.id}
                        version={version}
                        isSelected={selectedVersion?.id === version.id}
                        onClick={() => setSelectedVersion(version)}
                      />
                    ))}
                  </div>
                </div>

                {selectedVersion && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Version {selectedVersion.version_number} vs Current
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setShowRestoreConfirm(true)}
                        disabled={isRestoring}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                    <DiffView
                      original={currentContent}
                      improved={selectedVersion.content ?? ""}
                      className="max-h-[200px]"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current content with Version{" "}
              {selectedVersion?.version_number}. The current content will be
              saved as a new version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={isRestoring}>
              {isRestoring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Restore"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
