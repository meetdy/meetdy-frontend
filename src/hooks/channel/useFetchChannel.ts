import { useQuery } from '@tanstack/react-query';
import { createQueryKey, queryClient } from '@/queries/core';
import ServiceChannel from '@/api/channelApi';

interface UseFetchChannelProps {
  conversationId: string;
  enabled?: boolean;
}

export function useFetchChannel({
  conversationId,
  enabled = true,
}: UseFetchChannelProps) {
  const { data, isFetched } = useQuery<any>({
    queryKey: createQueryKey('fetchChannel', { conversationId }),
    queryFn: () => ServiceChannel.getChannel(conversationId),
    enabled,
  });
  return {
    channel: data,
    isFetched,
  };
}

export async function checkAndFetchChannel(
  conversationId: string,
): Promise<any> {
  const cachedChannel = queryClient.getQueryData<any>(
    createQueryKey('fetchChannel', { conversationId }),
  );
  if (cachedChannel) return cachedChannel;

  const channel = await queryClient.getQuery({
    queryKey: createQueryKey('fetchChannel', { conversationId }),
    queryFn: () => ServiceChannel.getChannel(conversationId),
    staleTime: Infinity,
  });
  return channel;
}
