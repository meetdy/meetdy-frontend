/**
 * useMessages – Infinite-scrolling message list powered by React Query.
 *
 * Replaces:
 *   - Redux `state.chat.messages`
 *   - `fetchListMessages` / `fetchMessageInChannel` async thunks
 *   - `setRaisePage` reducer
 *
 * Supports both conversation-level and channel-level messages by switching
 * the API call based on whether `channelId` is provided.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import ServiceMessages from '@/api/messageApi';
import ServiceChannel from '@/api/channelApi';
import { chatKeys } from './chatKeys';
import type { IMessage } from '@/models/message.model';

export interface UseMessagesOptions {
  conversationId?: string;
  channelId?: string;
  size?: number;
  enabled?: boolean;
}

export function useMessages({
  conversationId = '',
  channelId,
  size = 20,
  enabled = true,
}: UseMessagesOptions) {
  const queryKey = chatKeys.messages.infinite(conversationId, channelId);

  const query = useInfiniteQuery<IMessage>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      if (channelId) {
        const response = await ServiceChannel.getMessageInChannel(
          channelId,
          pageParam as number,
          size,
        );
        return {
          data: response.data,
          page: pageParam as number,
          totalPages: Math.ceil(response.total / size),
        };
      }

      if (conversationId) {
        return ServiceMessages.getListMessages(
          conversationId,
          pageParam as number,
          size,
        );
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
    refetchOnWindowFocus: false,
  });

  // Flatten all pages: reverse page order so oldest messages come first,
  // then flatten each page's data array.
  const messages =
    query.data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.data.slice()) ?? [];

  return {
    ...query,
    messages,
    queryKey,
  };
}
