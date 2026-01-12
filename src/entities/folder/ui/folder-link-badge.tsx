import Link from "next/link";
import { Folder } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceFolderSummary } from "@/types/api";
import { Badge } from "@shared/ui";

interface FolderLinkBadgeProps {
  folder: GithubComIntocodePromptarchiveInternalServiceFolderSummary;
}

export function FolderLinkBadge({
  folder,
}: FolderLinkBadgeProps): React.ReactElement | null {
  if (!folder.id || !folder.name) return null;

  return (
    <Link href={`/prompts?folder=${folder.id}`}>
      <Badge
        variant="outline"
        className="gap-1.5 cursor-pointer hover:bg-accent transition-colors"
        style={folder.color ? { borderColor: folder.color } : undefined}
      >
        <Folder
          className="h-3 w-3"
          style={folder.color ? { color: folder.color } : undefined}
        />
        {folder.name}
      </Badge>
    </Link>
  );
}
