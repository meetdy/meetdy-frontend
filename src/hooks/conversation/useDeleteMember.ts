import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useDeleteMember() {
  return useMutation({
    mutationKey: createQueryKey('deleteMember', {}),
    mutationFn: ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => ServiceConversation.deleteMember(conversationId, userId),
  });
}
