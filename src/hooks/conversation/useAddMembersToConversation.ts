import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useAddMembersToConversation() {
  return useMutation<
    void,
    unknown,
    { userIds: Array<string>; conversationId: string }
  >({
    mutationKey: createQueryKey('addMembersToConversation', {}),
    mutationFn: ({ userIds, conversationId }) =>
      ServiceConversation.addMembersToConversation(userIds, conversationId),
  });
}
