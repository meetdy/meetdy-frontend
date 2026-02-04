import FriendService from '@/api/friendApi';
import { IRequestFriend } from '@/models/friend.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export const createKeyMyRequestFriend = () =>
  createQueryKey('fetchMyRequestFriend', {});

export function useGetMyRequestFriend({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data, isFetched, isFetching, isError, error } = useQuery<
    IRequestFriend[]
  >({
    queryKey: createKeyMyRequestFriend(),
    queryFn: () => FriendService.getMyRequestFriend(),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    myRequestFriends: (data || []) as IRequestFriend[],
    isFetched,
    isFetching,
    isError,
    error,
  };
}
