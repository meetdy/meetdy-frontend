import FriendService from '@/api/friendApi';
import { IRequestFriend } from '@/models/friend.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useFetchMyRequestFriend({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data, isFetched, isFetching } = useQuery<IRequestFriend[]>({
    queryKey: createQueryKey('fetchMyRequestFriend', {}),
    queryFn: () => FriendService.getMyRequestFriend(),
    enabled,
  });

  return {
    myRequestFriends: (data || []) as IRequestFriend[],
    isFetched,
    isFetching,
  };
}
