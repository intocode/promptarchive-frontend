import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";

import {
  getPublicPrompts,
  getGetPublicPromptsQueryKey,
} from "@/lib/api/generated/endpoints/public-gallery/public-gallery";
import type {
  GetPublicPromptsParams,
  GetPublicPrompts200,
  GetPublicPromptsSort,
} from "@/types/api";

const PER_PAGE = 20;

interface UseInfinitePublicPromptsParams {
  search?: string;
  sort?: GetPublicPromptsSort;
}

export function useInfinitePublicPrompts(
  params?: UseInfinitePublicPromptsParams
): UseInfiniteQueryResult<InfiniteData<GetPublicPrompts200, number>, Error> {
  const queryParams: Omit<GetPublicPromptsParams, "page"> = {
    search: params?.search,
    sort: params?.sort,
  };

  return useInfiniteQuery({
    queryKey: [...getGetPublicPromptsQueryKey(queryParams), "infinite"],
    queryFn: async ({ pageParam, signal }) => {
      return getPublicPrompts(
        { ...queryParams, page: pageParam, per_page: PER_PAGE },
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
