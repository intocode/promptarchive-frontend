"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import type { GetPromptsVisibility } from "@/types/api";

const URL_PARAM_FOLDER = "folder";
const URL_PARAM_TAGS = "tags";
const URL_PARAM_VISIBILITY = "visibility";

export interface PromptsFilters {
  folderId?: string;
  tagIds: string[];
  visibility?: GetPromptsVisibility;
}

export interface UsePromptsFiltersResult {
  filters: PromptsFilters;
  setFolderId: (id: string | undefined) => void;
  setTagIds: (ids: string[]) => void;
  addTagId: (id: string) => void;
  removeTagId: (id: string) => void;
  setVisibility: (v: GetPromptsVisibility | undefined) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export function usePromptsFilters(): UsePromptsFiltersResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<PromptsFilters>(() => {
    const folderParam = searchParams.get(URL_PARAM_FOLDER);
    const folderId = folderParam || undefined;
    const tagsParam = searchParams.get(URL_PARAM_TAGS);
    const tagIds = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    const visibilityParam = searchParams.get(URL_PARAM_VISIBILITY);
    const visibility = visibilityParam
      ? (visibilityParam as GetPromptsVisibility)
      : undefined;

    return { folderId, tagIds, visibility };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.push(query ? `?${query}` : "/prompts", { scroll: false });
    },
    [router, searchParams]
  );

  const setFolderId = useCallback(
    (id: string | undefined) => {
      updateParams({ [URL_PARAM_FOLDER]: id });
    },
    [updateParams]
  );

  const setTagIds = useCallback(
    (ids: string[]) => {
      updateParams({ [URL_PARAM_TAGS]: ids.length > 0 ? ids.join(",") : undefined });
    },
    [updateParams]
  );

  const addTagId = useCallback(
    (id: string) => {
      if (!filters.tagIds.includes(id)) {
        setTagIds([...filters.tagIds, id]);
      }
    },
    [filters.tagIds, setTagIds]
  );

  const removeTagId = useCallback(
    (id: string) => {
      setTagIds(filters.tagIds.filter((tagId) => tagId !== id));
    },
    [filters.tagIds, setTagIds]
  );

  const setVisibility = useCallback(
    (v: GetPromptsVisibility | undefined) => {
      updateParams({ [URL_PARAM_VISIBILITY]: v });
    },
    [updateParams]
  );

  const clearAllFilters = useCallback(() => {
    updateParams({
      [URL_PARAM_FOLDER]: undefined,
      [URL_PARAM_TAGS]: undefined,
      [URL_PARAM_VISIBILITY]: undefined,
    });
  }, [updateParams]);

  const hasActiveFilters =
    filters.folderId !== undefined ||
    filters.tagIds.length > 0 ||
    filters.visibility !== undefined;

  const activeFilterCount =
    (filters.folderId ? 1 : 0) +
    filters.tagIds.length +
    (filters.visibility ? 1 : 0);

  return {
    filters,
    setFolderId,
    setTagIds,
    addTagId,
    removeTagId,
    setVisibility,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
