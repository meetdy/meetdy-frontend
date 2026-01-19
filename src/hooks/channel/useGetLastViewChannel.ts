import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceChannel from '@/api/channelApi';

interface UseFetchLastViewChannelProps {
  channelId: string;
  enabled?: boolean;
}
export function useGetLastViewChannel({
  channelId,
  enabled = true,
}: UseFetchLastViewChannelProps) {
  return useQuery<{ lastViewedAt: string }>({
    queryKey: createQueryKey('fetchLastViewChannel', { channelId }),
    queryFn: () => ServiceChannel.getLastViewChannel(channelId),
    enabled,
  });
}
