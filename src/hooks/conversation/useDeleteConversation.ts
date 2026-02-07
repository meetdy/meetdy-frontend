import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useDeleteConversation() {
  return useMutation<void, unknown, string>({
    mutationKey: createQueryKey('deleteConversation', {}),
    mutationFn: (id: string) => ServiceConversation.deleteConversation(id),
  });
}
