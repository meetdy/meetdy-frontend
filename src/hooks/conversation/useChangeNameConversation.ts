import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useChangeNameConversation() {
  return useMutation({
    mutationKey: createQueryKey('changeNameConversation', {}),
    mutationFn: ({
      conversationId,
      name,
    }: {
      conversationId: string;
      name: string;
    }) => ServiceConversation.changeNameConversation(conversationId, name),
  });
}
