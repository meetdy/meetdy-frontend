import ServiceMessages from '@/api/messageApi';
import {
  ILastGroupMessage,
  ILastIndividualMessage,
  IMessage,
} from '@/models/message.model';
import { createQueryKey, queryClient } from '@/queries/core';
import { useQuery } from '@tanstack/react-query';

type TFetchListMessages = {
  conversationId: string;
  page?: number;
  size?: number;
};

export const createKeyGetListMessages = ({
  conversationId,
  page,
  size,
}: TFetchListMessages) =>
  createQueryKey('fetchListMessages', { conversationId, page, size });

interface UseFetchListMessagesProps {
  params: TFetchListMessages;
  enabled?: boolean;
}
export function useGetListMessages({
  params: { conversationId, page, size },
  enabled = true,
}: UseFetchListMessagesProps) {
  const { data, isFetched } = useQuery<IMessage>({
    queryKey: createQueryKey('fetchListMessages', { conversationId, page, size }),
    queryFn: () => ServiceMessages.getListMessages(conversationId, page, size),
    enabled,
  });
  return {
    messages: (data || []) as (ILastGroupMessage | ILastIndividualMessage)[],
    isFetched,
  };
}

export async function checkAndFetchListMessages({
  conversationId,
  page,
  size,
}: TFetchListMessages): Promise<IMessage> {
  const cachedMessages = queryClient.getQueryData<IMessage>(
    createKeyGetListMessages({ conversationId, page, size }),
  );
  if (cachedMessages) return cachedMessages;

  const messages = await queryClient.fetchQuery({
    queryKey: createKeyGetListMessages({ conversationId, page, size }),
    queryFn: () => ServiceMessages.getListMessages(conversationId, page, size),
    staleTime: Infinity,
  });
  return messages;
}
