import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useLeaveConversationGroup() {
  return useMutation<void, unknown, string>({
    mutationKey: createQueryKey('leaveConversationGroup', {}),
    mutationFn: (conversationId: string) =>
      ServiceConversation.leaveGroup(conversationId),
  });
}
