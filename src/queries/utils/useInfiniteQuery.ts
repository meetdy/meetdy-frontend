import _httpsAxios from '@/api/instance/_httpsAxios';
import {
  keepPreviousData,
  QueryFunctionContext,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery as useRQInfiniteQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useCallback, useMemo } from 'react';

export type InfiniteResponseType = any & {
  pages?: Array<any>;
};

export const PER_PAGE = 20;

export function useExplorerQuery(
  query: UseInfiniteQueryResult<InfiniteResponseType, unknown>,
) {
  const data = useMemo(
    () => query.data?.pages?.flatMap((d: any) => d.data ?? []) ?? [],
    [query.data],
  );
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage.call(undefined);
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  return { ...query, data, loadMore };
}

type UseInfiniteQueryParams = {
  queryKey: QueryKey;
  url: string;
  variables?: Record<string, unknown>;
  limit?: number;
  options?: UseInfiniteQueryOptions<any, unknown, any, any, QueryKey>;
};

function useInfiniteQuery({
  queryKey,
  url,
  variables,
  limit = PER_PAGE,
  options,
}: UseInfiniteQueryParams) {
  const query = useRQInfiniteQuery({
    queryKey: [queryKey, { url, limit, variables }],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext<QueryKey>) => {
      const response = (await _httpsAxios.get(url, {
        params: {
          limit,
          offset: Number(pageParam ?? 0) * limit,
          ...variables,
        },
      })) as AxiosResponse<any>;

      return response;
    },
    staleTime: 10 * 1000,
    gcTime: 0,
    retry: false,
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const nextPage = allPages.length;
      const offset = nextPage * limit;
      return offset < lastPage.total ? nextPage : undefined;
    },
    ...(options || {}),
  });

  const explorer = useExplorerQuery(query);
  return explorer;
}

export { useInfiniteQuery };
