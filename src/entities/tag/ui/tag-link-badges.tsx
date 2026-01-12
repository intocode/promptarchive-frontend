import Link from "next/link";
import { Tag } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { Badge } from "@shared/ui";

interface TagLinkBadgesProps {
  tags: GithubComIntocodePromptarchiveInternalServiceTagSummary[];
}

export function TagLinkBadges({
  tags,
}: TagLinkBadgesProps): React.ReactElement | null {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        if (!tag.id || !tag.name) return null;
        return (
          <Link key={tag.id} href={`/prompts?tags=${tag.id}`}>
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
              style={tag.color ? { backgroundColor: `${tag.color}20`, borderColor: tag.color } : undefined}
            >
              <Tag
                className="h-3 w-3"
                style={tag.color ? { color: tag.color } : undefined}
              />
              {tag.name}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
