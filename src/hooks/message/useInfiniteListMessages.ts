import { useInfiniteQuery } from '@tanstack/react-query';
import ServiceMessages from '@/api/messageApi';
import ServiceChannel from '@/api/channelApi';
import { createQueryKey } from '@/queries/core';
import { IMessage } from '@/models/message.model';

type TFetchListMessages = {
  conversationId?: string; // Made optional to support channel/conversation split if needed, though usually one is required
  channelId?: string;
  size?: number;
};

export const fetchListMessagesKey = ({
  conversationId,
  channelId,
  size,
}: TFetchListMessages) =>
  createQueryKey('fetchListMessages', { conversationId, channelId, size });

export function useInfiniteListMessages({
  conversationId,
  channelId,
  size = 10,
  enabled = true,
}: {
  conversationId?: string;
  channelId?: string;
  size?: number;
  enabled?: boolean;
}) {
  return useInfiniteQuery<IMessage>({
    queryKey: fetchListMessagesKey({ conversationId, channelId, size }),
    queryFn: async ({ pageParam = 0 }) => {
      if (channelId) {
        const response = await ServiceChannel.getMessageInChannel(
          channelId,
          pageParam as number,
          size
        );
        // Normalize channel response to match IMessage structure
        const totalPages = Math.ceil(response.total / size);
        return {
          data: response.data,
          page: pageParam as number,
          totalPages,
        };
      }

      if (conversationId) {
        const response = await ServiceMessages.getListMessages(
          conversationId,
          pageParam as number,
          size
        );
        return response;
      }

      return { data: [], page: 0, totalPages: 0 };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: enabled && (!!conversationId || !!channelId),
    staleTime: 1000 * 30,
  });
}
