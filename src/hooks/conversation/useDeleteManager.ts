import { useMutation } from '@tanstack/react-query';
import { createQueryKey } from '@/queries/core';
import ServiceConversation from '@/api/conversationApi';

export function useDeleteManager() {
  return useMutation<
    void,
    unknown,
    { conversationId: string; userIds: string[] }
  >({
    mutationKey: createQueryKey('deleteManager', {}),
    mutationFn: ({
      conversationId,
      userIds,
    }: {
      conversationId: string;
      userIds: string[];
    }) => ServiceConversation.deleteManager(conversationId, userIds),
  });
}
