import { useInfiniteQuery } from "@tanstack/react-query";

import {
  getPrompts,
  getGetPromptsQueryKey,
} from "@/lib/api/generated/endpoints/prompts/prompts";
import type { GetPromptsParams, GetPrompts200 } from "@/types/api";

const PER_PAGE = 20;

export function useInfinitePrompts(params?: Omit<GetPromptsParams, "page">) {
  return useInfiniteQuery({
    queryKey: [...getGetPromptsQueryKey(params), "infinite"],
    queryFn: async ({ pageParam, signal }) => {
      return getPrompts({ ...params, page: pageParam, per_page: PER_PAGE }, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetPrompts200) => {
      const meta = lastPage.meta;
      if (!meta?.page || !meta?.total_pages) return undefined;
      return meta.page < meta.total_pages ? meta.page + 1 : undefined;
    },
  });
}
