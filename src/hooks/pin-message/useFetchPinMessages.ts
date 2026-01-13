import ServicePinMessage, { IPinMessage } from '@/api/pinMessageApi';
import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

interface UseFetchPinMessagesProps {
  conversationId: string;
  enabled?: boolean;
}
export function useFetchPinMessages({
  conversationId,
  enabled = true,
}: UseFetchPinMessagesProps) {
  const { data, isFetched } = useQuery<IPinMessage[]>({
    queryKey: createQueryKey('fetchPinMessages', { conversationId }, {}),
    queryFn: () => ServicePinMessage.getPinMessages(conversationId),
    enabled,
  });
  return {
    pinMessages: (data || []) as IPinMessage[],
    isFetched,
  };
}

export async function checkAndFetchPinMessages(
  id: string,
): Promise<IPinMessage[]> {
  const cachedPinMessages = queryClient.getQueryData<IPinMessage[]>(
    createQueryKey('fetchPinMessages', { id }),
  );
  if (cachedPinMessages) return cachedPinMessages;

  const pinMessages = await queryClient.getQuery({
    queryKey: createQueryKey('fetchPinMessages', { id }),
    queryFn: () => ServicePinMessage.getPinMessages(id),
    staleTime: Infinity,
  });
  return pinMessages;
}
