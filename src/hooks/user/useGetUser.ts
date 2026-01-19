import ServiceUser from '@/api/userApi';
import { ISuggestFriend } from '@/models/friend.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

type TFetchUser = {
  username: string;
};

interface UseFetchUserProps {
  params: TFetchUser;
  enabled?: boolean;
}
export function useGetUser({
  params: { username },
  enabled = true,
}: UseFetchUserProps) {
  return useQuery<ISuggestFriend>({
    queryKey: createQueryKey('fetchUser', { username }, {}),
    queryFn: () => ServiceUser.getUser(username),
    enabled,
  });
}
