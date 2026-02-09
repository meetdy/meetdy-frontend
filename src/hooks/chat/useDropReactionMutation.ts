/**
 * useDropReactionMutation – Adds/updates a reaction on a message with
 * optimistic UI update.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import ServiceMessages from '@/api/messageApi';
import type { RootState } from '@/redux/store';
import { chatKeys } from './chatKeys';
import { updateReaction, type MessagesCache } from './messageCacheUtils';

interface DropReactionInput {
  messageId: string;
  type: string;
  conversationId: string;
  channelId?: string;
}

interface MutationContext {
  previousMessages: MessagesCache | undefined;
}

export function useDropReactionMutation() {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.global.user);

  return useMutation<void, Error, DropReactionInput, MutationContext>({
    mutationFn: ({ messageId, type }) =>
      ServiceMessages.dropReaction({ messageId, type }),

    onMutate: async (input) => {
      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );

      await queryClient.cancelQueries({ queryKey: messagesKey });

      const previousMessages =
        queryClient.getQueryData<MessagesCache>(messagesKey);

      if (user) {
        queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
          updateReaction(
            old,
            input.messageId,
            { _id: (user as any)._id, name: (user as any).name },
            input.type,
          ),
        );
      }

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
