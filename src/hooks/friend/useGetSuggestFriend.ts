import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { ISuggestFriend } from '@/models/friend.model';
import FriendService from '@/api/friendApi';

type TFetchSuggestFriend = {
  page: number;
  size: number;
};

export const createKeySuggestFriend = (page: number, size: number) =>
  createQueryKey('fetchSuggestFriend', { page, size });

interface UseFetchSuggestFriendProps {
  params: TFetchSuggestFriend;
  enabled?: boolean;
}

export function useGetSuggestFriend({
  params: { page, size },
  enabled = true,
}: UseFetchSuggestFriendProps) {
  const { data, isFetched, isFetching, isError, error } = useQuery<
    ISuggestFriend[]
  >({
    queryKey: createKeySuggestFriend(page, size),
    queryFn: () => FriendService.getSuggestFriend(page, size),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes - longer because suggestions don't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    suggestFriends: (data || []) as ISuggestFriend[],
    isFetched,
    isFetching,
    isError,
    error,
  };
}
