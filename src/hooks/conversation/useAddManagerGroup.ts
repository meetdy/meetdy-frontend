import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useAddManagerGroup() {
  return useMutation<
    void,
    unknown,
    { conversationId: string; userIds: string[] }
  >({
    mutationKey: createQueryKey('addManagerGroup', {}),
    mutationFn: ({
      conversationId,
      userIds,
    }: {
      conversationId: string;
      userIds: string[];
    }) => ServiceConversation.addManagerGroup(conversationId, userIds),
  });
}
