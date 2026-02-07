import { useQuery } from '@tanstack/react-query';
import { TFetchFriends, IFriend } from '@/models/friend.model';
import FriendService from '@/api/friendApi';
import { createQueryKey } from '@/queries/core';

export const createKeyGetFriends = (params?: TFetchFriends) =>
  createQueryKey('getFriends', params);

interface UseGetFriendsProps {
  params?: TFetchFriends;
}

export function useGetFriends({ params }: UseGetFriendsProps) {
  return useQuery<IFriend[]>({
    queryKey: createKeyGetFriends(params),
    queryFn: () => FriendService.getFriends(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}
