"use client";

import * as React from "react";
import { toast } from "sonner";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
import { TagAutocomplete } from "./tag-autocomplete";

const MAX_TAGS = 10;

interface InlineTagEditorProps {
  promptId: string;
  currentTags: GithubComIntocodePromptarchiveInternalServiceTagSummary[];
  disabled?: boolean;
}

export function InlineTagEditor({
  promptId,
  currentTags,
  disabled = false,
}: InlineTagEditorProps): React.ReactElement {
  // Local state for optimistic updates (since API returns tag_ids, not full tags)
  const [tags, setTags] = React.useState(currentTags);

  // Sync with props when server data changes
  React.useEffect(() => {
    setTags(currentTags);
  }, [currentTags]);

  const { updatePrompt, isPending } = useUpdatePrompt(promptId, {
    onError: () => setTags(currentTags), // Revert on error
  });

  const handleTagsChange = (
    newTags: GithubComIntocodePromptarchiveInternalServiceTagSummary[]
  ) => {
    if (newTags.length > MAX_TAGS) {
      toast.error(`Maximum ${MAX_TAGS} tags allowed per prompt`);
      return;
    }

    setTags(newTags); // Optimistic update
    const tagIds = newTags
      .map((t) => t.id)
      .filter((id): id is string => !!id);
    updatePrompt({ tag_ids: tagIds });
  };

  return (
    <TagAutocomplete
      value={tags}
      onChange={handleTagsChange}
      maxTags={MAX_TAGS}
      placeholder="Add tags..."
      disabled={disabled || isPending}
    />
  );
}
