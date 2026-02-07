import ServiceMe from '@/api/meApi';
import { IUserProfile } from '@/models/auth.model';
import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

export function useGetProfile({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<IUserProfile>({
    queryKey: createQueryKey('profile', {}),
    queryFn: () => ServiceMe.getProfile(),
    enabled,
  });
}

export async function fetchUserProfile(): Promise<IUserProfile> {
  return queryClient.fetchQuery<IUserProfile>({
    queryKey: createQueryKey('profile', {}),
    queryFn: ServiceMe.getProfile,
    staleTime: 5 * 60 * 1000,
  });
}
