/**
 * useRetryMessage – Re-sends a previously failed optimistic message.
 *
 * This works by:
 * 1. Removing the failed message from cache
 * 2. Re-invoking useSendMessage with the same payload
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { chatKeys } from './chatKeys';
import { removeMessageById, type MessagesCache } from './messageCacheUtils';
import { useSendMessage, type SendMessageInput } from './useSendMessage';

export function useRetryMessage() {
  const queryClient = useQueryClient();
  const sendMutation = useSendMessage();

  const retry = useCallback(
    (failedMessage: any) => {
      const conversationId = failedMessage.conversationId;
      const channelId = failedMessage.channelId;
      const messagesKey = chatKeys.messages.infinite(conversationId, channelId);

      // Remove the failed message from cache first
      queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
        removeMessageById(old, failedMessage._id),
      );

      // Re-send with the same content
      const input: SendMessageInput = {
        content: failedMessage.content,
        conversationId,
        channelId,
        type: failedMessage.type || 'TEXT',
        tags: failedMessage.tagUsers?.map((u: any) => u._id) || [],
        replyMessageId: failedMessage.replyMessage?._id,
      };

      sendMutation.mutate(input);
    },
    [queryClient, sendMutation],
  );

  return { retry, isPending: sendMutation.isPending };
}
