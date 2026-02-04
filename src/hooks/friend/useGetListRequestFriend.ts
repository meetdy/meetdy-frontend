import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { IRequestFriend } from '@/models/friend.model';
import FriendService from '@/api/friendApi';

export const createKeyListRequestFriend = () =>
  createQueryKey('fetchListRequestFriend', {});

interface UseGetListRequestFriendProps {
  enabled?: boolean;
}

export function useGetListRequestFriend({
  enabled = true,
}: UseGetListRequestFriendProps = {}) {
  const { data, isFetched, isFetching, isError, error } = useQuery<
    IRequestFriend[]
  >({
    queryKey: createKeyListRequestFriend(),
    queryFn: () => FriendService.getListRequestFriend(),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter because requests change frequently
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    requestFriends: (data || []) as IRequestFriend[],
    isFetched,
    isFetching,
    isError,
    error,
  };
}
