import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

import {
  getPublicPrompts,
  getGetPublicPromptsQueryKey,
} from "@/lib/api/generated/endpoints/public-gallery/public-gallery";
import type { GetPublicPromptsParams, GetPublicPrompts200 } from "@/types/api";

const PER_PAGE = 20;

export function useInfinitePublicPrompts(
  params?: Omit<GetPublicPromptsParams, "page">
): UseInfiniteQueryResult<InfiniteData<GetPublicPrompts200, number>, Error> {
  return useInfiniteQuery({
    queryKey: [...getGetPublicPromptsQueryKey(params), "infinite"],
    queryFn: async ({ pageParam, signal }) => {
      return getPublicPrompts(
        { ...params, page: pageParam, per_page: PER_PAGE },
        signal
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetPublicPrompts200) => {
      const meta = lastPage.meta;
      if (!meta?.page || !meta?.total_pages) return undefined;
      return meta.page < meta.total_pages ? meta.page + 1 : undefined;
    },
  });
}
