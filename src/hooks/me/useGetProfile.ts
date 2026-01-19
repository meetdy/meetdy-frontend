import ServiceMe from '@/api/meApi';
import { IUserProfile } from '@/models/auth.model';
import { createQueryKey } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetProfile({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const { data, isFetched } = useQuery<IUserProfile>({
    queryKey: createQueryKey('profile', {}),
    queryFn: () => ServiceMe.getProfile(),
    enabled,
  });

  return { profile: data as IUserProfile, isFetched };
}
