import { useQuery } from '@tanstack/react-query';
import { TFetchFriends, IFriend } from '@/models/friend.model';
import FriendService from '@/api/friendApi';
import { createQueryKey } from '@/queries/core';

export const createKeyGetFriends = (params: TFetchFriends) =>
  createQueryKey('getFriends', params);

interface UseGetFriendsProps {
  params: TFetchFriends;
  enabled?: boolean;
}

export function useGetFriends({ params, enabled = true }: UseGetFriendsProps) {
  const { data, isFetched, isFetching, isError, error } = useQuery<IFriend[]>({
    queryKey: createKeyGetFriends(params),
    queryFn: () => FriendService.getFriends(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  return {
    friends: (data || []) as IFriend[],
    isFetched,
    isFetching,
    isError,
    error,
  };
}
