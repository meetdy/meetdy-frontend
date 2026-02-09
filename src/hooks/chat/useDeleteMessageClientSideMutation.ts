/**
 * useDeleteMessageClientSideMutation – Removes a message only from the current
 * user's view (client-side delete). The message remains visible to other users.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import ServiceMessages from '@/api/messageApi';
import { chatKeys } from './chatKeys';
import { removeMessageById, type MessagesCache } from './messageCacheUtils';

interface DeleteInput {
  messageId: string;
  conversationId: string;
  channelId?: string;
}

interface MutationContext {
  previousMessages: MessagesCache | undefined;
}

export function useDeleteMessageClientSideMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteInput, MutationContext>({
    mutationFn: ({ messageId }) =>
      ServiceMessages.deleteMessageClientSide(messageId),

    onMutate: async (input) => {
      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );

      await queryClient.cancelQueries({ queryKey: messagesKey });

      const previousMessages =
        queryClient.getQueryData<MessagesCache>(messagesKey);

      // Optimistically remove from cache
      queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
        removeMessageById(old, input.messageId),
      );

      return { previousMessages };
    },

    onError: (_error, input, context) => {
      if (!context) return;
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
