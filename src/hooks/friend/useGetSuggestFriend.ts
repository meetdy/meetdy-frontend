import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { ISuggestFriend } from '@/models/friend.model';
import FriendService from '@/api/friendApi';

type TFetchSuggestFriend = {
  page: number;
  size: number;
};

const fetchSuggestFriendQueryKey = (page: number, size: number) =>
  createQueryKey('fetchSuggestFriend', { page, size });

interface UseFetchSuggestFriendProps {
  params: TFetchSuggestFriend;
  enabled?: boolean;
}
export function useGetSuggestFriend({
  params: { page, size },
  enabled = true,
}: UseFetchSuggestFriendProps) {
  const { data, isFetched, isFetching } = useQuery<ISuggestFriend[]>({
    queryKey: fetchSuggestFriendQueryKey(page, size),
    queryFn: () => FriendService.getSuggestFriend(page, size),
    enabled,
  });

  return {
    suggestFriends: (data || []) as ISuggestFriend[],
    isFetched,
    isFetching,
  };
}
