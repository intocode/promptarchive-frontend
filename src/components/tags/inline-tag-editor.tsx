"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import type { GithubComIntocodePromptarchiveInternalServiceTagSummary } from "@/types/api";
import { useUpdatePrompt } from "@/hooks/use-update-prompt";
import { useGenerateTags } from "@/hooks/use-generate-tags";
import { usePostTags } from "@/lib/api/generated/endpoints/tags/tags";
import { Button } from "@/components/ui/button";
import { TagAutocomplete } from "./tag-autocomplete";
import { TagSuggestion, LoadingDots } from "./tag-suggestion";

const MAX_TAGS = 10;
const SUGGESTION_TIMEOUT_MS = 5000;

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
  const [suggestedTags, setSuggestedTags] = React.useState<string[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = React.useState(0);
  const suggestionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync with props when server data changes
  React.useEffect(() => {
    setTags(currentTags);
  }, [currentTags]);

  const { updatePrompt, isPending } = useUpdatePrompt(promptId, {
    onError: () => setTags(currentTags), // Revert on error
  });

  const { generateTags, isPending: isGenerating, reset: resetGenerate } = useGenerateTags({
    onSuccess: (newSuggestions) => {
      // Filter out tags that already exist
      const existingTagNames = new Set(tags.map(t => t.name?.toLowerCase()));
      const filteredSuggestions = newSuggestions.filter(
        s => !existingTagNames.has(s.toLowerCase())
      );

      if (filteredSuggestions.length === 0) {
        toast.info("All suggested tags are already added");
        return;
      }

      setSuggestedTags(filteredSuggestions);
      setCurrentSuggestionIndex(0);
      startSuggestionTimeout();
    },
  });

  const createTagMutation = usePostTags({
    mutation: {
      onSuccess: (response) => {
        if (response.data) {
          const newTag: GithubComIntocodePromptarchiveInternalServiceTagSummary = {
            id: response.data.id,
            name: response.data.name,
          };
          const newTags = [...tags, newTag];
          setTags(newTags);
          const tagIds = newTags.map(t => t.id).filter((id): id is string => !!id);
          updatePrompt({ tag_ids: tagIds });
          moveToNextSuggestion();
        }
      },
      onError: () => {
        toast.error("Failed to create tag");
      },
    },
  });

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, []);

  function startSuggestionTimeout() {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    suggestionTimeoutRef.current = setTimeout(() => {
      clearSuggestions();
    }, SUGGESTION_TIMEOUT_MS);
  }

  function clearSuggestions() {
    setSuggestedTags([]);
    setCurrentSuggestionIndex(0);
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
      suggestionTimeoutRef.current = null;
    }
    resetGenerate();
  }

  function moveToNextSuggestion() {
    const nextIndex = currentSuggestionIndex + 1;
    if (nextIndex >= suggestedTags.length) {
      clearSuggestions();
    } else {
      setCurrentSuggestionIndex(nextIndex);
      startSuggestionTimeout();
    }
  }

  function handleAcceptSuggestion() {
    const suggestionName = suggestedTags[currentSuggestionIndex];
    if (!suggestionName) return;

    // Check max tags
    if (tags.length >= MAX_TAGS) {
      toast.error(`Maximum ${MAX_TAGS} tags allowed per prompt`);
      clearSuggestions();
      return;
    }

    // Create the tag
    createTagMutation.mutate({ data: { name: suggestionName } });
  }

  function handleDismissSuggestion() {
    moveToNextSuggestion();
  }

  function handleGenerateTags() {
    if (tags.length >= MAX_TAGS) {
      toast.error(`Maximum ${MAX_TAGS} tags already reached`);
      return;
    }
    generateTags(promptId);
  }

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

  const currentSuggestion = suggestedTags[currentSuggestionIndex];
  const showSuggestion = currentSuggestion && !isGenerating;

  return (
    <div className="flex items-center gap-2">
      <TagAutocomplete
        value={tags}
        onChange={handleTagsChange}
        maxTags={MAX_TAGS}
        placeholder="Add tags..."
        disabled={disabled || isPending}
      />

      {showSuggestion && (
        <TagSuggestion
          name={currentSuggestion}
          onAccept={handleAcceptSuggestion}
          onDismiss={handleDismissSuggestion}
        />
      )}

      {isGenerating && <LoadingDots />}

      {!showSuggestion && !isGenerating && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerateTags}
          disabled={isPending || tags.length >= MAX_TAGS}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          title="Generate tag suggestions with AI"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
