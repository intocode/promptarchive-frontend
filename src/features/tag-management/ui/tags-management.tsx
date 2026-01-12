"use client";

import { useState, type ReactElement } from "react";
import { Tags, TagIcon } from "lucide-react";

import type { GithubComIntocodePromptarchiveInternalServiceTagResponse } from "@/types/api";
import { useGetTags } from "@shared/api/generated/endpoints/tags/tags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui";
import { Skeleton } from "@shared/ui";
import { TagItem } from "@entities/tag";
import { CreateTagInput } from "./create-tag-input";
import { DeleteTagDialog } from "./delete-tag-dialog";

export function TagsManagement(): ReactElement {
  const [tagToDelete, setTagToDelete] = useState<
    GithubComIntocodePromptarchiveInternalServiceTagResponse | null
  >(null);

  const { data, isLoading } = useGetTags();
  const tags = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Tags
        </CardTitle>
        <CardDescription>
          Create and manage tags to organize your prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateTagInput />

        {isLoading ? (
          <TagsListSkeleton />
        ) : tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TagIcon className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No tags yet. Create your first tag above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <TagItem
                key={tag.id}
                tag={tag}
                onDelete={() => setTagToDelete(tag)}
              />
            ))}
          </div>
        )}

        {tagToDelete && (
          <DeleteTagDialog
            open={!!tagToDelete}
            onOpenChange={(open) => !open && setTagToDelete(null)}
            tag={{
              id: tagToDelete.id ?? "",
              name: tagToDelete.name ?? "",
              prompts_count: tagToDelete.prompts_count,
            }}
            onDeleted={() => setTagToDelete(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}

function TagsListSkeleton(): ReactElement {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
