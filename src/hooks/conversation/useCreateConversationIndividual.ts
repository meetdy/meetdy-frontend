import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import { TCreateConversationResponse } from '@/models/conversation.model';
import ServiceConversation from '@/api/conversationApi';

export function useCreateConversationIndividual() {
  return useMutation<TCreateConversationResponse, unknown, string>({
    mutationKey: createQueryKey('createConversationIndividual', {}),
    mutationFn: (userId: string) =>
      ServiceConversation.createConversationIndividual(userId),
  });
}
