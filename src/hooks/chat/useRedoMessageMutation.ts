/**
 * useRedoMessage – Optimistic mutation for recalling / undoing a message.
 *
 * Instead of removing the message from the cache, it marks `isDeleted: true`
 * so the UI can render "This message has been recalled" in-place.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import ServiceMessages from '@/api/messageApi';
import { chatKeys } from './chatKeys';
import { markMessageDeleted, type MessagesCache } from './messageCacheUtils';

interface RedoMessageInput {
  messageId: string;
  conversationId: string;
  channelId?: string;
}

interface MutationContext {
  previousMessages: MessagesCache | undefined;
}

export function useRedoMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RedoMessageInput, MutationContext>({
    mutationFn: ({ messageId }) => ServiceMessages.redoMessage(messageId),

    onMutate: async (input) => {
      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );

      await queryClient.cancelQueries({ queryKey: messagesKey });

      const previousMessages =
        queryClient.getQueryData<MessagesCache>(messagesKey);

      // Optimistically mark as deleted
      queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
        markMessageDeleted(old, input.messageId),
      );

      return { previousMessages };
    },

    onError: (_error, input, context) => {
      if (!context) return;

      // Rollback
      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );
      queryClient.setQueryData(messagesKey, context.previousMessages);
    },

    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages.infinite(
          input.conversationId,
          input.channelId,
        ),
      });
    },
  });
}
